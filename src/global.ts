import { ref } from "vue";
import * as type from "@/types";

export const skillTree = ref({
    skillPoints:0,
    usedSkillPoints:0,
    skills:[]as type.Skill[],
}as type.SkillTree);
