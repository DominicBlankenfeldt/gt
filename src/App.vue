<template>
  <div class="site">
    <navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import navbar from "@/components/Navbar.vue";
export default defineComponent({
  components: {
    navbar,
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
* {
  font-family: "Press Start 2P", cursive;
  font-weight: 1000;
}
.site {
  background-image: url(/gt/img/space.jpg);
  height: 100vh;
  width: 100vw;
}
</style>
