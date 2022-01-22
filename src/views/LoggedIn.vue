<template>
  <div class="d-flex justify-content-end">
    <button
    class="m-2"
        @click="logout()"
        style="height: 60px; width: 60px; text-align:center"
      >Log Out</button>
  </div>
  <div>
      ranking
  </div>
 <div v-for="bPlayer of bestPlayer" :key="bPlayer">
{{bPlayer.email.substring(0,bPlayer.email.indexOf('@'))}}: {{bPlayer.highscore}}
 </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as API from '@/API';
import * as type from "@/types";
export default defineComponent({
  data() {
    return {
    bestPlayer:[] as type.Player[],
    };
  },
async mounted(){
  let result=await API.getBestPlayers()
    if(result){
      this.bestPlayer=Object.values(result) as type.Player[]
    }
},
  methods: {
       logout(){
      API.logout()
      this.$router.push("/home");
    }
  },
});
</script>
<style lang="scss" scoped></style>