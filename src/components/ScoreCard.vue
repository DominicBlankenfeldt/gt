<template>
  <div class="d-flex"></div>
  <div style="font-size: 9vw"><u>ranking</u></div>
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
      <div>player 1</div>
      <div>highscore</div>
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
        <div>player 2</div>
        <div>highscore</div>
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
        <div>player 3</div>
        <div>highscore</div>
      </div>
      <div class="col-12 row g-0">
        <div>player 4:highscore</div>
      </div>
      <div class="col-12 row g-0">
        <div>player 5:highscore</div>
      </div>
      <div class="col-12 row g-0">
        <div>player 6:highscore</div>
      </div>
      <div class="col-12 row g-0">
        <div>player 7:highscore</div>
      </div>
      <div class="col-12 row g-0">
        <div>player 8:highscore</div>
      </div>
      <div class="col-12 row g-0">
        <div>player 9:highscore</div>
      </div>
      <div class="col-12 row g-0">
        <div>player 10:highscore</div>
      </div>
      <hr />
      <div v-for="bestPlayer of bestPlayers" :key="bestPlayer.player">
        {{ bestPlayer.player.username }}:
        {{ Math.round(bestPlayer.player.highscore) }}
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
      bestPlayers: [] as type.bestPlayer[],
    };
  },
  async mounted() {
    let result = await API.getBestPlayers();
    if (result) {
      this.bestPlayers = result.reverse() as unknown as type.bestPlayer[];
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
