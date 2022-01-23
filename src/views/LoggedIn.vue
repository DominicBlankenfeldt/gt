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
 <div v-for="bestPlayer of bestPlayers" :key="bestPlayer">
{{bestPlayer.email.substring(0,bestPlayer.email.indexOf('@'))}}: {{Math.round(bestPlayer.highscore)}}
 </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as API from '@/API';
import * as type from "@/types";
export default defineComponent({
  data() {
    return {
    bestPlayers:[] as type.Player[],
    };
  },
async mounted(){
  let result=await API.getBestPlayers()
    if(result){
      this.bestPlayers=Object.values(result) as type.Player[]
    }
},
  methods: {
       logout(){
      API.logout()
      this.$router.push("/home");
      this.$router.go(0)
    }
  },
});
</script>
<style lang="scss" scoped></style>