<template>
  <ScoreCardNormal v-if="view == 'normal'" />
  <ScoreCardHardcore v-if="view == 'hardcore'" />
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
