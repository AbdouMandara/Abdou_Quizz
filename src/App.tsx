import { useState, useCallback, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useTheme } from "./hooks/useTheme";
import { useGameState, useOnboarding, useToast } from "./hooks/useGameState";
import { useDirection } from "./hooks/useDirection";
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

// ─── Shared quiz state context ─────────────────────────────────────
export interface QuizContextValue {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  quizQuestions: any[];
  quizMode: string;
  quizAnswers: (number | null)[];
  quizScore: number;
  quizXp: number;
  quizMaxStreak: number;
  startQuiz: (category: string, level: string, mode: string, count: number) => void;
  finishQuiz: (answers: (number | null)[], timePerQuestion: number) => void;
  replayQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);
export function useQuizContext() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuizContext must be used inside QuizProvider");
  return ctx;
}

// ─── Layout with animated transitions ──────────────────────────────
const HIDE_NAV_ROUTES = ["/quiz", "/results"];

function AppLayout() {
  const location = useLocation();
  const { direction, goTo, goBack } = useDirection();
  const { dark, toggle: toggleTheme } = useTheme();
  const { state, updateState, resetState } = useGameState();
  const { toast } = useToast();
  const nodeRef = useLocation(); // dummy ref for CSSTransition
  const locationKey = location.pathname + location.search;

  const quizCtx = useContext(QuizContext);
  const showNav = !HIDE_NAV_ROUTES.some(r => location.pathname.startsWith(r));

  // Determine CSS class for current direction
  const transitionClass = `slide-${direction}`;

  return (
    <>
      <TopBar
        title="NEO QUIZ"
        dark={dark}
        onToggleTheme={toggleTheme}
        showBack={!["/", "/categories", "/stats", "/profile", "/settings"].includes(location.pathname)}
        onBack={() => goBack("/")}
      />

      <div className="route-wrapper">
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={locationKey}
            classNames={transitionClass}
            timeout={350}
            nodeRef={nodeRef as any}
          >
            <div key={locationKey}>
              <Routes location={location}>
                <Route path="/" element={
                  <Home state={state} onNavigate={(p) => goTo(p === "categories" ? "/categories" : p === "stats" ? "/stats" : p === "profile" ? "/profile" : "/")} />
                } />
                <Route path="/categories" element={
                  <Categories onSelect={(catId) => {
                    quizCtx?.setSelectedCategory(catId);
                    goTo(`/categories/${catId}/level`);
                  }} />
                } />
                <Route path="/categories/:categoryId/level" element={
                  <LevelSelectWrapper />
                } />
                <Route path="/quiz" element={
                  <QuizWrapper />
                } />
                <Route path="/results" element={
                  <ResultsWrapper />
                } />
                <Route path="/profile" element={
                  <Profile state={state} onNavigate={(p) => goTo(p === "profile-select" ? "/profile/select" : p === "settings" ? "/settings" : "/")} />
                } />
                <Route path="/profile/select" element={
                  <ProfileSelectWrapper />
                } />
                <Route path="/stats" element={
                  <Stats state={state} />
                } />
                <Route path="/settings" element={
                  <Settings
                    state={state}
                    dark={dark}
                    onToggleTheme={toggleTheme}
                    onToggleSound={() => updateState(prev => ({ prefs: { ...prev.prefs, sound: !prev.prefs.sound } }))}
                    onToggleAnim={() => updateState(prev => ({ prefs: { ...prev.prefs, anim: !prev.prefs.anim } }))}
                    onReset={resetState}
                  />
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>

      {showNav && (
        <BottomNav />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}

// ─── Wrapper components to connect context ──────────────────────────
function LevelSelectWrapper() {
  const { selectedCategory, startQuiz } = useQuizContext();
  const { goBack } = useDirection();
  return (
    <LevelSelect
      category={selectedCategory}
      onStart={startQuiz}
      onBack={() => goBack("/categories")}
    />
  );
}

function QuizWrapper() {
  const { quizQuestions, quizMode, finishQuiz } = useQuizContext();
  if (quizQuestions.length === 0) return <Navigate to="/categories" replace />;
  return (
    <Quiz
      questions={quizQuestions}
      mode={quizMode}
      onFinish={finishQuiz}
    />
  );
}

function ResultsWrapper() {
  const { quizQuestions, quizAnswers, quizScore, quizXp, quizMaxStreak, replayQuiz } = useQuizContext();
  const { state } = useGameState();
  const { goTo } = useDirection();

  const pct = quizQuestions.length > 0
    ? Math.round((quizAnswers.filter((a, i) => a === quizQuestions[i]?.correct).length / quizQuestions.length) * 100)
    : 0;

  return (
    <Results
      questions={quizQuestions}
      answers={quizAnswers}
      score={quizScore}
      xpGained={quizXp}
      maxStreak={quizMaxStreak}
      state={state}
      onReplay={replayQuiz}
      onHome={() => goTo("/", pct >= 80)}
      onStats={() => goTo("/stats")}
    />
  );
}

function ProfileSelectWrapper() {
  const { state, updateState } = useGameState();
  const { showToast } = useToast();
  const { goTo } = useDirection();
  return (
    <ProfileSelect
      current={state.profileType}
      onSelect={(type) => {
        updateState(() => ({ profileType: type }));
        showToast(`Profil mis à jour : ${type}`);
        goTo("/profile");
      }}
    />
  );
}

// ─── Root App with providers ────────────────────────────────────────
function App() {
  const { showOnboarding, finishOnboarding } = useOnboarding();
  const { state, updateState } = useGameState();

  const [selectedCategory, setSelectedCategory] = useState("culture");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizMode, setQuizMode] = useState("classique");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizXp, setQuizXp] = useState(0);
  const [quizMaxStreak, setQuizMaxStreak] = useState(0);

  const startQuiz = useCallback((category: string, level: string, mode: string, count: number) => {
    let questions;
    if (["challenge", "extreme", "survie"].includes(mode)) {
      questions = generateDynamicQuiz(mode, count, state.recentGlobalKeys);
    } else {
      questions = generateQuiz(category, level, count, state.recentGlobalKeys);
    }
    setQuizQuestions(questions);
    setQuizMode(mode);
    if (["challenge", "extreme", "survie"].includes(mode)) {
      setTimeout(() => soundBoss(), 300);
    }
  }, [state.recentGlobalKeys]);

  const finishQuiz = useCallback((answers: (number | null)[], timePerQuestion: number) => {
    const correct = answers.filter((a, i) => a === quizQuestions[i]?.correct).length;
    const total = quizQuestions.length;
    const baseXp = correct * 10;

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

    updateState(prev => {
      const newXp = prev.xp + baseXp;
      const newLevel = getLevelFromXP(newXp);
      const prevLevel = getLevelFromXP(prev.xp);
      const prevRank = getRankForLevel(prevLevel);
      const newRank = getRankForLevel(newLevel);

      if (newRank.letter !== prevRank.letter) {
        setTimeout(() => { soundLevelUp(); hapticLight(); }, 800);
      }

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

      const catStats = { ...prev.categoryStats };
      quizQuestions.forEach((q, i) => {
        if (!catStats[q.category]) catStats[q.category] = { correct: 0, total: 0 };
        catStats[q.category].total++;
        if (answers[i] === q.correct) catStats[q.category].correct++;
      });

      const newHistory = [...prev.history, {
        date: new Date().toISOString(),
        category: selectedCategory,
        level: quizQuestions[0]?.level ?? "facile",
        score,
        total,
        correct,
      }].slice(-20);

      const catsPlayed = [...new Set([...prev.categoriesPlayed, selectedCategory])];
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
  }, [quizQuestions, selectedCategory, quizMode, updateState]);

  const replayQuiz = useCallback(() => {
    const q = quizQuestions;
    if (q.length > 0) {
      const first = q[0];
      startQuiz(selectedCategory, first.level ?? "facile", quizMode, q.length);
    }
  }, [quizQuestions, selectedCategory, quizMode, startQuiz]);

  if (showOnboarding) {
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return (
    <BrowserRouter>
      <QuizContext.Provider value={{
        selectedCategory,
        setSelectedCategory,
        quizQuestions,
        quizMode,
        quizAnswers,
        quizScore,
        quizXp,
        quizMaxStreak,
        startQuiz,
        finishQuiz,
        replayQuiz,
      }}>
        <AppLayout />
      </QuizContext.Provider>
    </BrowserRouter>
  );
}

export default App;
