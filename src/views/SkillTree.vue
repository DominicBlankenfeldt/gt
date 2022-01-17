<template>
  <div>
    Skill Points: {{ skillTree.skillPoints - skillTree.usedSkillPoints }}/{{
      skillTree.skillPoints
    }}
  </div>
  <div class="d-flex flex-column">
    <button
      v-for="skill of skillTree.skills"
      :key="skill"
      class="mt-1 w-25 btn btn-primary align-self-center shadow-none"
      @click="lvlSkill(skill)"
    >
      name: {{ skill.name }}
      <br />
      lvl: {{ skill.lvl }}/{{ skill.maxlvl }}
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { skillTree } from "@/global";
import { Skill } from "@/types";
export default defineComponent({
  setup() {
    skillTree;
  },
  data() {
    return {
      skillTree: skillTree,
    };
  },
  methods: {
    lvlSkill(skill: Skill) {
      if (!(skill.lvl < skill.maxlvl)) return;
      if (!(this.skillTree.skillPoints - this.skillTree.usedSkillPoints > 0))
        return;
      skill.lvl++;
      this.skillTree.usedSkillPoints++;
    },
  },
});
</script>
