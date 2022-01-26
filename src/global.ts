import { ref } from "vue";
import * as type from "@/types";
//player

export const player = ref({
  id: "",
  vector: [0, 0],
  speed: 5,
  size: 15,
  skillTree: {
    skillPoints: 0,
    usedSkillPoints: 0,
    skills: [
      { name: "fastAbility", lvl: 0, maxlvl: 1 },
      { name: "slowAbility", lvl: 0, maxlvl: 1 },
      { name: "bombAbility", lvl: 0, maxlvl: 1 },
      { name: "slowEnemy", lvl: 0, maxlvl: 20 },
      { name: "spawnLessEnemy", lvl: 0, maxlvl: 20 },
      { name: "scoreMultiplicator", lvl: 0, maxlvl: 20 },
      { name: "betterCoin", lvl: 0, maxlvl: 20 },
      { name: "longerMagnet", lvl: 0, maxlvl: 20 },
      { name: "betterGrowPotion", lvl: 0, maxlvl: 20 },
      { name: "smallerBlackHole", lvl: 0, maxlvl: 20 },

    ] as type.Skill[],
  } as type.SkillTree,
  outlook: "up", //Blickrichtung
  highscore: 0,
  highscoreHardcore: 0,
  email: "gast@",
  username: "gast",
  img: "",
  registeredAt: 0,
  playedGames: 0,
  playedHardcore: 0,
  hardcoreMode: false,
});

export const production = ref(
  process.env.NODE_ENV === "production" ? true : false
);
