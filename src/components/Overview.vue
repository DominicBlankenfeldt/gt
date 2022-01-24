<template>
  <div>this is going to be an overview</div>
  <div class="card card-default w-75" style="margin-left: 12.5%">
    <div class="card-header header row g-0">
      <div><h3>Profil-Karte</h3></div>
    </div>
    <div class="card-body row gx-0">
      <div class="profile-pic col-4">
        <img
          src="../../public/img/avatars/avatar_placeholder.png"
          alt=""
          style="height: 30vh; width: 15vw"
        />
        <div>
          registriert seit: <br />
          01/01/2000
        </div>
      </div>
      <div class="col-4">
        <div>Username: Name</div>
        <div>persönlicher highscore</div>
        <div>gespielte spiele/normal</div>
      </div>
      <div class="col-4">
        <div>space flotte</div>
        <div>
          highscore space-flotte (alle mitglieder highscore/anzahl spieler)
        </div>
      </div>
      <div>Skilltreecontent (TODO)</div>
      <div>gespielte spiele/hardcore</div>
      <div>highscore hardcore</div>
    </div>
    <div class="card-footer">
      <div class="features">
        <div>hardcoremode enable</div>
        <div>edit profil</div>
        <div>add friend</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as API from "@/API";
import { currentUser } from "@/router";
import { player } from "@/global";
import * as type from "@/types";
export default defineComponent({
  setup() {
    return { user: currentUser };
  },
});
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
* {
  font-family: "Press Start 2P", cursive;
  font-weight: 1000;
  color: white;
  text-shadow: 2px 2px black;
}
.card {
  background-image: url(/gt/img/uiol/spaceshipinside.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.header {
  background: rgba(39, 39, 39, 0.555);
}
// Buttons
.container .btn {
  position: relative;
  width: 250px;
  height: 55px;
  margin: 20px;
}

.container .btn a {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  color: #fff;
  z-index: 1;
  font-size: 400;
  font-weight: 300;
  letter-spacing: 1px;
  text-decoration: none;
  overflow: hidden;
  transition: 0.2s;
  backdrop-filter: blur(15px);
}

.container .btn:hover a {
  letter-spacing: 3px;
}

.container .btn a::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.15), transparent);
  transform: skewX(45deg) translateX(0);
  transition: 0.2s;
}

.container .btn:hover a::before {
  transform: skewX(45deg) translateX(200%);
}
.container .btn::before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -5px;
  width: 30px;
  height: 10px;
  background: #f00;
  border-radius: 10px;
  transition: 0.2s;
  transition-delay: 0s;
}
.container .btn:hover::before {
  bottom: 0;
  height: 50%;
  width: 80%;
  border-radius: 30px;
  transition-delay: 0.1s;
}

.container .btn::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -5px;
  width: 30px;
  height: 10px;
  background: #f00;
  border-radius: 10px;
  transition: 0.2s;
  transition-delay: 0s;
}
.container .btn:hover::after {
  top: 0;
  height: 50%;
  width: 80%;
  border-radius: 30px;
  transition-delay: 0.2 s;
}

.container .btn:nth-child(1)::before,
.container .btn:nth-child(1)::after {
  background: #2bd2ff;
  box-shadow: 0 0 5px #2bd2ff, 0 0 15px #2bd2ff, 0 0 30px #2bd2ff,
    0 0 60px #2bd2ff;
}
// spinner
.loader {
  position: absolute;
  top: calc(50% - 32px);
  left: calc(50% - 32px);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  perspective: 800px;
}

.inner {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.inner.one {
  left: 0%;
  top: 0%;
  animation: rotate-one 1s linear infinite;
  border-bottom: 3px solid #8989fd;
}

.inner.two {
  right: 0%;
  top: 0%;
  animation: rotate-two 1s linear infinite;
  border-right: 3px solid #8383ad;
}

.inner.three {
  right: 0%;
  bottom: 0%;
  animation: rotate-three 1s linear infinite;
  border-top: 3px solid #3cc1ca;
}

@keyframes rotate-one {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate-two {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes rotate-three {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}
</style>
