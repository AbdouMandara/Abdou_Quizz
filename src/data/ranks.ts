export interface Rank {
  letter: string;
  name: string;
  minLevel: number;
  color: string;
}

export const RANKS: Rank[] = [
  { letter: "E", name: "Rang E — Débutant", minLevel: 1, color: "#9ca3af" },
  { letter: "D", name: "Rang D — Apprenti", minLevel: 6, color: "#8b5e3c" },
  { letter: "B", name: "Rang B — Confirmé", minLevel: 14, color: "#2563eb" },
  { letter: "A", name: "Rang A — Avancé", minLevel: 26, color: "#7c3aed" },
  { letter: "S", name: "Rang S — Expert", minLevel: 42, color: "#f59e0b" },
  { letter: "SS", name: "Rang SS — Maître", minLevel: 65, color: "#ef4444" },
  { letter: "SSS", name: "Rang SSS — Légende", minLevel: 95, color: "#ec4899" },
];

export function getRankForLevel(level: number): Rank {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.minLevel) rank = r;
  }
  return rank;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return level;
}

export function xpForLevel(level: number): number {
  return Math.round(60 + Math.pow(level, 1.55) * 7);
}

export function xpProgress(xp: number): { level: number; current: number; needed: number } {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, current: remaining, needed: xpForLevel(level) };
}
