<template>
    <div id="nav">
        <router-link v-if="!user" to="/" @keydown.enter.prevent>Login</router-link>
        <router-link v-if="user" to="/home" @keydown.enter.prevent>Player-Card</router-link>
        <a>|</a>
        <router-link v-if="user" to="/skillTree" @keydown.enter.prevent>Skill Tree</router-link>
        <a v-if="user">|</a>
        <router-link v-if="user" to="/fleet" @keydown.enter.prevent>Space Fleet</router-link>
        <a v-if="user">|</a>
        <router-link to="/games" @keydown.enter.prevent>Game</router-link>
        <a>|</a>
        <router-link v-if="user" to="/scoreboard" @keydown.enter.prevent>Scoreboard</router-link>
        <a v-if="user">|</a>
        <router-link to="/guide" @keydown.enter.prevent>Guide</router-link>
        <a v-if="user">|</a>
        <a v-if="user" @click="logout()" @keydown.enter.prevent>LogOut</a>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { currentUser } from '@/router'
import * as API from '@/API'

export default defineComponent({
    setup() {
        return { user: currentUser }
    },
    methods: {
        logout() {
            API.logout()
            this.$router.go(0)
        },
    },
})
</script>

<style scoped lang="scss">
a {
    margin-left: 1vw;
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
