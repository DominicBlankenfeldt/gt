<template>
  <div class="d-flex justify-content-end"></div>
  <div>ranking</div>
  <div v-for="bestPlayer of bestPlayers.reverse()" :key="bestPlayer">
    {{ bestPlayer.email.substring(0, bestPlayer.email.indexOf("@")) }}:
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
      this.bestPlayers =result as type.Player[];
    }
    console.log(result)
  },
  components: {},
  methods: {
    logout() {
      API.logout();
      this.$router.push("/");
      this.$router.go(0);
    },
  },
});
</script>
<style lang="scss" scoped>
* {
  text-shadow: 2px 2px black;
}
</style>
