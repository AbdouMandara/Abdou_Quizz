import { soundClick } from "../utils/sounds";
import { XPBar } from "../components/XPBar";
import { BADGES } from "../data/badges";
import type { GameState } from "../hooks/useGameState";

interface HomeProps {
  state: GameState;
  onNavigate: (page: string) => void;
}

export function Home({ state, onNavigate }: HomeProps) {
  const badgeCount = BADGES.filter(b => state.badgesUnlocked.includes(b.id)).length;

  return (
    <div className="animate-fadeIn px-4 pt-6 pb-24">
      <div className="text-center mb-4">
        <div className="text-5xl mb-2 drop-shadow-lg">🧠</div>
        <div className="text-2xl font-extrabold tracking-wide"
          style={{ background: "linear-gradient(135deg, var(--text), #5b53f0 140%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          NEO QUIZ
        </div>
        <div className="text-[13px] mt-1" style={{ color: "var(--text-soft)" }}>« Apprends. Joue. Progresse. »</div>
      </div>

      <div className="mb-4">
        <XPBar xp={state.xp} />
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{state.bestScore}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Meilleur score</div>
        </div>
        <div className="flex-1 text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{state.gamesPlayed}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Parties jouées</div>
        </div>
        <div className="flex-1 text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{badgeCount}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Badges</div>
        </div>
      </div>

      {/* Daily Lives */}
      {state.dailyLives < 5 && (
        <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 rounded-xl text-sm font-bold"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <span>Vies quotidiennes :</span>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-base ${i < state.dailyLives ? "" : "opacity-30"}`}>❤️</span>
          ))}
          {state.dailyLives < 5 && (
            <span className="text-[11px] font-normal" style={{ color: "var(--text-soft)" }}>Recharge dans ~{Math.ceil((4 - ((Date.now() - state.lastLifeRecharge) % (4 * 60 * 60 * 1000)) / (60 * 60 * 1000)))}h</span>
          )}
        </div>
      )}

      <button
        onClick={() => { soundClick(); onNavigate("categories"); }}
        className="block w-full py-4 border-none rounded-2xl text-base font-bold cursor-pointer tracking-wide text-white"
        style={{ background: "linear-gradient(135deg, #5b53f0, #4338d6)", boxShadow: "0 6px 20px rgba(91,83,240,0.38)" }}
      >
        ▶️ Commencer
      </button>

      <div className="flex gap-3 mt-3">
        <button
          onClick={() => { soundClick(); onNavigate("stats"); }}
          className="flex-1 py-3 border rounded-2xl text-sm font-bold cursor-pointer"
          style={{ background: "var(--card)", color: "var(--text)", borderColor: "var(--border)" }}
        >
          📊 Statistiques
        </button>
        <button
          onClick={() => { soundClick(); onNavigate("profile"); }}
          className="flex-1 py-3 border rounded-2xl text-sm font-bold cursor-pointer"
          style={{ background: "var(--card)", color: "var(--text)", borderColor: "var(--border)" }}
        >
          👤 Profil
        </button>
      </div>
    </div>
  );
}
