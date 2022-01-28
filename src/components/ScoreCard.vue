<template>
  <div class="d-flex"></div>
  <div style="font-size: 8vw"><u>ranking</u></div>
  <div class="row g-0">
    <div class="col-12 row g-0">
      <div>
        <img
          src="/gt/img/crowns/gold.png"
          alt=""
          style="width: 5vw"
          class="col-12"
        />
      </div>
      <div>{{ bestPlayers[0]?.player.username }}</div>
      <div>{{ Math.round(bestPlayers[0]?.player.highscore) }}</div>
    </div>
    <div class="col-12 row g-0 justify-content-between">
      <div class="col-4">
        <div>
          <img
            src="/gt/img/crowns/silver.png"
            alt=""
            style="width: 5vw"
            class="col-12"
          />
        </div>
        <div>{{ bestPlayers[1]?.player.username }}</div>
        <div>{{ Math.round(bestPlayers[1]?.player.highscore) }}</div>
      </div>

      <div class="col-4">
        <div>
          <img
            src="/gt/img/crowns/bronze.png"
            alt=""
            style="width: 5vw"
            class="col-12"
          />
        </div>
        <div>{{ bestPlayers[2]?.player.username }}</div>
        <div>{{ Math.round(bestPlayers[2]?.player.highscore) }}</div>
      </div>
      <div class="col-12 row g-0">
        <div>
          {{ bestPlayers[3]?.player.username }} :
          {{ Math.round(bestPlayers[3]?.player.highscore) }}
        </div>
      </div>
      <div class="col-12 row g-0">
        <div>
          {{ bestPlayers[4]?.player.username }} :
          {{ Math.round(bestPlayers[4]?.player.highscore) }}
        </div>
      </div>
      <div class="col-12 row g-0">
        <div>
          {{ bestPlayers[5]?.player.username }} :
          {{ Math.round(bestPlayers[5]?.player.highscore) }}
        </div>
      </div>
      <div class="col-12 row g-0">
        <div>
          {{ bestPlayers[6]?.player.username }} :
          {{ Math.round(bestPlayers[6]?.player.highscore) }}
        </div>
      </div>
      <div class="col-12 row g-0">
        <div>
          {{ bestPlayers[7]?.player.username }} :
          {{ Math.round(bestPlayers[7]?.player.highscore) }}
        </div>
      </div>
      <div class="col-12 row g-0">
        <div>
          {{ bestPlayers[8]?.player.username }} :
          {{ Math.round(bestPlayers[8]?.player.highscore) }}
        </div>
      </div>
      <div class="col-12 row g-0">
        <div>
          {{ bestPlayers[9]?.player.username }} :
          {{ Math.round(bestPlayers[9]?.player.highscore) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as API from "@/API";
import * as type from "@/types";

export default defineComponent({
  data() {
    return {
      bestPlayers: [] as type.BestPlayers[],
    };
  },
  async mounted() {
    let result = await API.getBestPlayers();
    if (result) {
      this.bestPlayers = result.reverse() as type.BestPlayers[];
    }
    console.log(result);
  },
  components: {},
  methods: {},
});
</script>
<style lang="scss" scoped>
* {
  color: white;
  text-shadow: 2px 2px black;
}
</style>
