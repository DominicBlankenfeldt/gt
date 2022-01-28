<template>
  <div>
    Skill Points:
    {{ player.skillTree.skillPoints - usedSkillPoints }}/{{
      player.skillTree.skillPoints
    }}
  </div>
  <div class="d-flex flex-column">
    <button
      v-for="skill of player.skillTree.skills
       "
      :key="skill.name"
      class="mt-1 w-25 btn btn-primary align-self-center shadow-none"
      @click="lvlSkill(skill)"
    >
      name: {{ skill.name }}
      <br />
      lvl: {{ skill.lvl }}/{{ skill.maxlvl }}
    </button>
    <button
      class="mt-1 w-25 btn btn-primary align-self-center shadow-none"
      @click="resetSkillTree()"
    >
      reset Skilltree
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { checkPlayer, player } from "@/global";
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
    this.player = checkPlayer(this.player) as type.Player;
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
    async lvlSkill(skill: Skill) {
      if (!(skill.lvl < skill.maxlvl)) return;
      if (!(this.player.skillTree.skillPoints - this.usedSkillPoints > 0))
        return;
      skill.lvl++;
      await API.addPlayer(this.player);
    },
    async resetSkillTree() {
      this.player.skillTree.skillPoints -= this.usedSkillPoints;
      for (let skill of this.player.skillTree.skills) {
        this.player.skillTree.skillPoints += skill.lvl;
        skill.lvl = 0;
      }
      await API.addPlayer(this.player);
    },
  },
});
</script>
