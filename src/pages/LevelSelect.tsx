import { useState } from "react";
import { LEVELS } from "../data/levels";
import { MODES } from "../data/modes";
import { soundClick, soundQuizStart } from "../utils/sounds";

interface LevelSelectProps {
  category: string;
  onStart: (category: string, level: string, mode: string, questionCount: number) => void;
  onBack: () => void;
}

export function LevelSelect({ category, onStart, onBack }: LevelSelectProps) {
  const [selectedLevel, setSelectedLevel] = useState("facile");
  const [selectedMode, setSelectedMode] = useState("classique");
  const [questionCount, setQuestionCount] = useState(10);
  const [examCount, setExamCount] = useState(10);
  const [examTime, setExamTime] = useState(20);

  const handleStart = () => {
    soundQuizStart();
    if (selectedMode === "examen") {
      onStart(category, selectedLevel, selectedMode, examCount);
    } else {
      onStart(category, selectedLevel, selectedMode, questionCount);
    }
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="text-[15px] font-extrabold mb-3" style={{ color: "var(--text)" }}>
        Sélection du niveau
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {LEVELS.map(level => (
          <button
            key={level.id}
            onClick={() => { soundClick(); setSelectedLevel(level.id); }}
            className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
              selectedLevel === level.id ? "border-[#5b53f0]" : ""
            }`}
            style={{
              background: "var(--card)",
              borderColor: selectedLevel === level.id ? "#5b53f0" : "var(--border)",
              boxShadow: selectedLevel === level.id ? "var(--glow)" : "var(--shadow)",
            }}
          >
            <span className="text-2xl">{level.emoji}</span>
            <div className="text-left">
              <div className="font-extrabold text-base" style={{ color: "var(--text)" }}>{level.name}</div>
              <div className="text-[12px]" style={{ color: "var(--text-soft)" }}>{level.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-[15px] font-extrabold mb-3" style={{ color: "var(--text)" }}>
        Mode de jeu
      </div>

      <div className="flex flex-col gap-2.5 mb-5">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => { soundClick(); setSelectedMode(mode.id); }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
              selectedMode === mode.id ? "border-[#5b53f0]" : ""
            }`}
            style={{
              background: "var(--card)",
              borderColor: selectedMode === mode.id ? "#5b53f0" : "var(--border)",
              boxShadow: selectedMode === mode.id ? "var(--glow)" : "var(--shadow)",
            }}
          >
            <span className="text-xl">{mode.emoji}</span>
            <div className="text-left">
              <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{mode.name}</div>
              <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>{mode.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {selectedMode === "examen" && (
        <div className="mb-4 p-4 rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-[13px] font-bold mb-2" style={{ color: "var(--text-soft)" }}>Options de l'examen</div>
          <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-soft)" }}>Nombre de questions</label>
          <input type="number" value={examCount} onChange={e => setExamCount(Number(e.target.value))}
            min={3} max={30} className="w-full p-2.5 rounded-xl border text-sm mb-2"
            style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} />
          <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-soft)" }}>Temps par question (secondes)</label>
          <input type="number" value={examTime} onChange={e => setExamTime(Number(e.target.value))}
            min={5} max={60} className="w-full p-2.5 rounded-xl border text-sm"
            style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} />
        </div>
      )}

      <div className="mb-4">
        <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-soft)" }}>Nombre de questions</label>
        <select value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))}
          className="w-full p-2.5 rounded-xl border text-sm appearance-none"
          style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
          <option value={5}>5 questions</option>
          <option value={10}>10 questions</option>
          <option value={15}>15 questions</option>
          <option value={20}>20 questions</option>
        </select>
      </div>

      <button
        onClick={handleStart}
        className="block w-full py-4 border-none rounded-2xl text-base font-bold cursor-pointer text-white"
        style={{ background: "linear-gradient(135deg, #5b53f0, #4338d6)", boxShadow: "0 6px 20px rgba(91,83,240,0.38)" }}
      >
        🚀 Lancer le quiz
      </button>
      <button
        onClick={() => { soundClick(); onBack(); }}
        className="block w-full py-3 mt-3 border rounded-2xl text-sm font-bold cursor-pointer"
        style={{ background: "var(--card)", color: "var(--text)", borderColor: "var(--border)" }}
      >
        ⬅️ Retour
      </button>
    </div>
  );
}
