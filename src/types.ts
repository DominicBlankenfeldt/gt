export interface Enemy {
  vector: Vector;
  size: number;
  id: string;
  type: EnemyType;
  imgsrc: string;
  moveVector: Vector;
  timer: number | null;
}
export type EnemyType = "curve" | "aimbot" | "chasebot" | "getbigger";

export interface Player {
  vector: Vector;
  speed: number;
  size: number;
  skillTree: SkillTree;
  outlook: Outlook;
  highscore: number;
  id: string;
  email: string;
  username: string;
  img: string;
}
export type Outlook = "up" | "down" | "right" | "left";

export interface Item {
  type: Itemtype;
  imgsrc: string;
  vector: Vector;
  size: number;
  timer: number;
}
export type Itemtype = "coin" | "skull" | "growPotion" | "clearField";

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
