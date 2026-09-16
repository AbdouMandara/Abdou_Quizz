import { useState } from "react";
import { soundClick } from "../utils/sounds";

interface OnboardingProps {
  onFinish: () => void;
}

const STEPS = [
  {
    emoji: "🧠",
    title: "Bienvenue sur NEO QUIZ",
    desc: "598 questions dans 13 catégories. Teste tes connaissances et progresse !",
  },
  {
    emoji: "📚",
    title: "Choisis ta catégorie",
    desc: "Culture générale, Maths, Physique, Histoire... et 9 autres matières t'attendent.",
  },
  {
    emoji: "🎯",
    title: "9 modes de jeu",
    desc: "Classique, Chronométré, 3 Vies, Challenge, Extrême, Survie... et plus encore.",
  },
  {
    emoji: "🏆",
    title: "Progresse !",
    desc: "Gagne de l'XP, débloque des badges, monte de rang (E → SSS) et deviens une légende.",
  },
];

export function Onboarding({ onFinish }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{ background: "var(--bg)" }}>
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6 animate-rankup">{current.emoji}</div>
        <h2 className="text-2xl font-extrabold mb-3" style={{ color: "var(--text)" }}>
          {current.title}
        </h2>
        <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--text-soft)" }}>
          {current.desc}
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{ background: i === step ? "#5b53f0" : "var(--border)" }} />
          ))}
        </div>

        {step < STEPS.length - 1 ? (
          <div className="flex gap-3">
            <button
              onClick={onFinish}
              className="flex-1 py-3.5 border rounded-2xl text-sm font-bold cursor-pointer"
              style={{ background: "transparent", color: "var(--text-soft)", borderColor: "var(--border)" }}
            >
              Passer
            </button>
            <button
              onClick={() => { soundClick(); setStep(s => s + 1); }}
              className="flex-1 py-3.5 border-none rounded-2xl text-sm font-bold cursor-pointer text-white"
              style={{ background: "linear-gradient(135deg, #5b53f0, #4338d6)" }}
            >
              Suivant
            </button>
          </div>
        ) : (
          <button
            onClick={onFinish}
            className="w-full py-4 border-none rounded-2xl text-base font-bold cursor-pointer text-white"
            style={{ background: "linear-gradient(135deg, #5b53f0, #4338d6)", boxShadow: "0 6px 20px rgba(91,83,240,0.38)" }}
          >
            🚀 Commencer !
          </button>
        )}
      </div>
    </div>
  );
}
