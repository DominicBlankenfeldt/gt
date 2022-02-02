<template>
  <div id="nav">
    <router-link v-if="!user" to="/">Login</router-link>
    <router-link v-if="user" to="/home">Player-Card</router-link>
    <a> | </a>
    <router-link v-if="user" to="/skillTree">Skill Tree</router-link>
    <a v-if="user"> | </a
    ><router-link v-if="user" to="/fleet">Space Flotte</router-link>
    <a v-if="user"> | </a> <router-link to="/games">Game</router-link> |
    <router-link v-if="user" to="/scoreboard">Scoreboard</router-link>
    <a v-if="user"> | </a>
    <router-link to="/guide">Guide</router-link>
    <a v-if="user"> | </a>
    <a v-if="user" @click="logout()">LogOut</a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentUser } from "@/router";
import * as API from "@/API";

export default defineComponent({
  setup() {
    return { user: currentUser };
  },
  methods: {
    logout() {
      API.logout();
      this.$router.push("/");
      this.$router.go(0);
    },
  },
});
</script>

<style lang="scss">
#nav {
  padding: 3vh;
  height: 8vh;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  a {
    font-weight: bold;
    color: rgb(255, 255, 255);

    &.router-link-exact-active {
      color: rgb(101, 211, 255);
    }
  }
}
</style>
