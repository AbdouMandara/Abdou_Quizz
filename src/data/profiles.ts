export interface ProfileType {
  id: string;
  emoji: string;
  name: string;
  desc: string;
}

export const PROFILE_TYPES: ProfileType[] = [
  { id: "personne", emoji: "👤", name: "Personne", desc: "Teste tes connaissances" },
  { id: "eleve", emoji: "🎓", name: "Élève", desc: "Progresse dans tes matières" },
  { id: "etudiant", emoji: "🏫", name: "Étudiant", desc: "Maîtrise ton domaine" },
  { id: "travailleur", emoji: "💼", name: "Travailleur", desc: "Développe tes compétences" },
];
