import { ref } from "vue";
import * as type from "@/types";
import { currentUser } from '@/router';
import * as API from '@/API';
//player

export const player=ref({
  id:"",
  x: 0,
  y: 0,
  speed: 5,
  size: 15,
  skillTree: {
    skillPoints: 0,
    usedSkillPoints: 0,
    skills: [
      { name: "fastAbility", lvl: 0, maxlvl: 1 },
      { name: "slowAbility", lvl: 0, maxlvl: 1 },
      { name: "slowEnemy", lvl: 0, maxlvl: 20 },
      { name: "spawnLessEnemy", lvl: 0, maxlvl: 20 },
      { name: "scoreMultiplicator", lvl: 0, maxlvl: 20 },
    ] as type.Skill[],
  } as type.SkillTree,
  outlook:"up", //Blickrichtung
  highscore: 0,
})



export const production = ref(
  process.env.NODE_ENV === "production" ? true : false
);
