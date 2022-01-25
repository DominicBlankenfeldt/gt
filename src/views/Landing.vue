<template>
  <div class="landing">
    <div style="margin: 4%">
      <h1>Landing 111 - DAS SPIEL</h1>
    </div>
    <div class="card card-default w-75" style="margin-left: 12.5%">
      <div class="card-header header"><h2>Landing 111</h2></div>
      <div class="card-body">
        <div style="margin: 2%">
          Landing 111 ist ein Browsergame in dem du Kapitän eines eigenen
          Schiffes wirst und dich gegen Horden von Nicht-Irdischen-Konkurenten
          durchzusetzen musst. Spiele allein gegen Alle oder tritt einer
          Space-Flotte bei und erhobert gemeinsam das All.
        </div>
        <div class="row">
          <form
            @submit.prevent="register()"
            autocomplete="off"
            class="col-6"
            style="padding: 24px"
          >
            <div>Noch keinen Account? Registriere dich kostenlos!</div>
            <div class="container">
              <button class="btn" type="submit">
                <a>Kostenlos registrieren!</a>
              </button>
            </div>
          </form>
          <form @submit.prevent="login()" autocomplete="off" class="col-6">
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
                  <a v-if="!loggingIn">Dein Schiff betreten.</a>
                </button>
              </div>
              <div class="loader" v-if="loggingIn">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-header"><u>Alle Infos auf einem Blick:</u></div>
      <div class="footer-body">
        Hilf uns dabei Landing 111 zu verbessern und gib uns ein Feedback! Diese
        Website befindet sich in Entwicklung.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as API from "@/API";

@Options({
  components: {},
  methods: {
    async login() {
      this.error = false;
      this.loggingIn = true;
      try {
        await API.login(this.email, this.password);
        console.log("admin logged in with:" + this.email);
        this.email = "";
        this.password = "";
        this.$router.push("/home");
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
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
* {
  text-shadow: 2px 2px rgb(0, 0, 0);
}
h1 {
  color: rgb(255, 255, 255);
}

// card

.card {
  color: rgb(255, 255, 255);
  background-image: url(/gt/img/uiol/spaceshipinside.png);
  background-size: cover;
}
.header {
  background: rgba(39, 39, 39, 0.555);
}
.card-body {
  background: rgba(39, 39, 39, 0.301);
}
// Buttons
.container .btn {
  position: relative;
  width: 100%;
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
// footer
.footer {
  color: white;
  background-color: rgba(255, 255, 255, 0.103);
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
