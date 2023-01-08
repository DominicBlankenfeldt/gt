<template>
  <div class="home">
    <Overview />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Overview from "../views/Overview.vue"; // .. is an alias to /src

Options({
  components: {
    Overview,
  },
});
export default class Home extends Vue {}
</script>
