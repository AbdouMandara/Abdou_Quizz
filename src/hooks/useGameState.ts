import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "neoquiz_data_v1";
const MAX_DAILY_LIVES = 5;
const RECHARGE_MS = 4 * 60 * 60 * 1000; // 4 hours

export interface GameState {
  xp: number;
  bestScore: number;
  gamesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  maxStreak: number;
  badgesUnlocked: string[];
  hadPerfect: boolean;
  hadFastAnswer: boolean;
  expertWins: number;
  categoryStats: Record<string, { correct: number; total: number }>;
  history: { date: string; category: string; level: string; score: number; total: number; correct: number }[];
  prefs: { darkMode: boolean; sound: boolean; anim: boolean; favCategory: string | null };
  customQuestions: any[];
  mastery: number;
  categoryMastery: Record<string, number>;
  maxDifficultyReached: number;
  recentGlobalKeys: string[];
  profileType: string | null;
  dailyLives: number;
  lastLifeRecharge: number;
  gamesWon: number;
  survivalWins: number;
  fastestQuizTime: number;
  categoriesPlayed: string[];
  answeredIn2sCount: number;
}

function defaultState(): GameState {
  return {
    xp: 0,
    bestScore: 0,
    gamesPlayed: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    maxStreak: 0,
    badgesUnlocked: [],
    hadPerfect: false,
    hadFastAnswer: false,
    expertWins: 0,
    categoryStats: {},
    history: [],
    prefs: { darkMode: false, sound: true, anim: true, favCategory: null },
    customQuestions: [],
    mastery: 0,
    categoryMastery: {},
    maxDifficultyReached: 1,
    recentGlobalKeys: [],
    profileType: null,
    dailyLives: MAX_DAILY_LIVES,
    lastLifeRecharge: Date.now(),
    gamesWon: 0,
    survivalWins: 0,
    fastestQuizTime: 0,
    categoriesPlayed: [],
    answeredIn2sCount: 0,
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...defaultState(), ...parsed };
      }
    } catch { /* ignore */ }
    return defaultState();
  });

  // Recharge lives on mount
  useEffect(() => {
    setState(prev => {
      if (prev.dailyLives >= MAX_DAILY_LIVES) return prev;
      const elapsed = Date.now() - prev.lastLifeRecharge;
      const livesGained = Math.floor(elapsed / RECHARGE_MS);
      if (livesGained > 0) {
        const newLives = Math.min(MAX_DAILY_LIVES, prev.dailyLives + livesGained);
        return {
          ...prev,
          dailyLives: newLives,
          lastLifeRecharge: Date.now(),
        };
      }
      return prev;
    });
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = useCallback((updater: (prev: GameState) => Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updater(prev) }));
  }, []);

  const loseLife = useCallback(() => {
    setState(prev => ({
      ...prev,
      dailyLives: Math.max(0, prev.dailyLives - 1),
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(defaultState());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { state, updateState, loseLife, resetState, setState };
}

// Onboarding
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("neoquiz_onboarded");
  });

  const finishOnboarding = useCallback(() => {
    localStorage.setItem("neoquiz_onboarded", "true");
    setShowOnboarding(false);
  }, []);

  return { showOnboarding, finishOnboarding };
}

// Toast
export interface ToastState {
  message: string;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const showToast = useCallback((message: string, duration = 2000) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), duration);
  }, []);

  return { toast, showToast };
}
