import { useState, useEffect } from "react";
import { soundFinish, soundVictory } from "../utils/sounds";
import { BADGES } from "../data/badges";
import { RANKS, getRankForLevel, getLevelFromXP } from "../data/ranks";
import { calculateNote } from "../utils/quiz";
import { RankBadgeInline } from "../components/XPBar";
import type { GameState } from "../hooks/useGameState";

interface ResultsProps {
  questions: any[];
  answers: (number | null)[];
  score: number;
  xpGained: number;
  maxStreak: number;
  state: GameState;
  onReplay: () => void;
  onHome: () => void;
  onStats: () => void;
}

function Confetti() {
  const colors = ["#5b53f0", "#d4af6a", "#16a34a", "#dc2626", "#f59e0b", "#ec4899"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${Math.random() * 100}%`,
          top: `${-10 + Math.random() * 20}%`,
          background: colors[i % colors.length],
          animationDelay: `${Math.random() * 0.8}s`,
          animationDuration: `${1 + Math.random() * 1}s`,
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
        }} />
      ))}
    </div>
  );
}

export function Results({ questions, answers, score, xpGained, maxStreak, state, onReplay, onHome, onStats }: ResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  // Score animation

  const correct = answers.filter((a, i) => a === questions[i].correct).length;
  const total = questions.length;
  const { note, appreciation } = calculateNote(correct, total);
  const pct = Math.round((correct / total) * 100);

  const prevRank = getRankForLevel(getLevelFromXP(state.xp - xpGained));
  const newRank = getRankForLevel(getLevelFromXP(state.xp));
  const rankUp = newRank.letter !== prevRank.letter;

  const newBadges = BADGES.filter(b => {
    const stats = {
      gamesPlayed: state.gamesPlayed + 1,
      maxStreak: Math.max(state.maxStreak, maxStreak),
      hadPerfect: correct === total || state.hadPerfect,
      questionsAnswered: state.questionsAnswered + total,
      hadFastAnswer: state.hadFastAnswer,
      expertWins: state.expertWins + (questions.some(q => q.level === "expert") && correct > total / 2 ? 1 : 0),
      totalCorrect: state.correctAnswers + correct,
      categoriesPlayed: state.categoriesPlayed.length,
      gamesWon: state.gamesWon + (correct > total / 2 ? 1 : 0),
      survivalWins: state.survivalWins,
      fastestTime: state.fastestQuizTime,
      sharpestStreak: Math.max(state.maxStreak, maxStreak),
      ranksReached: RANKS.filter(r => getLevelFromXP(state.xp) >= r.minLevel).map(r => r.letter).join(","),
      answeredIn2s: state.answeredIn2sCount,
    };
    return !state.badgesUnlocked.includes(b.id) && b.check(stats);
  });

  useEffect(() => {
    if (pct >= 80) {
      soundVictory();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    } else {
      soundFinish();
    }

    // Animated score counter
    let current = 0;
    const step = Math.max(1, Math.floor(score / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        current = score;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fadeIn px-4 pt-5 pb-24">
      {showConfetti && <Confetti />}

      {/* Hero */}
      <div className="text-center mb-5">
        <div className="text-4xl mb-1">🏆</div>
        <div className="text-lg font-extrabold" style={{ color: "var(--text)" }}>Quiz terminé</div>

        {/* Score circle */}
        <div className="relative w-36 h-36 mx-auto my-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle cx="60" cy="60" r="52" fill="none"
              stroke={pct >= 80 ? "#16a34a" : pct >= 50 ? "#5b53f0" : "#dc2626"}
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
              className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-black animate-countUp" style={{ color: "var(--text)" }}>
              {animatedScore}
            </div>
            <div className="text-xs" style={{ color: "var(--text-soft)" }}>/ {questions.length * 15} pts</div>
          </div>
        </div>

        <div className="text-[13px]" style={{ color: "var(--text-soft)" }}>{pct}% de réussite</div>
        <div className="text-[13px] font-bold mt-1" style={{ color: "#5b53f0" }}>
          Note : {note}/20 · {appreciation}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="text-xl font-extrabold" style={{ color: "#16a34a" }}>{correct}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Bonnes réponses</div>
        </div>
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="text-xl font-extrabold" style={{ color: "#dc2626" }}>{total - correct}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Mauvaises réponses</div>
        </div>
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="text-xl font-extrabold" style={{ color: "#5b53f0" }}>+{xpGained} XP</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>XP gagné</div>
        </div>
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="text-xl font-extrabold" style={{ color: "#f59e0b" }}>🔥 {maxStreak}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Meilleure série</div>
        </div>
      </div>

      {/* Rank up */}
      {rankUp && (
        <div className="flex items-center gap-3 p-4 rounded-2xl text-white font-extrabold mb-4 animate-rankup"
          style={{ background: `linear-gradient(135deg, ${newRank.color}, rgba(255,255,255,.08))`, boxShadow: "0 6px 18px rgba(0,0,0,.3)" }}>
          <RankBadgeInline xp={state.xp} />
          <div>
            <div className="text-sm">Rang up !</div>
            <div className="text-xs font-bold opacity-80">{newRank.name}</div>
          </div>
        </div>
      )}

      {/* New badges */}
      {newBadges.length > 0 && (
        <div className="mb-4">
          <div className="text-[13px] font-extrabold mb-2" style={{ color: "var(--text)" }}>🏅 Nouveaux badges !</div>
          {newBadges.map(b => (
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl mb-2 border animate-slideUp"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <span className="text-2xl">{b.emoji}</span>
              <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{b.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Share button */}
      <button
        onClick={() => {
          const text = `🏆 J'ai eu ${correct}/${total} (${pct}%) sur NEO QUIZ ! Score : ${score} pts. Tu peux faire mieux ?`;
          if (navigator.share) {
            navigator.share({ title: "NEO QUIZ", text });
          } else {
            navigator.clipboard.writeText(text);
            alert("Score copié dans le presse-papier !");
          }
        }}
        className="w-full py-3 mb-3 border rounded-2xl text-sm font-bold cursor-pointer"
        style={{ background: "var(--card)", color: "#5b53f0", borderColor: "#5b53f0" }}
      >
        📤 Partager mon score
      </button>

      <button
        onClick={onReplay}
        className="block w-full py-4 border-none rounded-2xl text-base font-bold cursor-pointer text-white"
        style={{ background: "linear-gradient(135deg, #5b53f0, #4338d6)", boxShadow: "0 6px 20px rgba(91,83,240,0.38)" }}
      >
        🔄 Rejouer
      </button>
      <div className="flex gap-3 mt-3">
        <button onClick={onHome}
          className="flex-1 py-3 border rounded-2xl text-sm font-bold cursor-pointer"
          style={{ background: "var(--card)", color: "var(--text)", borderColor: "var(--border)" }}>
          🏠 Accueil
        </button>
        <button onClick={onStats}
          className="flex-1 py-3 border rounded-2xl text-sm font-bold cursor-pointer"
          style={{ background: "var(--card)", color: "var(--text)", borderColor: "var(--border)" }}>
          📊 Statistiques
        </button>
      </div>
    </div>
  );
}
