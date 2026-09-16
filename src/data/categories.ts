export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "culture", name: "Culture générale", emoji: "🌍" },
  { id: "maths", name: "Mathématiques", emoji: "📐" },
  { id: "physique", name: "Physique", emoji: "⚡" },
  { id: "chimie", name: "Chimie", emoji: "🧪" },
  { id: "info", name: "Informatique", emoji: "💻" },
  { id: "francais", name: "Français", emoji: "📚" },
  { id: "agriculture", name: "Agriculture", emoji: "🌱" },
  { id: "economie", name: "Économie", emoji: "💰" },
  { id: "comptabilite", name: "Comptabilité", emoji: "📊" },
  { id: "geographie", name: "Géographie", emoji: "🌎" },
  { id: "histoire", name: "Histoire", emoji: "🏛️" },
  { id: "biologie", name: "Biologie", emoji: "🧬" },
  { id: "mixte", name: "Mode mixte", emoji: "🎲" },
];
