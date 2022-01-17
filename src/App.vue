<template>
  <div id="nav">
    <div class="ball"></div>
    <router-link to="/home">Home</router-link> |
    <router-link to="/skillTree">Skill Tree</router-link> |
    <router-link to="/games">Game</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 3vh;
  height: 10vh;
  background-color: rgb(197, 122, 197);
  color: black;
  animation-name: banner;
  animation-duration: 30s;
  animation-iteration-count: infinite;

  @keyframes banner {
    0% {
      background-color: white;
    }
    30% {
      background-color: rgb(255, 154, 154);
    }
    60% {
      background-color: rgb(154, 154, 255);
    }
    90% {
      background-color: rgb(255, 255, 154);
    }
    100% {
      background-color: white;
    }
  }
  a {
    font-weight: bold;
    color: black;

    &.router-link-exact-active {
      color: rgb(121, 120, 120);
    }
  }
}

// .ball{
//   background-color: white;
//   width: 1rem;
//   height: 1rem;
//   -moz-border-radius: 50px;
//   -webkit-border-radius: 50px;
//   border-radius: 50px;
//   position: relative;
// }

.ball {
  --size: 1rem;
  --bounceHeight: 3rem;
  --duration: 0.6s;
  width: var(--size);
  height: var(--size);
  margin: auto;
  position: relative;
  top: -2vh;
  left: -48%;
  right: 0;
  perspective: 1000px;
}

.ball::before {
  content: "";
  display: block;
  width: inherit;
  height: inherit;
  background: radial-gradient(ellipse at 30% 20%, LightSalmon, transparent 40%),
    radial-gradient(circle at -20% -30%, tomato 60%, darkred);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) inset;
  animation: bounce var(--duration) infinite alternate
    cubic-bezier(1, 0, 0.8, 0.9);
}

/* shadow */
.ball::after {
  content: "";
  position: relative;
  z-index: -1;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  width: inherit;
  height: 20%;
  color: #ccc;
  background-color: currentColor;
  border-radius: 50%;
  transform: translateY(var(--bounceHeight)) scale(0.8);
  animation: bounceShadow var(--duration) infinite alternate
    cubic-bezier(1, 0, 0.8, 0.9);
}

@keyframes bounce {
  85% {
    transform: translateY(calc(var(--bounceHeight) - 3px));
  }
  86% {
    transform: translateY(calc(var(--bounceHeight) - 3px)) scale(1.1, 0.9);
  }
  100% {
    transform: translateY(var(--bounceHeight)) scale(1.4, 0.5);
  }
}

@keyframes bounceShadow {
  0% {
    box-shadow: 0 0 10px 8px currentColor;
    color: #eee;
  }
  90% {
    box-shadow: 0 0 3px 3px currentColor;
  }
  91% {
    box-shadow: 0 0 2px 2px currentColor;
  }
  100% {
    box-shadow: 0 0 0px currentColor;
  }
}
</style>
