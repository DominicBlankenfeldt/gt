<template>
  <div class="d-flex justify-content-end"></div>
  <div>ranking</div>
  <div v-for="bestPlayer of bestPlayers" :key="bestPlayer.player">
    {{ bestPlayer.player.username }}:
    {{ Math.round(bestPlayer.player.highscore) }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as API from "@/API";
import * as type from "@/types";

export default defineComponent({
  data() {
    return {
      bestPlayers: [] as type.Player[],
    };
  },
  async mounted() {
    let result = await API.getBestPlayers();
    if (result) {
      this.bestPlayers = result.reverse() as type.Player[];
    }
    console.log(result);
  },
  components: {},
  methods: {},
});
</script>
<style lang="scss" scoped>
* {
  text-shadow: 2px 2px black;
}
</style>
