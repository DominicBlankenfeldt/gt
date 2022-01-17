<template>
  <div>
    Skill Points: {{ skillTree.skillPoints - skillTree.usedSkillPoints }}/{{
      skillTree.skillPoints
    }}
  </div>

</template>
<script lang="ts">
import { defineComponent } from "vue";
import { skillTree } from "@/global";
export default defineComponent({
  setup() {
    skillTree;
  },
  data() {
    return {
      skillTree: skillTree,
    };
  },
  
});
</script>
