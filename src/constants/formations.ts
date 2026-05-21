export const formationOptions = ["4 Man", "5 Man", "6 Man", "7 Man"] as const;

export type FormationName = (typeof formationOptions)[number];

export const formationTypeOptions = [
  { id: 1, label: "Check" },
  { id: 2, label: "Jack" },
  { id: 3, label: "King" },
  { id: 4, label: "Queen" },
  { id: 5, label: "Ace" },
] as const;

export type FormationTypeId = (typeof formationTypeOptions)[number]["id"];

export type SavedPlay = {
  id: string;
  title: string;
  description: string;
  formation: FormationName;
  formationType: FormationTypeId;
  targetIndex: number;
  dummyIndex?: number;
  exit: "scrumhalf" | "maul" | "tail";
  tags: string[];
};

export const savedPlays: SavedPlay[] = [
  {
    id: "front-lift-check",
    title: "Front lift check",
    description: "Quick front pod movement to test defensive spacing.",
    formation: "4 Man",
    formationType: 1,
    targetIndex: 1,
    dummyIndex: 2,
    exit: "scrumhalf",
    tags: ["Front", "Quick ball"],
  },
  {
    id: "middle-jack",
    title: "Middle pod jack",
    description: "Front pod sells early lift before the middle pod takes clean ball.",
    formation: "5 Man",
    formationType: 2,
    targetIndex: 2,
    dummyIndex: 0,
    exit: "scrumhalf",
    tags: ["Middle", "Dummy front"],
  },
  {
    id: "tail-king",
    title: "Tail peel king",
    description: "Middle pod checks the defence while the tail jumper receives late.",
    formation: "6 Man",
    formationType: 3,
    targetIndex: 4,
    dummyIndex: 2,
    exit: "tail",
    tags: ["Tail", "Peel"],
  },
  {
    id: "full-line-queen",
    title: "Full line maul queen",
    description: "Full line shifts, target is lifted high, then ball is transferred into maul shape.",
    formation: "7 Man",
    formationType: 4,
    targetIndex: 3,
    dummyIndex: 5,
    exit: "maul",
    tags: ["Full line", "Maul"],
  },
];

type FormationPreset = {
  numberOfPlayers: number;
  startY: number;
};

export const formationPresets: Record<FormationName, FormationPreset> = {
  "4 Man": {
    numberOfPlayers: 4,
    startY: 8,
  },
  "5 Man": {
    numberOfPlayers: 5,
    startY: 12,
  },
  "6 Man": {
    numberOfPlayers: 6,
    startY: 12,
  },
  "7 Man": {
    numberOfPlayers: 7,
    startY: 12,
  },
};

export const playerNumbers = [1, 3, 4, 5, 6, 7, 8];

export function getAnimationOffset(
  index: number,
  totalPlayers: number,
  currentTime: number,
  formationType: FormationTypeId | null
) {
  const progress = Math.min(currentTime / 2.5, 1);

  switch (formationType) {
    case 1:
      return (index % 2 === 0 ? 1 : -1) * progress * 1.5;
    case 2:
      return (index % 2 === 0 ? 1 : -1) * progress * 2;
    case 3:
      return (index < totalPlayers / 2 ? -1 : 1) * progress * 1.8;
    case 4:
      return Math.sin(progress * Math.PI) * (index - totalPlayers / 2) * 0.8;
    case 5:
      return Math.cos(progress * Math.PI) * (index - totalPlayers / 2) * 1.2;
    default:
      return 0;
  }
}
