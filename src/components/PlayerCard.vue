<template>
    <div class="card card-default" v-if="dataLoad">
        <div class="card-header header row g-0">
            <div v-if="player.username.length < 3 || player.username == 'gast'" class="alert alert-danger">invalid username</div>
        </div>
        <div class="card-body row gx-0">
            <div class="profile-pic col-4">
                <div v-if="player.img">
                    <img :src="`/gt/img/avatars/char_${player.img}.png`" alt="" style="height: 20vw; width: 20vw" />
                </div>
                <div v-else>
                    <img src="/gt/img/avatars/avatar_placeholder.png" alt="" style="height: 20vw; width: 20vw" />
                </div>
                <div v-if="editProfile">
                    <!-- Button trigger modal -->
                    <button
                        type="button"
                        @click="buttonSound()"
                        class="btn btn-primary shadow-none"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        change profile picture
                    </button>

                    <!-- Modal -->
                    <div
                        class="modal fade"
                        id="exampleModal"
                        tabindex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                        @click="buttonSound()"
                    >
                        <div class="modal-dialog">
                            <div class="modal-content" @click.stop="">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">profile picture</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div v-for="image of images" :key="image" @click="changeImg(image)" data-bs-dismiss="modal">
                                        <img :src="`/gt/img/avatars/char_${image}.png`" alt="" />
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="buttonSound()">close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    registered since:
                    <br />
                    {{ new Date(player.registeredAt).toLocaleString() }}
                    <br />
                    played time:
                    <br />
                    {{ playTime }}
                </div>
            </div>

            <div class="col-8 row">
                <div class="row g-0">
                    <h4 class="col-11" v-if="!editProfile">
                        Username:
                        <u style="font-size: 1.5rem">
                            {{ player.username }}
                        </u>
                    </h4>
                    <div v-else class="input-contain col-11 mt-3" style="height: 5vh">
                        <input
                            minlength="3"
                            class="form-control"
                            id="username"
                            type="text"
                            v-model="player.username"
                            :class="{ dirty: player.username }"
                            autocomplete="off"
                            style="text-shadow: none"
                            @change="checkUserName()"
                            required
                        />
                        <label class="placeholder-text" for="username">
                            <div class="text">username</div>
                        </label>
                    </div>
                </div>
                <div class="col-6 gy-2">
                    <div>
                        Highscore normal:
                        <br />
                        {{ Math.round(player.highscore['normal']) }}
                    </div>
                    <div>
                        Played normal:
                        <br />
                        {{ player.playedGames['normal'] }}
                    </div>
                    <div>
                        Highscore hardcore:
                        <br />
                        {{ Math.round(player.highscore['hardcore']) }}
                    </div>
                    <div>
                        Played hardcore:
                        <br />
                        {{ player.playedGames['hardcore'] }}
                    </div>
                    <div>
                        Highscore totalchaos:
                        <br />
                        {{ Math.round(player.highscore['totalchaos']) }}
                    </div>
                    <div>
                        Played totalchaos:
                        <br />
                        {{ player.playedGames['totalchaos'] }}
                    </div>
                </div>
                <div class="col-6 gy-2 aling-content-start">
                    <div>
                        Skill Points:
                        <br />
                        {{ player.skillTree.skillPoints }}
                    </div>
                    <div>
                        Weapon number:
                        <br />
                        {{ player.weaponTree.weaponAvaibleTypes.length }}
                    </div>
                    <div>
                        Weapon Points:
                        <br />
                        {{ player.weaponTree.weaponPoints }}
                    </div>
                    <div>
                        Passiv items number:
                        <br />
                        {{ player.passivTree.passivAvaibleTypes.length - 1 }}
                    </div>

                    <div>
                        Passiv Points:
                        <br />
                        {{ player.passivTree.passivPoints }}
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="features">
                <div class="row g-0">
                    <div class="col-8"></div>
                    <div class="col-4" v-if="editAble">
                        <div v-if="!editProfile">
                            <button class="btn btn-primary shadow-none w-50" @click="toggleEdit(false)">edit profile</button>
                        </div>
                        <div v-if="editProfile">
                            <button
                                class="btn btn-success shadow-none w-50"
                                @click="toggleEdit(true)"
                                :disabled="player.username.length < 3 || player.username == 'gast'"
                            >
                                save profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer" v-if="editAble">
                <div class="footer-header">
                    <a href="https://discord.gg/G3UHhTaUNf">Join us on discord</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as API from '@/API'
import * as type from '@/types'
import * as music from '@/music'
import { skillDetails } from '@/global'
export default defineComponent({
    setup() {
        return {
            skillDetails,
        }
    },
    props: {
        playerProp: {
            type: Object as PropType<type.Player>,
            required: true,
            size: Number,
        },
        editAble: Boolean,
    },
    data() {
        return {
            player: {} as type.Player,
            dataLoad: false,
            hardCoreMode: false,
            editProfile: false,
            img: '',
            images: ['001', '002', '003', '004', '005'],
            message: '',
        }
    },
    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
        if (this.editAble) {
            music.changeVolume(this.player.settings.musicVolume)
        }
    },

    computed: {
        registered() {
            let help = JSON.parse(this.player.registeredAt)
            return help
        },

        playTime() {
            let time = this.player.playedTime
            let unit = ' ticks'
            if (time / 60 > 1) {
                time /= 60 //sec
                unit = ' sec'
            }
            if (time / 60 > 1) {
                time /= 60 //min
                unit = ' min'
            }
            if (time / 60 > 1) {
                time /= 60 //hour
                unit = ' hours'
            }
            return time.toFixed(1) + unit
        },
    },

    methods: {
        checkUserName() {
            if (this.player.username == 'gast') {
                this.message = 'invalid username'
                return false
            } else {
                this.message = ''
                return true
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },

        changeImg(id: string) {
            music.ButtonSound(this.player.settings.effectVolume)
            this.player.img = id
        },
        async toggleEdit(save: boolean) {
            music.ButtonSound(this.player.settings.effectVolume)
            this.editProfile = !this.editProfile
            if (save) {
                try {
                    await API.addPlayer(this.player)
                } catch {
                    API.logout()
                }
            }
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
