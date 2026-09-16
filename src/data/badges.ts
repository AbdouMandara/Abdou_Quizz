export interface Badge {
  id: string;
  name: string;
  emoji: string;
  check: (stats: BadgeStats) => boolean;
}

export interface BadgeStats {
  gamesPlayed: number;
  maxStreak: number;
  hadPerfect: boolean;
  questionsAnswered: number;
  hadFastAnswer: boolean;
  expertWins: number;
  totalCorrect: number;
  categoriesPlayed: number;
  gamesWon: number;
  survivalWins: number;
  fastestTime: number;
  sharpestStreak: number;
  ranksReached: string;
  answeredIn2s: number;
}

export const BADGES: Badge[] = [
  { id: "first_quiz", name: "Premier quiz", emoji: "🏆", check: (s) => s.gamesPlayed >= 1 },
  { id: "streak5", name: "Série de 5", emoji: "🔥", check: (s) => s.maxStreak >= 5 },
  { id: "perfect", name: "Score parfait", emoji: "💯", check: (s) => s.hadPerfect },
  { id: "hundred_q", name: "100 questions", emoji: "📚", check: (s) => s.questionsAnswered >= 100 },
  { id: "fast", name: "Réponse rapide", emoji: "⚡", check: (s) => s.hadFastAnswer },
  { id: "expert_win", name: "Expert", emoji: "🧠", check: (s) => s.expertWins >= 1 },
  // New extended badges
  { id: "survivor", name: "Survivant", emoji: "🏅", check: (s) => s.survivalWins >= 1 },
  { id: "speedrun", name: "Speedrun", emoji: "⏱️", check: (s) => s.fastestTime > 0 && s.fastestTime < 30 },
  { id: "sharpshooter", name: "Sharpshooter", emoji: "🎯", check: (s) => s.sharpestStreak >= 10 },
  { id: "genius", name: "Génie", emoji: "🧬", check: (s) => s.hadPerfect && s.ranksReached.includes("expert") },
  { id: "explorer", name: "Explorateur", emoji: "🌍", check: (s) => s.categoriesPlayed >= 5 },
  { id: "fire_sacred", name: "Feu sacré", emoji: "🔥", check: (s) => s.maxStreak >= 15 },
  { id: "diamond", name: "Diamant", emoji: "💎", check: (s) => s.ranksReached.includes("S") },
  { id: "champion", name: "Champion", emoji: "🏆", check: (s) => s.gamesWon >= 50 },
  { id: "polyglot", name: "Polyglotte", emoji: "🌐", check: (s) => s.categoriesPlayed >= 8 },
  { id: "flash", name: "Flash", emoji: "⚡", check: (s) => s.answeredIn2s >= 5 },
];
