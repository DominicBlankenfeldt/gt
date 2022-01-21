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
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as API from '@/API';
import * as type from "@/types";
export default defineComponent({
  data() {
    return {
      leaderBoard:[]as type.LeaderBoard[],
    };
  },
  async mounted(){
this.leaderBoard=await API.getLeaderBoard()
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