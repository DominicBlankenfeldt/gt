<template>
  <div class="fleet"><FleetSearch /><FleetCard /></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import FleetCard from "@/components/FleetCard.vue";
import FleetSearch from "@/components/FleetSearch.vue";
export default defineComponent({
  setup() {
    return;
  },
  components: {
    FleetCard,
    FleetSearch,
  },
});
</script>
