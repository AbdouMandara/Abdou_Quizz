export interface Level {
  id: string;
  name: string;
  emoji: string;
  points: number;
  time: number;
  desc: string;
}

export const LEVELS: Level[] = [
  { id: "facile", name: "Facile", emoji: "🟢", points: 10, time: 20, desc: "Pour bien commencer" },
  { id: "moyen", name: "Moyen", emoji: "🟡", points: 15, time: 15, desc: "Un peu de challenge" },
  { id: "difficile", name: "Difficile", emoji: "🔴", points: 20, time: 12, desc: "Pour les confirmés" },
  { id: "expert", name: "Expert", emoji: "🔥", points: 30, time: 10, desc: "Le sommet du défi" },
];
