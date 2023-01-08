<template>
  <div class="container d-flex align-items-stretch justify-content-center flex-column" style="height: calc(100vh - 200px)">
    <div class="card card-default w-75" style="margin-left: 12.5%">
      <div class="card-header header">
        <div v-if="username == 'gast'" class="alert alert-danger">invalid username</div>
        <h1>Join a starship crew.</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="register()" autocomplete="off">
          <div class="m-4 alert alert-danger text-center" v-if="error">
            {{ error }}
          </div>
          <div><TextInput placeholder="username" v-model="username" required></TextInput></div>
          <div><EmailInput placeholder="email" v-model="email" required></EmailInput></div>
          <div><PasswordInput placeholder="password" v-model="password" minlength="6" required></PasswordInput></div>
          <div><PasswordInput placeholder="confirm" v-model="confirmed" minlength="6" required></PasswordInput></div>
          <div class="container" v-if="!registering">
            <button class="btn" type="submit" :disabled="username.length < 3 || username == 'gast'">
              <a v-if="!registering">register</a>
            </button>
          </div>
          <div class="loader" v-if="registering">
            <div class="inner one"></div>
            <div class="inner two"></div>
            <div class="inner three"></div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import * as API from '../API';
import * as type from '../types';
import { TextInput, EmailInput, PasswordInput } from 'custom-mbd-components';
import * as music from '../music';
import router from '../router';

const confirmed = ref('');
const password = ref('');
const email = ref('');
const username = ref('');
const error = ref('');
const registering = ref(false);
const player = ref({} as type.Player);

music.ButtonSound(50);

async function register() {
  error.value = '';
  if (confirmed.value !== password.value) {
    error.value = 'The passwords do not match';
    return;
  }
  registering.value = true;
  try {
    player.value.username = username.value;
    player.value.registeredAt = new Date().toJSON();
    await API.register(email.value, password.value, player.value);
    router.push('/home');
  } catch (e) {
    music.ButtonSound(50);
    error.value = 'Unfortunately, the account could not be registered';
  } finally {
    registering.value = false;
  }
}
</script>
<style lang="scss" scoped>
* {
  color: white;
  text-shadow: 1px 1px black;
}
.card {
  background-image: url(/img/uiol/spaceshipinside.png);
  background-size: cover;
}
.header {
  background: rgba(39, 39, 39, 0.5);
}
.card-body {
  background: rgba(39, 39, 39, 0.5);
}

// button

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
  color: gray;
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
  content: '';
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
  content: '';
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
  content: '';
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
  box-shadow: 0 0 5px #2bd2ff, 0 0 15px #2bd2ff, 0 0 30px #2bd2ff, 0 0 60px #2bd2ff;
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
