<template>
    <div class="card card-default" v-if="dataLoad">
        <div class="card-header header row g-0"></div>
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
                            required
                        />
                        <label class="placeholder-text" for="username">
                            <div class="text">username</div>
                        </label>
                    </div>
                    <div class="col-1" v-if="editAble">
                        <button class="col-1 btn align-self-end shadow-none" @click="buttonSound()" data-bs-toggle="modal" data-bs-target="#settings">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                fill="currentColor"
                                class="bi bi-gear-fill"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="col-6 gy-2">
                    <div>
                        Highscore normal:
                        <br />
                        {{ Math.round(player.highscore) }}
                    </div>
                    <div>
                        Played normal:
                        <br />
                        {{ player.playedGames }}
                    </div>
                    <div>
                        Highscore hardcore:
                        <br />
                        {{ Math.round(player.highscoreHardcore) }}
                    </div>
                    <div>
                        Played hardcore:
                        <br />
                        {{ player.playedHardcore }}
                    </div>
                    <div>
                        Highscore totalchaos:
                        <br />
                        {{ Math.round(player.highscoreTotalchaos) }}
                    </div>
                    <div>
                        Played totalchaos:
                        <br />
                        {{ player.playedTotalchaos }}
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
                            <button class="btn btn-success shadow-none w-50" @click="toggleEdit(true)" :disabled="player.username.length < 3">
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
        <!-- Modal -->
        <div class="modal fade" id="settings" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" @click="unDoChanges()">
            <div class="modal-dialog" @click.stop="">
                <div class="modal-content">
                    <div class="modal-body" style="background-color: grey">
                        <div class="row mt-1">
                            <div class="col-9">music volume:</div>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                class="col-3"
                                style="background-color: darkgrey"
                                v-model="settingsInput.musicVolume"
                                @change="changeVolume(volumeInput)"
                            />
                        </div>
                        <div class="row mt-1">
                            <div class="col-9">effect volume:</div>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                class="col-3"
                                style="background-color: darkgrey"
                                v-model="player.settings.effectVolume"
                            />
                        </div>
                        <div class="row mt-1" v-for="number of usedAbilitys.length" :key="number">
                            <select class="col-9" @click="buttonSound()" v-model="settingsInput.abilitys[number].name" style="background-color: grey">
                                <option
                                    :value="
                                        Object.keys(skillDetails).filter(
                                            sD => skillDetails[sD].name == skillDetails[usedAbilitys[number - 1]].name
                                        )[0]
                                    "
                                >
                                    {{ skillDetails[usedAbilitys[number - 1]].name }}
                                </option>
                                <!-- :selected="ability.name == player.settings.abilitys[number].name" -->
                                <option
                                    :value="ability"
                                    v-for="ability of availableAbilitys.filter(a => !usedAbilitys.includes(a))"
                                    :key="ability"
                                    @click="buttonSound()"
                                >
                                    {{ skillDetails[ability].name }}
                                </option>
                                <option style="color: black" disabled>unlock more by use the skilltree</option>
                            </select>
                            <input
                                class="col-3"
                                style="background-color: darkgrey"
                                v-model="settingsInput.abilitys[number].key"
                                type="text"
                                pattern="[a-z0-9]"
                                maxlength="1"
                                oninput="this.value = this.value.replace(/[^a-z0-9]/g, '').replace(/(\..*)\./g, '$1');"
                            />
                        </div>
                        <div class="row mt-1" v-for="direction in ['up', 'left', 'down', 'right']" :key="direction">
                            <div class="col-9">move {{ direction }}:</div>
                            <input
                                class="col-3"
                                style="background-color: darkgrey"
                                v-model="settingsInput.moves[direction]"
                                type="text"
                                pattern="[a-z0-9]"
                                maxlength="1"
                                oninput="this.value = this.value.replace(/[^a-z0-9]/g, '').replace(/(\..*)\./g, '$1');"
                            />
                        </div>
                        <div class="row justify-content-end mt-1">
                            <button data-bs-dismiss="modal" class="btn btn-danger mx-2 col-4" @click.stop="unDoChanges()">cancel</button>
                            <button class="btn btn-success col-3" :disabled="!checkSettings" @click.stop="saveSettings()" data-bs-dismiss="modal">
                                save
                            </button>
                        </div>
                    </div>
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
            settingsInput: {} as type.Settings,
            dataLoad: false,
            hardCoreMode: false,
            editProfile: false,
            volumeInput: 0,
            img: '',
            images: ['001', '002', '003', '004', '005'],
        }
    },
    mounted() {
        this.player = this.playerProp
        this.volumeInput = this.player.settings.musicVolume
        this.settingsInput = JSON.parse(JSON.stringify(this.player.settings))
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
        checkSettings() {
            let double = true
            if (
                [...new Set(Object.values(this.player.settings.moves).concat(Object.values(this.player.settings.abilitys).map(a => a.key)))].filter(
                    s => s
                ).length <
                4 + this.usedAbilitys.length
            )
                double = false
            return double
        },
        availableAbilitys() {
            let abilitys = []
            for (let skill of this.player.skillTree.skills) {
                if (skillDetails[skill.name].maxlvl == 1 && skill.lvl == 1) {
                    abilitys.push(skill.name)
                }
            }
            return abilitys as type.AbilityName[]
        },
        usedAbilitys() {
            let abilitys = [] as type.AbilityName[]
            for (let i = 1 as 1 | 2 | 3 | 4; i < 5; i++) {
                if (this.player.settings.abilitys[i].name) {
                    abilitys.push(this.player.settings.abilitys[i].name)
                }
            }
            return abilitys
        },
    },

    methods: {
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
        unDoChanges() {
            music.ButtonSound(this.player.settings.effectVolume)
            this.settingsInput = JSON.parse(JSON.stringify(this.player.settings))
            this.changeVolume(this.player.settings.musicVolume)
        },
        changeVolume(volumeInput: number) {
            music.changeVolume(volumeInput)
        },

        changeImg(id: string) {
            music.ButtonSound(this.player.settings.effectVolume)
            this.player.img = id
        },
        async saveSettings() {
            this.buttonSound()
            this.player.settings = JSON.parse(JSON.stringify(this.settingsInput))
            try {
                await API.addPlayer(this.player)
            } catch {
                API.logout()
            }
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
