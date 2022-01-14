<template>
  <div class="block"></div>
  <div class="d-flex row" id="row">
    <div class="sideBlock col-2"></div>
    <div class="col-8" id="game">
      <game />
    </div>
    <div class="sideBlock col-2"></div>
  </div>
  <div class="block"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import game from "@/components/JumpRun.vue";

export default defineComponent({
  components: {
    game,
  },
});
</script>

<style scoped lang="scss">
.block {
  width: 100%;
  height: 5vh;
  z-index: 1;
  background-color: rgb(255, 255, 255);
  position: relative;
  padding: 0 !important;
}
.sideBlock {
  height: 624px;
  background-color: rgb(255, 255, 255);
  z-index: 1;
  position: relative;
  padding: 0 !important;
}
#game {
  padding: 0 !important;
}
#row {
  margin: 0 !important;
}
</style>
