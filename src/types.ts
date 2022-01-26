export interface Enemy {
  vector: Vector;
  size: number;
  id: string;
  type: EnemyType;
  imgsrc: string;
  moveVector: Vector;
  timer: number | null;
  isGrow: boolean;
}
export type EnemyType = "curve" | "aimbot" | "chasebot" | "getbigger";

export interface Player {
  vector: Vector;
  speed: number;
  size: number;
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
export type Outlook = "up" | "down" | "right" | "left";

export interface Item {
  type: Itemtype;
  imgsrc: string;
  vector: Vector;
  size: number;
  timer: number;
}
export type Itemtype = "coin" | "blackHole" | "growPotion" | "clearField"|"magnet";

export interface SkillTree {
  skillPoints: number;
  usedSkillPoints: number;
  skills: Skill[];
}
export interface ref<Player> {
  value: Player;
}
export interface Skill {
  name: string;
  lvl: number;
  maxlvl: number;
}

export type Vector = [number, number];
