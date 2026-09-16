export interface Question {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
  category?: string;
  level?: string;
  id?: string;
}

function q(question: string, answers: string[], correct: number, explanation: string): Question {
  return { question, answers, correct, explanation };
}

export const QUESTION_BANK: Record<string, Record<string, Question[]>> = {
  culture: {
    facile: [
      q("Combien de continents compte-t-on sur Terre ?", ["5", "6", "7", "8"], 2, "On compte généralement 7 continents."),
      q("Quelle est la capitale de la France ?", ["Lyon", "Marseille", "Paris", "Nice"], 2, "Paris est la capitale de la France depuis des siècles."),
      q("Quel est l'organe qui pompe le sang dans le corps ?", ["Le foie", "Le cœur", "Le rein", "Le poumon"], 1, "Le cœur pompe le sang dans tout le corps."),
    ],
    moyen: [
      q("Qui a peint la Joconde ?", ["Michel-Ange", "Léonard de Vinci", "Raphaël", "Donatello"], 1, "La Joconde est une œuvre de Léonard de Vinci."),
      q("Quel pays a inventé le papier ?", ["l'Égypte", "la Chine", "la Grèce", "l'Inde"], 1, "Le papier a été inventé en Chine, vers le IIe siècle av. J.-C."),
      q("Combien de temps dure une année lumière (approx.) ?", ["Une distance, pas une durée", "365 jours", "1 mois", "1 siècle"], 0, "L'année-lumière mesure une distance, celle parcourue par la lumière en un an."),
    ],
    difficile: [
      q("Quel est le plus petit pays du monde ?", ["Monaco", "Saint-Marin", "Le Vatican", "Le Liechtenstein"], 2, "Le Vatican est le plus petit État souverain du monde."),
      q("Qui a écrit « Le Petit Prince » ?", ["Victor Hugo", "Antoine de Saint-Exupéry", "Albert Camus", "Jules Verne"], 1, "Antoine de Saint-Exupéry est l'auteur du Petit Prince."),
    ],
    expert: [
      q("Quelle civilisation a construit Machu Picchu ?", ["Les Aztèques", "Les Mayas", "Les Incas", "Les Olmèques"], 2, "Machu Picchu a été construit par les Incas au XVe siècle."),
    ],
  },
  maths: {
    facile: [
      q("Combien font 5 × 6 ?", ["20", "25", "30", "35"], 2, "5 × 6 = 30."),
      q("Combien font 12 + 8 ?", ["18", "20", "22", "24"], 1, "12 + 8 = 20."),
      q("Quel est le résultat de 9 − 4 ?", ["3", "4", "5", "6"], 2, "9 − 4 = 5."),
    ],
    moyen: [
      q("Quelle est la racine carrée de 81 ?", ["7", "8", "9", "10"], 2, "9 × 9 = 81, donc √81 = 9."),
      q("Combien font 15% de 200 ?", ["20", "25", "30", "35"], 2, "15% de 200 = 0,15 × 200 = 30."),
      q("Quel est le périmètre d'un carré de côté 5 cm ?", ["10 cm", "15 cm", "20 cm", "25 cm"], 2, "Périmètre = 4 × côté = 4 × 5 = 20 cm."),
    ],
    difficile: [
      q("Quelle est la dérivée de x² ?", ["x", "2x", "x²", "2"], 1, "La dérivée de x² est 2x."),
      q("Combien vaut π (arrondi à 2 décimales) ?", ["3,12", "3,14", "3,16", "3,18"], 1, "π ≈ 3,14."),
    ],
    expert: [
      q("Quelle est la solution de x² − 5x + 6 = 0 ?", ["x=1 ou x=6", "x=2 ou x=3", "x=-2 ou x=-3", "x=0 ou x=5"], 1, "Les racines sont 2 et 3 car (x-2)(x-3)=x²-5x+6."),
    ],
  },
  physique: {
    facile: [
      q("Quelle est l'unité de mesure de la force ?", ["Le watt", "Le newton", "Le joule", "Le pascal"], 1, "La force se mesure en newtons (N)."),
      q("Quelle est la vitesse de la lumière (approx.) ?", ["300 km/s", "3 000 km/s", "300 000 km/s", "3 000 000 km/s"], 2, "La lumière voyage à environ 300 000 km/s dans le vide."),
    ],
    moyen: [
      q("Quelle loi relie tension, courant et résistance ?", ["Loi de Newton", "Loi d'Ohm", "Loi de Coulomb", "Loi de Pascal"], 1, "La loi d'Ohm énonce que U = R × I."),
      q("Quelle est l'unité de l'énergie dans le SI ?", ["Le watt", "Le joule", "Le newton", "L'ampère"], 1, "L'énergie se mesure en joules (J)."),
    ],
    difficile: [
      q("Quelle est la formule de l'énergie cinétique ?", ["E=mc²", "E=½mv²", "E=mgh", "E=Fd"], 1, "L'énergie cinétique est E = ½ m v²."),
    ],
    expert: [
      q("Quel scientifique a formulé la relativité générale ?", ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Max Planck"], 2, "Albert Einstein a publié la relativité générale en 1915."),
    ],
  },
  chimie: {
    facile: [
      q("Quel est le symbole chimique de l'eau ?", ["O2", "H2O", "CO2", "NaCl"], 1, "L'eau a pour formule chimique H2O."),
      q("Quel gaz respirons-nous principalement ?", ["Hydrogène", "Azote", "Oxygène", "Hélium"], 2, "Nous respirons de l'oxygène (O2) pour vivre."),
    ],
    moyen: [
      q("Quel est le symbole chimique du sodium ?", ["So", "Sd", "Na", "S"], 2, "Le symbole du sodium est Na (du latin natrium)."),
      q("Quel est le pH d'une solution neutre ?", ["0", "7", "10", "14"], 1, "Une solution neutre a un pH de 7."),
    ],
    difficile: [
      q("Combien d'électrons possède un atome d'hydrogène neutre ?", ["0", "1", "2", "3"], 1, "L'hydrogène neutre possède 1 proton et 1 électron."),
    ],
    expert: [
      q("Quel est le nom de la réaction entre un acide et une base ?", ["Oxydation", "Combustion", "Neutralisation", "Électrolyse"], 2, "La réaction entre un acide et une base est une neutralisation."),
    ],
  },
  info: {
    facile: [
      q("Que signifie « HTML » ?", ["High Text Machine Language", "HyperText Markup Language", "Home Tool Markup Language", "HyperTransfer Markup Language"], 1, "HTML signifie HyperText Markup Language."),
      q("Quel composant est la « mémoire vive » d'un ordinateur ?", ["Le disque dur", "La RAM", "Le processeur", "L'écran"], 1, "La RAM stocke temporairement les données en cours d'utilisation."),
    ],
    moyen: [
      q("Quel langage sert à styliser une page web ?", ["JavaScript", "CSS", "Python", "SQL"], 1, "CSS sert à styliser les pages web."),
      q("Que signifie « CPU » ?", ["Central Process Unit", "Central Processing Unit", "Compute Processing Unit", "Central Program Unit"], 1, "CPU signifie Central Processing Unit."),
    ],
    difficile: [
      q("Quelle structure fonctionne selon le principe LIFO ?", ["File (Queue)", "Pile (Stack)", "Arbre", "Graphe"], 1, "Une pile fonctionne selon LIFO : dernier entré, premier sorti."),
    ],
    expert: [
      q("Quelle est la complexité moyenne du quicksort ?", ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], 1, "Le quicksort a une complexité moyenne en O(n log n)."),
    ],
  },
  francais: {
    facile: [
      q("Quel est le pluriel de « cheval » ?", ["Chevals", "Chevaux", "Chevales", "Chevaus"], 1, "Le pluriel de « cheval » est « chevaux »."),
      q("Quel est le féminin de « acteur » ?", ["Acteure", "Actrice", "Actoresse", "Acteuse"], 1, "Le féminin de « acteur » est « actrice »."),
    ],
    moyen: [
      q("Quel temps est utilisé dans « Il mangea » ?", ["Présent", "Passé simple", "Imparfait", "Futur"], 1, "« Mangea » est au passé simple."),
      q("Qu'est-ce qu'un nom commun ?", ["Un nom propre", "Un mot qui désigne une personne/chose", "Un adjectif", "Un verbe"], 1, "Un nom commun désigne une personne, un animal ou une chose."),
    ],
    difficile: [
      q("Quel est le subjonctif de « avoir » ?", ["Que j'aie", "Que j'ais", "Que j'aurai", "Que j'avais"], 0, "Le subjonctif présent de « avoir » est « que j'aie »."),
    ],
    expert: [
      q("Dans « Les Fleurs du Mal », qui est l'auteur ?", ["Victor Hugo", "Charles Baudelaire", "Paul Verlaine", "Arthur Rimbaud"], 1, "Charles Baudelaire est l'auteur des Fleurs du Mal."),
    ],
  },
  agriculture: {
    facile: [
      q("Quel est le principal aliment de base en Afrique de l'Ouest ?", ["Le blé", "Le riz", "Le maïs", "Le manioc"], 1, "Le riz est l'aliment de base dans de nombreux pays d'Afrique de l'Ouest."),
      q("Quel animal produit du lait ?", ["Le cochon", "La vache", "Le poulet", "Le mouton"], 1, "La vache est l'animal le plus associé à la production laitière."),
    ],
    moyen: [
      q("Qu'est-ce qu'une culture vivrière ?", ["Une culture ornementale", "Une culture destinée à l'alimentation", "Une culture industrielle", "Une culture exportée"], 1, "Une culture vivrière est destinée à l'alimentation de ceux qui la produisent."),
      q("Quel est le principal intrant pour cultiver ?", ["Le pétrole", "L'eau", "Le sable", "Le plastique"], 1, "L'eau est l'intrant le plus essentiel en agriculture."),
    ],
    difficile: [
      q("Qu'est-ce que la rotation des cultures ?", ["Planter toujours la même chose", "Alterner les cultures sur une même parcelle", "Irriguer en cercle", "Broyer les résidus"], 1, "La rotation des cultures consiste à alterner les plantes sur une même parcelle."),
    ],
    expert: [
      q("Qu'est-ce que l'agroforesterie ?", ["Agriculture en serre", "Arboriculture fruitière", "Association arbres et cultures/pâturages", "Agriculture biologique"], 2, "L'agroforesterie associe arbres et cultures ou pâturages sur une même parcelle."),
    ],
  },
  economie: {
    facile: [
      q("Qu'est-ce que l'inflation ?", ["La baisse des prix", "La hausse généralisée des prix", "Le chômage", "La croissance"], 1, "L'inflation correspond à la hausse généralisée et durable des prix."),
      q("Qui émet la monnaie en zone euro ?", ["Les banques commerciales", "La BCE", "Le FMI", "L'ONU"], 1, "La Banque Centrale Européenne (BCE) gère la politique monétaire de la zone euro."),
    ],
    moyen: [
      q("Qu'est-ce qu'un PIB ?", ["Produit Intérieur Brut", "Programme d'Investissement Bancaire", "Police Internationale des Banques", "Prix des Imports Bruts"], 0, "Le PIB mesure la richesse produite par un pays en un an."),
      q("Qu'est-ce qu'un dérivé financier ?", ["Un emprunt d'État", "Un titre dont la valeur dépend d'un actif sous-jacent", "Une action ordinaire", "Un compte épargne"], 1, "Un dérivé tire sa valeur d'un actif sous-jacent (action, taux, matières premières)."),
    ],
    difficile: [
      q("Qu'est-ce qu'un marché haussier ?", ["Un marché en baisse", "Un marché en hausse", "Un marché stable", "Un marché fermé"], 1, "Un marché haussier (bull market) est caractérisé par une tendance à la hausse des prix."),
    ],
    expert: [
      q("Qu'est-ce que l'effet levier en finance ?", ["Un outil de mesure", "L'utilisation de la dette pour amplifier les rendements", "Un type d'investissement", "Un impôt sur les plus-values"], 1, "L'effet levier consiste à emprunter pour augmenter le potentiel de rendement."),
    ],
  },
  comptabilite: {
    facile: [
      q("Qu'est-ce qu'un bilan ?", ["Un compte de résultat", "Un état des actifs et passifs", "Une facture", "Un chèque"], 1, "Le bilan présente les actifs et les passifs d'une entreprise à un instant donné."),
      q("Un crédit est une ?", ["Recette", "Dépense", "Impôt", "Salaire"], 1, "En comptabilité, un crédit correspond à l'augmentation d'une dette ou d'une charge."),
    ],
    moyen: [
      q("Qu'est-ce qu'une immobilisation ?", ["Un bien consommable", "Un bien durable inscrit à l'actif", "Un prêt bancaire", "Un stock de marchandises"], 1, "Une immobilisation est un bien durable utilisé dans l'exploitation."),
      q("Quel est le compte de charges ?", ["Classe 1", "Classe 6", "Classe 7", "Classe 4"], 1, "Les charges sont en classe 6 (achats, services, charges de personnel...)."),
    ],
    difficile: [
      q("Qu'est-ce que la méthode des coûts complets ?", ["Absorber tous les coûts directs", "Répartir coûts fixes et variables sur les produits", "Ne compter que les coûts variables", "Additionner tous les coûts d'achat"], 1, "La méthode des coûts complets répartit les coûts fixes et variables sur chaque produit."),
    ],
    expert: [
      q("Qu'est-ce que le goodwill ?", ["Un actif corporel", "L'écart entre la valeur de marché et la valeur comptable d'une entreprise", "Un type de prêt", "Un impôt"], 1, "Le goodwill (fonds commercial) représente l'écart entre la valeur d'acquisition et la valeur nette des actifs."),
    ],
  },
  geographie: {
    facile: [
      q("Quel est le plus grand océan ?", ["Atlantique", "Indien", "Pacifique", "Arctique"], 2, "L'océan Pacifique est le plus grand océan du monde."),
      q("Sur combien de continents se trouve la France ?", ["1", "2", "3", "4"], 2, "La France métropolitaine et d'outre-mer s'étend sur 3 continents."),
    ],
    moyen: [
      q("Quel est le fleuve le plus long du monde ?", ["Le Nil", "L'Amazone", "Le Mississippi", "Le Yang-Tsé"], 0, "Le Nil est généralement considéré comme le plus long fleuve (6 650 km)."),
      q("Quelle est la capitale du Japon ?", ["Pékin", "Séoul", "Tokyo", "Bangkok"], 2, "Tokyo est la capitale du Japon."),
    ],
    difficile: [
      q("Qu'est-ce qu'un archipel ?", ["Une montagne isolée", "Un ensemble d'îles", "Un désert", "Une vallée"], 1, "Un archipel est un groupe d'îles."),
    ],
    expert: [
      q("Quel courant oceanique réchauffe l'Europe du Nord ?", ["Le Gulf Stream", "Le courant du Labrador", "Le courant de Humboldt", "Le courant des Kerguelen"], 0, "Le Gulf Stream (courant du Golfe) réchauffe l'Europe du Nord."),
    ],
  },
  histoire: {
    facile: [
      q("En quelle année a eu lieu la Révolution française ?", ["1776", "1789", "1799", "1815"], 1, "La Révolution française a débuté en 1789."),
      q("Qui était Napoléon Bonaparte ?", ["Un peintre", "Un empereur français", "Un scientifique", "Un explorateur"], 1, "Napoléon Bonaparte était un empereur français (1804-1815)."),
    ],
    moyen: [
      q("Quelle guerre a opposé les USA et l'URSS indirectement ?", ["La Première Guerre mondiale", "La Guerre froide", "La Guerre de Sécession", "La Guerre du Vietnam"], 1, "La Guerre froide (1947-1991) opposait les USA et l'URSS sans conflit direct."),
      q("En quelle année Christophe Colomb a-t-il découvert l'Amérique ?", ["1492", "1498", "1502", "1510"], 0, "Christophe Colomb a atteint l'Amérique en 1492."),
    ],
    difficile: [
      q("Quel traité a mis fin à la Première Guerre mondiale ?", ["Le traité de Versailles", "Le traité de Westphalie", "Le traité de Paris", "Le traité de Vienne"], 0, "Le traité de Versailles (1919) a mis fin à la Première Guerre mondiale."),
    ],
    expert: [
      q("Quelle bataille a marqué la chute de Napoléon ?", ["Austerlitz", "Waterloo", "Trafalgar", "Borodino"], 1, "La bataille de Waterloo (1815) a marqué la chute définitive de Napoléon."),
    ],
  },
  biologie: {
    facile: [
      q("Quel est l'organisme le plus petit du corps humain ?", ["L'os", "La cellule", "Le neurone", "L'atome"], 1, "La cellule est l'unité de base du vivant."),
      q("Quel organe filtre le sang ?", ["Le cœur", "Le foie", "Le rein", "Le poumon"], 2, "Les reins filtrent le sang pour éliminer les déchets."),
    ],
    moyen: [
      q("Qu'est-ce que l'ADN ?", ["Une protéine", "Un acide nucléique porteur du code génétique", "Un sucre", "Un lipide"], 1, "L'ADN (acide désoxyribonucléique) porte l'information génétique."),
      q("Combien de chromosomes a un humain ?", ["23", "44", "46", "48"], 2, "Un humain a 46 chromosomes (23 paires)."),
    ],
    difficile: [
      q("Qu'est-ce que la mitose ?", ["Une division cellulaire", "Un type de reproduction", "Une mutation", "Une protéine"], 0, "La mitose est une division cellulaire produant deux cellules identiques."),
    ],
    expert: [
      q("Quel est le rôle des ribosomes ?", ["Produire l'énergie", "Synthétiser les protéines", "Transporter l'oxygène", "Stocker l'ADN"], 1, "Les ribosomes sont les usines à protéines de la cellule."),
    ],
  },
};
