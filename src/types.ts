export interface Enemy {
  x: number;
  y: number;
  size: string;
  id: string;
  type: string;
  color: string;
  moveVektor: number[];
  timer: number | null;
}
export interface Sizes {
  eSmall: 15;
  eMedium: 20;
  eBig: 25;
}
export interface Item {
  type: string;
  x: number;
  y: number;
  size: string;
  timer: number;
}
export interface SkillTree {
  skillPoints: number;
  skills: Skill[];
}
interface Skill {
  name: string;
  lvl: number;
}
