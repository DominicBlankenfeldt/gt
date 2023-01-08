<template>
  <div class="site" ..click="startMusic()">
    <navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import navbar from './components/Navbar.vue';
import * as music from './music';
export default defineComponent({
  components: {
    navbar,
  },
  methods: {
    startMusic() {
      music.start();
    },
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
* {
  font-family: 'Press Start 2P', cursive;
  text-align: center;
}
.site {
  background-image: url(/img/space.jpg);
  background-size: 100% 100%;
  height: 100vh;
  min-height: 100vh;
  width: 100vw;
}
</style>
