import { xpProgress, getRankForLevel } from "../data/ranks";

interface XPBarProps {
  xp: number;
  compact?: boolean;
}

export function XPBar({ xp, compact = false }: XPBarProps) {
  const { level, current, needed } = xpProgress(xp);
  const rank = getRankForLevel(level);
  const pct = Math.round((current / needed) * 100);

  return (
    <div className="rounded-2xl p-4 border"
      style={{ background: "var(--card)", boxShadow: "var(--glow)", borderColor: "var(--border)" }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center min-w-[44px] h-11 px-2.5 rounded-xl text-white font-black text-lg tracking-wider"
          style={{ background: rank.color, boxShadow: "0 4px 14px rgba(0,0,0,.25)" }}>
          {rank.letter}
        </span>
        <span className="text-xs font-bold" style={{ color: "var(--text-soft)" }}>{rank.name}</span>
      </div>
      {!compact && (
        <>
          <div className="flex justify-between text-[13px] mb-2 font-semibold" style={{ color: "var(--text)" }}>
            <span>Niveau {level}</span>
            <span>{current} / {needed} XP</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #5b53f0, #e8cd97)" }} />
          </div>
        </>
      )}
    </div>
  );
}

export function RankBadgeInline({ xp }: { xp: number }) {
  const { level } = xpProgress(xp);
  const rank = getRankForLevel(level);
  return (
    <span className="inline-flex items-center justify-center min-w-[38px] h-9 px-2 rounded-lg text-white font-black text-sm"
      style={{ background: rank.color, boxShadow: "0 3px 10px rgba(0,0,0,.2)" }}>
      {rank.letter}
    </span>
  );
}
