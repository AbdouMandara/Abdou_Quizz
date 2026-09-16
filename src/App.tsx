import { useState, useCallback } from "react";
import { useTheme } from "./hooks/useTheme";
import { useGameState, useOnboarding, useToast } from "./hooks/useGameState";
import { generateQuiz, generateDynamicQuiz } from "./utils/quiz";
import { soundBoss, soundLevelUp, soundBadgeUnlock, hapticLight } from "./utils/sounds";
import { BADGES, type BadgeStats } from "./data/badges";
import { RANKS, getRankForLevel, getLevelFromXP } from "./data/ranks";

import { TopBar } from "./components/TopBar";
import { BottomNav } from "./components/BottomNav";
import { Toast } from "./components/Toast";
import { Onboarding } from "./components/Onboarding";

import { Home } from "./pages/Home";
import { Categories } from "./pages/Categories";
import { LevelSelect } from "./pages/LevelSelect";
import { Quiz } from "./pages/Quiz";
import { Results } from "./pages/Results";
import { Profile } from "./pages/Profile";
import { ProfileSelect } from "./pages/ProfileSelect";
import { Stats } from "./pages/Stats";
import { Settings } from "./pages/Settings";

type Page = "home" | "categories" | "level-select" | "quiz" | "results" | "profile" | "profile-select" | "stats" | "settings";

function App() {
  const { dark, toggle: toggleTheme } = useTheme();
  const { state, updateState, resetState } = useGameState();
  const { showOnboarding, finishOnboarding } = useOnboarding();
  const { toast, showToast } = useToast();

  const [page, setPage] = useState<Page>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("culture");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizMode, setQuizMode] = useState("classique");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizXp, setQuizXp] = useState(0);
  const [quizMaxStreak, setQuizMaxStreak] = useState(0);

  const navigate = useCallback((p: string) => {
    setPage(p as Page);
    window.scrollTo(0, 0);
  }, []);

  const handleSelectCategory = useCallback((catId: string) => {
    setSelectedCategory(catId);
    setPage("level-select");
    window.scrollTo(0, 0);
  }, []);

  const handleStartQuiz = useCallback((category: string, level: string, mode: string, count: number) => {
    let questions;
    if (["challenge", "extreme", "survie"].includes(mode)) {
      questions = generateDynamicQuiz(mode, count, state.recentGlobalKeys);
    } else {
      questions = generateQuiz(category, level, count, state.recentGlobalKeys);
    }
    setQuizQuestions(questions);
    setQuizMode(mode);
    setPage("quiz");
    window.scrollTo(0, 0);

    if (["challenge", "extreme", "survie"].includes(mode)) {
      setTimeout(() => soundBoss(), 300);
    }
  }, [state.recentGlobalKeys]);

  const handleFinishQuiz = useCallback((answers: (number | null)[], timePerQuestion: number) => {
    const correct = answers.filter((a, i) => a === quizQuestions[i]?.correct).length;
    const total = quizQuestions.length;
    const baseXp = correct * 10;

    // Calculate score and streak
    let score = 0;
    let streak = 0;
    let maxStreak = 0;
    quizQuestions.forEach((q, i) => {
      if (answers[i] === q.correct) {
        streak++;
        const basePoints = q.points ?? 10;
        score += basePoints;
        if (streak === 3) score += 10;
        if (streak === 5) score += 20;
        if (streak === 10) score += 50;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    });

    const hadPerfect = correct === total;
    const hadFastAnswer = timePerQuestion < 5;

    // Update global state
    updateState(prev => {
      const newXp = prev.xp + baseXp;
      const newLevel = getLevelFromXP(newXp);
      const prevLevel = getLevelFromXP(prev.xp);
      const prevRank = getRankForLevel(prevLevel);
      const newRank = getRankForLevel(newLevel);

      // Rank up sounds
      if (newRank.letter !== prevRank.letter) {
        setTimeout(() => { soundLevelUp(); hapticLight(); }, 800);
      }

      // Badge checks
      const stats: BadgeStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        maxStreak: Math.max(prev.maxStreak, maxStreak),
        hadPerfect: hadPerfect || prev.hadPerfect,
        questionsAnswered: prev.questionsAnswered + total,
        hadFastAnswer: hadFastAnswer || prev.hadFastAnswer,
        expertWins: prev.expertWins + (quizQuestions.some(q => q.level === "expert") && correct > total / 2 ? 1 : 0),
        totalCorrect: prev.correctAnswers + correct,
        categoriesPlayed: prev.categoriesPlayed.length,
        gamesWon: prev.gamesWon + (correct > total / 2 ? 1 : 0),
        survivalWins: prev.survivalWins + (quizMode === "survie" && correct > total / 2 ? 1 : 0),
        fastestTime: prev.fastestQuizTime,
        sharpestStreak: Math.max(prev.maxStreak, maxStreak),
        ranksReached: RANKS.filter(r => newLevel >= r.minLevel).map(r => r.letter).join(","),
        answeredIn2s: prev.answeredIn2sCount,
      };

      const newBadges = BADGES.filter(b => !prev.badgesUnlocked.includes(b.id) && b.check(stats));
      if (newBadges.length > 0) {
        setTimeout(() => { soundBadgeUnlock(); hapticLight(); }, 1200);
      }

      // Category stats
      const catStats = { ...prev.categoryStats };
      quizQuestions.forEach((q, i) => {
        if (!catStats[q.category]) catStats[q.category] = { correct: 0, total: 0 };
        catStats[q.category].total++;
        if (answers[i] === q.correct) catStats[q.category].correct++;
      });

      // History
      const newHistory = [...prev.history, {
        date: new Date().toISOString(),
        category: selectedCategory,
        level: quizQuestions[0]?.level ?? "facile",
        score,
        total,
        correct,
      }].slice(-20);

      // Categories played
      const catsPlayed = [...new Set([...prev.categoriesPlayed, selectedCategory])];

      // Recent keys
      const newKeys = [...prev.recentGlobalKeys, ...quizQuestions.map(q => q.question)].slice(-60);

      return {
        xp: newXp,
        bestScore: Math.max(prev.bestScore, score),
        gamesPlayed: prev.gamesPlayed + 1,
        questionsAnswered: prev.questionsAnswered + total,
        correctAnswers: prev.correctAnswers + correct,
        wrongAnswers: prev.wrongAnswers + (total - correct),
        maxStreak: Math.max(prev.maxStreak, maxStreak),
        hadPerfect: hadPerfect || prev.hadPerfect,
        hadFastAnswer: hadFastAnswer || prev.hadFastAnswer,
        expertWins: stats.expertWins,
        categoryStats: catStats,
        history: newHistory,
        badgesUnlocked: [...prev.badgesUnlocked, ...newBadges.map(b => b.id)],
        recentGlobalKeys: newKeys,
        categoriesPlayed: catsPlayed,
        gamesWon: stats.gamesWon,
        survivalWins: stats.survivalWins,
        answeredIn2sCount: prev.answeredIn2sCount,
      };
    });

    setQuizAnswers(answers);
    setQuizScore(score);
    setQuizXp(baseXp);
    setQuizMaxStreak(maxStreak);
    setPage("results");
    window.scrollTo(0, 0);
  }, [quizQuestions, selectedCategory, quizMode, updateState]);

  const handleReplay = useCallback(() => {
    const q = quizQuestions;
    if (q.length > 0) {
      const first = q[0];
      handleStartQuiz(selectedCategory, first.level ?? "facile", quizMode, q.length);
    }
  }, [quizQuestions, selectedCategory, quizMode, handleStartQuiz]);

  const handleToggleSound = useCallback(() => {
    updateState(prev => ({
      prefs: { ...prev.prefs, sound: !prev.prefs.sound },
    }));
  }, [updateState]);

  const handleToggleAnim = useCallback(() => {
    updateState(prev => ({
      prefs: { ...prev.prefs, anim: !prev.prefs.anim },
    }));
  }, [updateState]);

  const handleSelectProfile = useCallback((type: string) => {
    updateState(() => ({ profileType: type }));
    setPage("profile");
    showToast(`Profil mis à jour : ${type}`);
  }, [updateState, showToast]);

  if (showOnboarding) {
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return (
    <>
      <TopBar title="NEO QUIZ" dark={dark} onToggleTheme={toggleTheme} />

      <div className="flex-1">
        {page === "home" && (
          <Home state={state} onNavigate={navigate} />
        )}
        {page === "categories" && (
          <Categories onSelect={handleSelectCategory} />
        )}
        {page === "level-select" && (
          <LevelSelect
            category={selectedCategory}
            onStart={handleStartQuiz}
            onBack={() => navigate("categories")}
          />
        )}
        {page === "quiz" && quizQuestions.length > 0 && (
          <Quiz
            questions={quizQuestions}
            mode={quizMode}
            onFinish={handleFinishQuiz}
          />
        )}
        {page === "results" && (
          <Results
            questions={quizQuestions}
            answers={quizAnswers}
            score={quizScore}
            xpGained={quizXp}
            maxStreak={quizMaxStreak}
            state={state}
            onReplay={handleReplay}
            onHome={() => navigate("home")}
            onStats={() => navigate("stats")}
          />
        )}
        {page === "profile" && (
          <Profile state={state} onNavigate={navigate} />
        )}
        {page === "profile-select" && (
          <ProfileSelect current={state.profileType} onSelect={handleSelectProfile} />
        )}
        {page === "stats" && (
          <Stats state={state} />
        )}
        {page === "settings" && (
          <Settings
            state={state}
            dark={dark}
            onToggleTheme={toggleTheme}
            onToggleSound={handleToggleSound}
            onToggleAnim={handleToggleAnim}
            onReset={resetState}
          />
        )}
      </div>

      {!["quiz", "results", "level-select"].includes(page) && (
        <BottomNav current={page} onNavigate={navigate} />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}

export default App;
