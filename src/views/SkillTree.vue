<template>
  <div>
    Skill Points:
    {{ player.skillTree.skillPoints - player.skillTree.usedSkillPoints }}/{{
      player.skillTree.skillPoints
    }}
  </div>
  <div class="d-flex flex-column">
    <button
      v-for="skill of player.skillTree.skills"
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
import { player } from "@/global";
import { Skill } from "@/types";
import * as API from "@/API";
export default defineComponent({
  setup() {
    player;
  },
  async mounted() {
    let result = await API.getPlayer();
    if (result) {
      this.player = result.player;
    }
  },
  data() {
    return {
      player: player,
    };
  },
  methods: {
    lvlSkill(skill: Skill) {
      if (!(skill.lvl < skill.maxlvl)) return;
      if (
        !(
          this.player.skillTree.skillPoints -
            this.player.skillTree.usedSkillPoints >
          0
        )
      )
        return;
      skill.lvl++;
      this.player.skillTree.usedSkillPoints++;
      API.addPlayer(this.player);
    },
  },
});
</script>
