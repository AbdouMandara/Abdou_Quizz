export interface DifficultyLevel {
  n: number;
  name: string;
  emoji: string;
  poolKey: string;
  time: number;
  mult: number;
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { n: 1, name: "Initiation", emoji: "🟢", poolKey: "facile", time: 60, mult: 1.00 },
  { n: 2, name: "Facile", emoji: "🟢", poolKey: "facile", time: 55, mult: 1.05 },
  { n: 3, name: "Intermédiaire", emoji: "🟡", poolKey: "moyen", time: 50, mult: 1.15 },
  { n: 4, name: "Confirmé", emoji: "🟡", poolKey: "moyen", time: 45, mult: 1.25 },
  { n: 5, name: "Difficile", emoji: "🟠", poolKey: "difficile", time: 40, mult: 1.40 },
  { n: 6, name: "Très difficile", emoji: "🟠", poolKey: "difficile", time: 35, mult: 1.55 },
  { n: 7, name: "Avancé", emoji: "🔴", poolKey: "difficile", time: 30, mult: 1.70 },
  { n: 8, name: "Expert", emoji: "🔴", poolKey: "expert", time: 28, mult: 1.90 },
  { n: 9, name: "Maître", emoji: "🔥", poolKey: "expert", time: 24, mult: 2.20 },
  { n: 10, name: "EXTRÊME", emoji: "☠️", poolKey: "expert", time: 20, mult: 2.60 },
];

export function difficultyInfo(n: number): DifficultyLevel {
  const clamped = Math.max(1, Math.min(10, Math.round(n)));
  return DIFFICULTY_LEVELS[clamped - 1];
}

export function pointsForDifficulty(n: number): number {
  return Math.round(8 + n * 3);
}

export function approxDifficultyForLevelKey(levelKey: string): number {
  switch (levelKey) {
    case "facile": return 2;
    case "moyen": return 4;
    case "difficile": return 6;
    case "expert": return 9;
    default: return 3;
  }
}
