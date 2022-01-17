export interface Enemy {
  x: number;
  y: number;
  size: number;
  id: string;
  type: string;
  color: string;
  moveVektor: number[];
  timer: number | null;
}
export interface Item {
  type: string;
  color: string;
  x: number;
  y: number;
  size: number;
  timer: number;
}
export interface SkillTree {
  skillPoints: number;
  usedSkillPoints:number;
  skills: Skill[];
}
export interface Skill {
  name: string;
  lvl: number;
}
