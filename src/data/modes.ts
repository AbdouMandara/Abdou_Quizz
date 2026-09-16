export interface Mode {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

export const MODES: Mode[] = [
  { id: "classique", name: "Mode classique", emoji: "🎯", desc: "Réponds à ton rythme, sans pression" },
  { id: "chrono", name: "Mode chronométré", emoji: "⏱️", desc: "Chaque question est minutée" },
  { id: "vies", name: "Mode 3 vies", emoji: "❤️", desc: "3 erreurs et la partie s'arrête" },
  { id: "serie", name: "Mode série", emoji: "🔥", desc: "Enchaîne les bonnes réponses" },
  { id: "entrainement", name: "Mode entraînement", emoji: "📚", desc: "Pas de chrono, focus apprentissage" },
  { id: "examen", name: "Mode examen", emoji: "📝", desc: "Configure ta propre session" },
  { id: "challenge", name: "Mode Challenge", emoji: "🔥", desc: "La difficulté grimpe à chaque bonne série — objectif niveau 10" },
  { id: "extreme", name: "Mode Extrême", emoji: "☠️", desc: "Démarre au niveau 8/10, questions redoutables" },
  { id: "survie", name: "Mode Survie", emoji: "☠️", desc: "3 vies, la difficulté augmente à chaque série" },
];
