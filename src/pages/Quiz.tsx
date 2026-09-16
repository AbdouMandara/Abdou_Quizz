import { useState, useEffect, useCallback } from "react";
import { soundCorrect, soundWrong, soundClick, hapticLight, hapticMedium } from "../utils/sounds";
import { CATEGORIES } from "../data/categories";
import { LEVELS } from "../data/levels";
import { difficultyInfo } from "../data/difficulty";
import type { NormalizedQuestion } from "../utils/quiz";

interface QuizProps {
  questions: NormalizedQuestion[];
  mode: string;
  onFinish: (answers: (number | null)[], timePerQuestion: number) => void;
}

export function Quiz({ questions, mode, onFinish }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timer, setTimer] = useState(20);
  const [lives, setLives] = useState(mode === "vies" || mode === "survie" ? 3 : 0);
  const [streak, setStreak] = useState(0);
  const [, setMaxStreak] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(
    mode === "extreme" ? 8 : mode === "survie" ? 5 : 1
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isBoss, setIsBoss] = useState(false);
  const [shakeAnswer, setShakeAnswer] = useState<number | null>(null);

  const current = questions[currentIndex];
  const categoryInfo = CATEGORIES.find(c => c.id === current?.category);
  const levelInfo = LEVELS.find(l => l.id === current?.level);
  const diffInfo = difficultyInfo(difficultyLevel);

  const timeForQuestion = mode === "entrainement" ? 999 :
    mode === "extreme" ? diffInfo.time :
    mode === "survie" ? diffInfo.time :
    levelInfo?.time ?? 20;

  const isTimerDisabled = mode === "entrainement" || mode === "classique";

  // Boss detection (every 10th question in dynamic modes)
  useEffect(() => {
    if (["challenge", "extreme", "survie"].includes(mode)) {
      setIsBoss((currentIndex + 1) % 10 === 0);
      if ((currentIndex + 1) % 10 === 0) {
        setDifficultyLevel(d => Math.min(10, d + 2));
      }
    }
  }, [currentIndex, mode]);

  // Timer
  useEffect(() => {
    if (isTimerDisabled || showFeedback || gameOver) return;
    setTimer(timeForQuestion);
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, showFeedback, gameOver, isTimerDisabled]);

  const handleTimeUp = useCallback(() => {
    if (showFeedback) return;
    soundWrong();
    hapticMedium();
    const newAnswers = [...answers];
    newAnswers[currentIndex] = -1;
    setAnswers(newAnswers);
    setShowFeedback(true);
    setSelectedAnswer(-1);
    setStreak(0);
    if (mode === "vies" || mode === "survie") {
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
    }
    if (["challenge", "extreme", "survie"].includes(mode)) {
      setDifficultyLevel(d => Math.max(mode === "extreme" ? 8 : mode === "survie" ? 3 : 1, d - 1));
    }
  }, [showFeedback, answers, currentIndex, mode]);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    const correct = current.correct;
    const isCorrect = index === correct;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
    setSelectedAnswer(index);
    setShowFeedback(true);

    if (isCorrect) {
      soundCorrect();
      hapticLight();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));
      const basePoints = current.points ?? 10;
      const diffMult = 1 + (difficultyLevel - 1) * 0.15;
      let pts = Math.round(basePoints * diffMult);
      if (isBoss) pts = Math.round(pts * 1.5);
      if (newStreak === 3) pts += 10;
      if (newStreak === 5) pts += 20;
      if (newStreak === 10) pts += 50;
      setScore(s => s + pts);

      if (["challenge", "extreme", "survie"].includes(mode)) {
        const thresholds = [3, 6, 9];
        if (thresholds.includes(newStreak) || (newStreak > 9 && newStreak % 5 === 0)) {
          setDifficultyLevel(d => Math.min(10, d + 1));
        }
      }
    } else {
      soundWrong();
      hapticMedium();
      setShakeAnswer(index);
      setTimeout(() => setShakeAnswer(null), 400);
      setStreak(0);
      if (mode === "vies" || mode === "survie") {
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
        });
      }
      if (["challenge", "extreme", "survie"].includes(mode)) {
        setDifficultyLevel(d => Math.max(mode === "extreme" ? 8 : mode === "survie" ? 3 : 1, d - 1));
      }
    }
  };

  const handleNext = () => {
    soundClick();
    if (gameOver || currentIndex >= questions.length - 1) {
      onFinish(answers, timeForQuestion);
    } else {
      setCurrentIndex(i => i + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
    }
  };

  if (!current) return null;

  const letters = ["A", "B", "C", "D"];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="px-4 pt-3 pb-24">
      {/* Progress bar */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
          style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
          {currentIndex + 1}/{questions.length}
        </span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: progress > 90 ? "#d4af6a" : progress > 75 ? "#16a34a" : "linear-gradient(90deg, #5b53f0, #e8cd97)" }} />
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
          style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
          {score} pts
        </span>
      </div>

      {/* HUD */}
      <div className="flex justify-between items-center mb-3.5 gap-2">
        {!isTimerDisabled && (
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold border ${
            timer <= 5 && !showFeedback ? "animate-pulse-warn" : ""
          }`}
            style={{
              background: "var(--card)",
              borderColor: timer <= 5 && !showFeedback ? "#dc2626" : "var(--border)",
              color: timer <= 5 && !showFeedback ? "#dc2626" : "var(--text)",
            }}>
            ⏱️ <span>{timer}</span>
          </div>
        )}
        {(mode === "vies" || mode === "survie") && (
          <div className="flex items-center gap-1 px-3 py-2 rounded-xl text-[13px] font-bold border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className={`text-base ${i < lives ? "" : "opacity-30"}`}>❤️</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold border"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}>
          🔥 <span>{streak}</span>
        </div>
        {["challenge", "extreme", "survie"].includes(mode) && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold border"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}>
            🔴 <span>{difficultyLevel}/10</span>
          </div>
        )}
      </div>

      {/* Boss indicator */}
      {isBoss && (
        <div className="text-center text-sm font-extrabold mb-3 py-2 rounded-xl"
          style={{ background: "linear-gradient(135deg, #dc2626, #f59e0b)", color: "white" }}>
          👑 QUESTION BOSS — Difficulté +2, Points x1.5 !
        </div>
      )}

      {/* Question card */}
      <div className="rounded-2xl p-5 border mb-4 animate-slideUp"
        style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)", borderTop: "3px solid #5b53f0" }}>
        <div className="text-[11px] uppercase tracking-wider mb-2 font-bold"
          style={{ color: "var(--text-soft)" }}>
          {categoryInfo?.emoji} {categoryInfo?.name} · {levelInfo?.emoji} {levelInfo?.name}
          {["challenge", "extreme", "survie"].includes(mode) && ` · ${diffInfo.emoji} ${diffInfo.name}`}
        </div>
        <div className="text-[17px] font-bold leading-relaxed" style={{ color: "var(--text)" }}>
          {current.question}
        </div>
      </div>

      {/* Answer buttons */}
      <div className="flex flex-col gap-2.5">
        {current.answers.map((answer, i) => {
          let borderColor = "var(--border)";
          let bgColor = "var(--card)";
          let extraClass = "";

          if (showFeedback) {
            if (i === current.correct) {
              borderColor = "#16a34a";
              bgColor = "rgba(22,163,74,0.12)";
            } else if (i === selectedAnswer && i !== current.correct) {
              borderColor = "#dc2626";
              bgColor = "rgba(220,38,38,0.12)";
              extraClass = shakeAnswer === i ? "animate-shake" : "";
            } else {
              extraClass = "opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showFeedback}
              className={`w-full text-left p-3.5 rounded-2xl border-2 font-medium text-[15px] flex items-center gap-2.5 cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:cursor-default ${extraClass}`}
              style={{ background: bgColor, borderColor, color: "var(--text)" }}
            >
              <span className="w-[26px] h-[26px] rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                style={{ background: "var(--bg)" }}>
                {letters[i]}
              </span>
              {answer}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-2 animate-fadeIn">
          <div className={`text-center py-2.5 rounded-xl font-extrabold text-sm mb-2 ${
            selectedAnswer === current.correct ? "" : ""
          }`}
            style={{
              background: selectedAnswer === current.correct ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
              color: selectedAnswer === current.correct ? "#16a34a" : "#dc2626",
            }}>
            {selectedAnswer === current.correct ? "✅ Bonne réponse !" : "❌ Mauvaise réponse"}
          </div>
          <div className="rounded-xl p-3.5 border-l-4"
            style={{ background: "var(--card)", borderLeftColor: "#5b53f0", boxShadow: "var(--shadow)" }}>
            <div className="text-xs font-extrabold mb-1" style={{ color: "var(--text-soft)" }}>💡 Explication</div>
            <div className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{current.explanation}</div>
          </div>
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-4 mt-4 border-none rounded-2xl text-base font-bold cursor-pointer text-white animate-fadeIn"
          style={{ background: "linear-gradient(135deg, #5b53f0, #4338d6)", boxShadow: "0 6px 20px rgba(91,83,240,0.38)" }}
        >
          {currentIndex >= questions.length - 1 || gameOver ? "🏆 Voir les résultats" : "Suivant ➜"}
        </button>
      )}
    </div>
  );
}
