import { type Question, QUESTION_BANK } from "../data/questions";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// escapeHtml reserved for user-generated content

export interface NormalizedQuestion extends Question {
  category: string;
  level: string;
  id: string;
  points?: number;
}

export function normalizeBank(): NormalizedQuestion[] {
  const all: NormalizedQuestion[] = [];
  for (const [cat, levels] of Object.entries(QUESTION_BANK)) {
    for (const [lvl, questions] of Object.entries(levels)) {
      questions.forEach((q, i) => {
        all.push({
          ...q,
          category: cat,
          level: lvl,
          id: `${cat}-${lvl}-${i}`,
          question: q.question,
          explanation: q.explanation,
        });
      });
    }
  }
  return all;
}

let _normalizedCache: NormalizedQuestion[] | null = null;
export function getNormalizedBank(): NormalizedQuestion[] {
  if (!_normalizedCache) _normalizedCache = normalizeBank();
  return _normalizedCache;
}

export function generateQuiz(category: string, level: string, count: number, recentKeys: string[] = []): NormalizedQuestion[] {
  const bank = getNormalizedBank();
  let pool: NormalizedQuestion[];

  if (category === "mixte") {
    pool = bank;
  } else {
    pool = bank.filter(q => q.category === category);
  }

  if (level) {
    const levelPool = pool.filter(q => q.level === level);
    if (levelPool.length >= count) pool = levelPool;
  }

  const fresh = pool.filter(q => !recentKeys.includes(q.question));
  if (fresh.length >= count) pool = fresh;

  return shuffleArray(pool).slice(0, Math.min(count, pool.length)).map(q => ({
    ...q,
    answers: shuffleArray(q.answers),
    correct: q.answers.indexOf(q.answers[q.correct]),
  }));
}

export function generateDynamicQuiz(_mode: string, targetCount: number, recentKeys: string[] = []): NormalizedQuestion[] {
  const bank = getNormalizedBank();
  const pool = bank.filter(q => !recentKeys.includes(q.question));
  return shuffleArray(pool.length > targetCount ? pool : bank).slice(0, targetCount);
}

export function calculateScore(questions: NormalizedQuestion[], answers: (number | null)[], difficultyLevel: number): {
  correct: number;
  total: number;
  score: number;
  xp: number;
  streak: number;
  maxStreak: number;
} {
  let correct = 0;
  let score = 0;
  let streak = 0;
  let maxStreak = 0;

  questions.forEach((q, i) => {
    if (answers[i] === q.correct) {
      correct++;
      streak++;
      const basePoints = q.points ?? 10;
      const diffMult = 1 + (difficultyLevel - 1) * 0.15;
      score += Math.round(basePoints * diffMult);
      if (streak === 3) score += 10;
      if (streak === 5) score += 20;
      if (streak === 10) score += 50;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
  });

  const xp = correct * 10;
  return { correct, total: questions.length, score, xp, streak: 0, maxStreak };
}

export function calculateNote(correct: number, total: number): { note: number; appreciation: string } {
  const note = Math.round((correct / total) * 20 * 10) / 10;
  let appreciation = "À améliorer";
  if (note >= 18) appreciation = "Excellent 🌟";
  else if (note >= 16) appreciation = "Très bien 👏";
  else if (note >= 14) appreciation = "Bien 👍";
  else if (note >= 12) appreciation = "Assez bien 🙂";
  else if (note >= 10) appreciation = "Passable 😐";
  return { note, appreciation };
}
