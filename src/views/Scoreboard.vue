<template>
  <div
    id="carouselExampleControls"
    class="carousel slide"
    data-bs-ride="carousel"
    data-bs-interval="false"
  >
    <div class="carousel-inner">
      <div class="carousel-item active">
        <ScoreCardNormal />
      </div>
      <div class="carousel-item">
        <ScoreCardHardcore />
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleControls"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleControls"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ScoreCardNormal from "@/components/ScoreCardNormal.vue";
import ScoreCardHardcore from "@/components/ScoreCardHardcore.vue";
export default defineComponent({
  data() {
    return {
      view: "hardcore",
    };
  },
  methods: {},
  components: {
    ScoreCardNormal,
    ScoreCardHardcore,
  },
});
</script>
