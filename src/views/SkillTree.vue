<template>
  <div>
    Skill Points:
    {{ player.skillTree.skillPoints - usedSkillPoints }}/{{
      player.skillTree.skillPoints
    }}
  </div>
  <div class="d-flex flex-column">
    <button
      v-for="skill of player.skillTree.skills"
      :key="skill.name"
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
import * as type from "@/types";
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
      player: player.value as type.Player,
    };
  },
  computed: {
    usedSkillPoints() {
      let allSkilllvl = 0;
      for (let skill of this.player.skillTree.skills) {
        allSkilllvl += skill.lvl;
      }
      return allSkilllvl;
    },
  },
  methods: {
    lvlSkill(skill: Skill) {
      if (!(skill.lvl < skill.maxlvl)) return;
      if (
        !(
          this.player.skillTree.skillPoints -
            this.usedSkillPoints >
          0
        )
      )
        return;
      skill.lvl++;
      API.addPlayer(this.player);
    },
  },
});
</script>
