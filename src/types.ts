export interface Enemy {
  x: number;
  y: number;
  size: number;
  id: string;
  type: "curve"|"aimbot"|"chasebot"|"getbigger";
  imgsrc: string;
  moveVektor: number[];
  timer: number | null;
}
export interface Player {
  x: number;
  y: number;
  speed: number;
  size: number;
  skillTree: SkillTree;
  outlook: string;
  highscore: number;
  id: string;
  email: string;
}
export interface Item {
  type: string;
  imgsrc: string;
  x: number;
  y: number;
  size: number;
  timer: number;
}
export interface SkillTree {
  skillPoints: number;
  usedSkillPoints: number;
  skills: Skill[];
}
export interface ref<Player> {
  value: Player
}
export interface Skill {
  name: string;
  lvl: number;
  maxlvl: number;
}

