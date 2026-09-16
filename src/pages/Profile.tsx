import { PROFILE_TYPES } from "../data/profiles";
import { BADGES } from "../data/badges";
import { RANKS, getRankForLevel, xpProgress } from "../data/ranks";
import { XPBar } from "../components/XPBar";
import { soundClick } from "../utils/sounds";
import type { GameState } from "../hooks/useGameState";

interface ProfileProps {
  state: GameState;
  onNavigate: (page: string) => void;
}

export function Profile({ state, onNavigate }: ProfileProps) {
  const profile = PROFILE_TYPES.find(p => p.id === state.profileType) ?? PROFILE_TYPES[0];
  const { level } = xpProgress(state.xp);
  const currentRank = getRankForLevel(level);

  const topCategories = Object.entries(state.categoryStats)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 3);

  return (
    <div className="animate-fadeIn px-4 pt-4 pb-24">
      <div className="text-[15px] font-extrabold mb-4" style={{ color: "var(--text)" }}>👤 Profil</div>

      {/* Profile type card */}
      <button
        onClick={() => onNavigate("profile-select")}
        className="flex items-center gap-3 w-full p-3.5 rounded-2xl border cursor-pointer mb-3.5"
        style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
      >
        <span className="text-2xl">{profile.emoji}</span>
        <div className="flex-1 text-left">
          <div className="font-extrabold text-sm" style={{ color: "var(--text)" }}>{profile.name}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>{profile.desc}</div>
        </div>
        <span className="text-[12px] font-bold" style={{ color: "#5b53f0" }}>Changer ›</span>
      </button>

      {/* XP & Rank */}
      <div className="mb-5">
        <XPBar xp={state.xp} />
      </div>

      {/* Rank progression */}
      <div className="text-[13px] font-extrabold mb-3" style={{ color: "var(--text)" }}>
        🏵️ Progression des rangs
      </div>
      <div className="flex flex-col gap-2 mb-5">
        {RANKS.map(rank => {
          const reached = level >= rank.minLevel;
          const isCurrent = currentRank.letter === rank.letter;
          return (
            <div key={rank.letter} className={`flex items-center gap-3 p-2.5 rounded-xl border ${isCurrent ? "" : "opacity-60"}`}
              style={{
                background: "var(--card)",
                borderColor: isCurrent ? rank.color : "var(--border)",
                boxShadow: isCurrent ? `0 0 0 2px ${rank.color} inset` : "var(--shadow)",
              }}>
              <span className="inline-flex items-center justify-center min-w-[38px] h-9 px-2 rounded-lg text-white font-black text-sm"
                style={{ background: rank.color }}>
                {rank.letter}
              </span>
              <div className="flex-1">
                <div className="font-bold text-[13px]" style={{ color: "var(--text)" }}>{rank.name}</div>
                <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Niveau {rank.minLevel}+</div>
              </div>
              {reached ? (
                <span className="text-base">✅</span>
              ) : (
                <span className="text-base opacity-30">🔒</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{state.bestScore}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Meilleur score</div>
        </div>
        <div className="flex-1 text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{state.gamesPlayed}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Parties</div>
        </div>
        <div className="flex-1 text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>
            {topCategories.length > 0 ? topCategories[0][0] : "-"}
          </div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Préférée</div>
        </div>
      </div>

      {/* Badges */}
      <div className="text-[13px] font-extrabold mb-3" style={{ color: "var(--text)" }}>🏅 Badges</div>
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {BADGES.map(badge => {
          const unlocked = state.badgesUnlocked.includes(badge.id);
          return (
            <div key={badge.id} className={`text-center rounded-2xl p-3 border ${unlocked ? "" : "opacity-30"}`}
              style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
              <div className="text-2xl">{badge.emoji}</div>
              <div className="text-[10px] font-bold mt-1" style={{ color: "var(--text)" }}>{badge.name}</div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => { soundClick(); onNavigate("settings"); }}
        className="w-full py-3 border rounded-2xl text-sm font-bold cursor-pointer"
        style={{ background: "var(--card)", color: "var(--text)", borderColor: "var(--border)" }}
      >
        ⚙️ Paramètres
      </button>
    </div>
  );
}
