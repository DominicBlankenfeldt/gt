import { ref } from "vue";
import * as type from "@/types";
//player

export const player = ref({
  id: "",
  vector: [0, 0],
  speed: 5,
  size: 20,
  originalSize:20,
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
//finish me
export function checkPlayer(checkedPlayer: type.Player) {
  checkedPlayer=checkedPlayer||{}
  checkedPlayer.id=checkedPlayer.id||""
  checkedPlayer.originalSize=checkedPlayer.originalSize||20
  checkedPlayer.vector=checkedPlayer.vector||[0, 0]
  checkedPlayer.speed=checkedPlayer.speed||5
  checkedPlayer.skillTree=checkedPlayer.skillTree||{
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
  } as type.SkillTree
  checkedPlayer.outlook=checkedPlayer.outlook||"up"
  checkedPlayer.highscore=checkedPlayer.highscore ||0 
  checkedPlayer.highscoreHardcore=checkedPlayer.highscoreHardcore||0
  checkedPlayer.email=checkedPlayer.email||"gast@"
  checkedPlayer.username=checkedPlayer.username||"gast"
  checkedPlayer.img=checkedPlayer.img||""
  checkedPlayer.registeredAt=checkedPlayer.registeredAt||0
  checkedPlayer.playedGames=checkedPlayer.playedGames||0
  checkedPlayer.playedHardcore=checkedPlayer.playedHardcore||0
  checkedPlayer.hardcoreMode=checkedPlayer.hardcoreMode||false
  for (const skill of ["fastAbility", "slowAbility", "bombAbility"]) {
    if (checkSkill(checkedPlayer, skill)) {
      checkedPlayer.skillTree.skills.push({ name: skill as type.Skillname, lvl: 0, maxlvl: 1 })
    }
  }
  for (const skill of ["slowEnemy", "spawnLessEnemy", "scoreMultiplicator", "betterCoin", "longerMagnet", "betterGrowPotion", "smallerBlackHole"]) {
    if (checkSkill(checkedPlayer, skill)) {
      checkedPlayer.skillTree.skills.push({ name: skill as type.Skillname, lvl: 0, maxlvl: 20 })
    }
  }
  return checkedPlayer
}

function checkSkill(checkedPlayer: type.Player, skill: string) {
  return checkedPlayer.skillTree.skills[checkedPlayer.skillTree.skills.findIndex((s) => s.name == skill)] === undefined
}
export const production = ref(
  process.env.NODE_ENV === "production" ? true : false
);
