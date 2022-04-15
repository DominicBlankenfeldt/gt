<template>
    <div v-if="dataLoad" class="w-75 mt-5" style="margin-left: 12.5vw">
        <PlayerCard :playerProp="player" :editAble="true" />
    </div>
    <div class="d-flex justify-content-center">
        <div v-if="newVersion" @click="reload()" class="footer text-center" style="background-color: gray">
            there is a new version click here to upgrade
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as API from '@/API'
import { checkPlayer } from '@/global'
import * as type from '@/types'
import { currentUser } from '@/router'
import * as music from '@/music'
import { newVersion, reload } from '@/registerServiceWorker'
import PlayerCard from '@/components/PlayerCard.vue'
export default defineComponent({
    components: {
        PlayerCard,
    },
    setup() {
        currentUser
        return {
            newVersion,
        }
    },
    data() {
        return {
            dataLoad: false,
            user: currentUser,
            player: {} as type.Player,
            hardCoreMode: false,
            editProfile: false,
            img: '',
            images: ['001', '002', '003', '004', '005'],
        }
    },
    computed: {
        registered() {
            let help = JSON.parse(this.player.registeredAt)
            return help
        },
    },
    async mounted() {
        if (this.user) {
            try {
                let result = await API.getPlayer()
                if (result) {
                    this.player = result.player
                }
            } catch {
                API.logout()
            }
        }
        this.player = checkPlayer(this.player) as type.Player
        this.buttonSound()
        this.dataLoad = true
    },

    methods: {
        reload() {
            this.$router.go(0)
            reload()
        },
        changeImg(id: string) {
            this.player.img = id
        },
        async toggleEdit(save: boolean) {
            this.editProfile = !this.editProfile
            this.buttonSound()
            if (save) {
                try {
                    await API.addPlayer(this.player)
                } catch {
                    API.logout()
                }
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
* {
    font-family: 'Press Start 2P', cursive;
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
.card-body {
    background: rgba(39, 39, 39, 0.555);
}
.card-footer {
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
