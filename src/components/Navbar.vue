<template>
  <div id="nav">
    <router-link to="/home">Home</router-link> |
    <router-link to="/skillTree">Skill Tree</router-link> |
    <router-link to="/games">Game</router-link> |
    <router-link to="/scoreboard">Scoreboard</router-link> |
    <router-link to="/about">About</router-link>|
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}
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
