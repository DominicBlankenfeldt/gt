<template>
  <div
    class="container d-flex align-items-stretch justify-content-center flex-column"
    style="height: calc(100vh - 200px)"
    v-if="!user"
  >
    <div class="card card-default w-75" style="margin-left: 12.5%">
      <div class="card-header header">Crew Autorisierung</div>
      <div class="card-body">
        <form @submit.prevent="login()" autocomplete="off">
          <div class="m-4 alert alert-danger text-center" v-if="error">
            Username or password is not correct
          </div>
          <div class="p-4 row">
            <label class="col-4" for="email">Email:</label>
            <div class="col-8">
              <input
                minlength="3"
                class="form-control"
                id="email"
                type="text"
                placeholder="email"
                v-model="email"
                autocomplete="off"
                style="text-shadow: none"
              />
            </div>
          </div>
          <div class="p-4 row">
            <label class="col-4" for="Password">Passwort:</label>
            <div class="col-8">
              <input
                minlength="3"
                class="form-control"
                id="password"
                type="password"
                placeholder="passwort"
                v-model="password"
                autocomplete="off"
                style="text-shadow: none"
              />
            </div>
          </div>
          <div class="justify-content-around">
            <div class="container" v-if="!loggingIn">
              <button class="btn" type="submit" v-if="!loggingIn">
                <a v-if="!loggingIn">Autorisieren</a>
              </button>
            </div>
            <div class="loader" v-if="loggingIn">
              <div class="inner one"></div>
              <div class="inner two"></div>
              <div class="inner three"></div>
            </div>
            <div class="container">
              <button class="btn" type="button" @click="register()">
                <a>Einer Crew beitreten</a>
              </button>
            </div>
          </div>
        </form>
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
  data() {
    return {
      password: "",
      email: "",
      error: false,
      loggingIn: false,
      player: player.value as type.Player,
    };
  },
  mounted() {
    if (this.user) {
      this.$router.push("/loggedin");
    }
  },
  methods: {
    async login() {
      this.error = false;
      this.loggingIn = true;
      try {
        await API.login(this.email, this.password);
        console.log("admin logged in with:" + this.email);
        this.email = "";
        this.password = "";
        this.$router.push("/loggedin");
        let result = await API.getPlayer();
        if (result) {
          this.player = result.player;
        }
      } catch (e) {
        this.error = true;
        console.error({ "couldn't login": e });
      } finally {
        this.password = "";
        this.loggingIn = false;
      }
    },
    register() {
      this.$router.push("/register");
    },
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
