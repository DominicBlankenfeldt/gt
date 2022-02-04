export interface Enemy {
  vector: Vector;
  size: number;
  id: string;
  type: EnemyType;
  imgsrc: string;
  moveVector: Vector;
  spawnMoveVector: Vector;
  timer: number;
  circle: boolean | null;
  circleRadius: number;
  circleDir: Dir;
  isGrow: boolean;
  isMagnet: boolean;
}
export type Dir = "left" | "right"
export type EnemyType = "curve" | "aimbot" | "chasebot" | "getbigger" | "circle" | "random" | "spiral";

export interface Player {
  vector: Vector;
  speed: number;
  size: number;
  originalSize: number;
  skillTree: SkillTree;
  outlook: Outlook;
  highscore: number;
  highscoreHardcore: number;
  id: string;
  email: string;
  username: string;
  img: string;
  registeredAt: number;
  playedGames: number;
  hardcoreMode: boolean;
  playedHardcore: number;
}
export type Outlook = "up" | "down" | "right" | "left" | "upleft" | "upright" | "downleft" | "downright";

export interface Item {
  type: Itemtype;
  imgsrc: string;
  vector: Vector;
  size: number;
  timer: number;
}
export type Itemtype =
  | "coin"
  | "blackHole"
  | "growPotion"
  | "clearField"
  | "magnet";

export interface SkillTree {
  skillPoints: number;
  skills: Skill[];
}
export interface ref<Player> {
  value: Player;
}
export interface Skill {
  name: Skillname;
  lvl: number;
  maxlvl: number;
}
export type Skillname =
  | "fastAbility"
  | "slowAbility"
  | "bombAbility"
  | "slowEnemy"
  | "spawnLessEnemy"
  | "scoreMultiplicator"
  | "betterCoin"
  | "longerMagnet"
  | "betterGrowPotion"
  | "smallerBlackHole";

export type Vector = [number, number];

export interface BestPlayers {
  player: Player;
  email: string;
  role: string;
  id: string;
}
