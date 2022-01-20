export interface Enemy {
  x: number;
  y: number;
  size: number;
  id: string;
  type: string;
  imgsrc: string;
  moveVektor: number[];
  timer: number | null;
}
export interface Player{
  x: number;
  y: number;
  speed: number;
  size: number;
  skillTree: SkillTree;
  outlook: string;
  highscore:number;
  id:string;
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
interface ref<SkillTree>{
  value:SkillTree
}
export interface Skill {
  name: string;
  lvl: number;
  maxlvl: number;
}
