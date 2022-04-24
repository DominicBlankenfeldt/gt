<template>
    <div id="test" style="height:92vh;width:100vw:">
        <div v-if="dataLoad" style="color: red">
            <div class="col-1"></div>
            <div class="row g-0" style="height: 5vh; position: relative">
                <div v-if="!bossEnemy.type" class="col-3">
                    <img src="../../public/img/items/coin/coin.gif" alt="coin" />
                    Score: {{ score > 1000000 ? Math.round(score / 1000) + 'k' : Math.round(score) }}+{{ (scorePerTick * 60).toFixed(0) }}/s
                    <img src="../../public/img/items/coin/coin.gif" alt="coin" />
                </div>
                <div v-else class="col-4"></div>
                <div class="col-2">
                    Enemies:{{ enemies.length
                    }}{{ !bossFight ? `(${((spawnEnemyTimer - (gameloopCounter % spawnEnemyTimer)) / 60).toFixed(1)}s)` : '' }}
                </div>
                <div class="col-3">
                    difficulty:{{ difficulty
                    }}{{ !bossFight ? `(${((difficultyTimer - (gameloopCounter % difficultyTimer)) / 60).toFixed(1)}s)` : '' }}
                </div>
                <div class="col-1">gps:{{ Math.round(gps) }}</div>
                <div v-if="!bossEnemy.type" class="col-3">
                    <img src="../../public/img/items/coin/coin.gif" alt="coin" />
                    Highscore:
                    <span id="scoreSpan">
                        {{
                            player.highscore[player.playMode] > 1000000
                                ? Math.round(player.highscore[player.playMode] / 1000) + 'k'
                                : Math.round(player.highscore[player.playMode])
                        }}
                    </span>
                    <img src="../../public/img/items/coin/coin.gif" alt="coin" />
                </div>
                <div v-else class="col-3"></div>
                <div v-if="bossFight && !bossEnemy.size">Boss Fight</div>
                <div v-if="bossFight && bossEnemy.size">Boss HP:{{ Math.ceil(bossEnemy.hP) }}</div>
                <div v-if="!bossFight && !bossEnemy.size">{{ player.playMode }}</div>
            </div>
            <div>
                <div class="d-flex justify-content-between">
                    <div class="col-1">
                        <div>durations</div>
                        <div class="mt-4" :style="{ color: effects.magnet.active ? 'green' : 'red' }">
                            Magnet:
                            <br />
                            {{ (effects.magnet.duration / 1000).toFixed(1) }}
                        </div>
                        <div class="mt-4" :style="{ color: effects.grow.active ? 'green' : 'red' }">
                            Grow:
                            <br />
                            {{ (effects.grow.duration / 1000).toFixed(1) }}
                        </div>
                        <div class="mt-4" :style="{ color: effects.slowEnemies.active ? 'green' : 'red' }">
                            Slow enemies:
                            <br />
                            {{ (effects.slowEnemies.duration / 1000).toFixed(1) }}
                        </div>
                        <div class="mt-4" :style="{ color: effects.stopTime.active ? 'green' : 'red' }">
                            Stop time:
                            <br />
                            {{ (effects.stopTime.duration / 1000).toFixed(1) }}
                        </div>
                    </div>
                    <div class="game" :class="{ noneCursor: gameStarted }">
                        <div
                            :style="{
                                left: playerInfo.vector[0] + 'px',
                                top: playerInfo.vector[1] + 'px',
                                width: playerInfo.size + 'px',
                                height: playerInfo.size + 'px',
                                transform: `rotate(${lastDirection}deg)`,
                            }"
                            style="position: absolute"
                        >
                            <img
                                :src="`/gt/img/char/playership${player.ship.selectedModel.img}.png`"
                                alt=""
                                :style="{
                                    width: playerInfo.size + 'px',
                                    height: playerInfo.size + 'px',
                                }"
                            />
                        </div>
                        <div
                            v-if="bossEnemy.size"
                            :style="{
                                left: bossEnemy.vector[0] + 'px',
                                top: bossEnemy.vector[1] + 'px',
                                width: bossEnemy.size + 'px',
                                height: bossEnemy.size + 'px',
                            }"
                            style="position: absolute"
                        >
                            <img
                                :src="bossEnemy.imgsrc"
                                alt="bossEnemy"
                                :style="{
                                    width: bossEnemy.size + 'px',
                                    height: bossEnemy.size + 'px',
                                }"
                            />
                        </div>
                        <div
                            v-for="plasma of plasmas"
                            :key="JSON.stringify(plasma)"
                            :style="{
                                left: plasma.vector[0] + 'px',
                                top: plasma.vector[1] + 'px',
                                width: plasma.size + 'px',
                                height: plasma.size + 'px',
                            }"
                            style="position: absolute"
                        >
                            <img
                                :src="plasma.imgsrc"
                                alt="plasma"
                                :style="{
                                    width: plasma.size + 'px',
                                    height: plasma.size + 'px',
                                }"
                            />
                        </div>
                        <div
                            v-for="plasma of enemyPlasmas"
                            :key="JSON.stringify(plasma)"
                            :style="{
                                left: plasma.vector[0] + 'px',
                                top: plasma.vector[1] + 'px',
                                width: plasma.size + 'px',
                                height: plasma.size + 'px',
                            }"
                            style="position: absolute"
                        >
                            <img
                                :src="plasma.imgsrc"
                                alt="plasma"
                                :style="{
                                    width: plasma.size + 'px',
                                    height: plasma.size + 'px',
                                }"
                            />
                        </div>
                        <div
                            v-for="enemy of enemies"
                            :key="enemy.id"
                            :style="{
                                left: enemy.vector[0] + 'px',
                                top: enemy.vector[1] + 'px',
                                width: enemy.size + 'px',
                                height: enemy.size + 'px',
                            }"
                            style="position: absolute"
                        >
                            <img
                                :src="enemy.imgsrc"
                                alt="enemy"
                                :style="{
                                    width: enemy.size + 'px',
                                    height: enemy.size + 'px',
                                }"
                            />
                        </div>
                        <div
                            v-for="item of items"
                            :key="JSON.stringify(item)"
                            :style="{
                                left: item.vector[0] + 'px',
                                top: item.vector[1] + 'px',
                                backgroundColor: item.imgsrc,
                            }"
                            style="position: absolute"
                        >
                            <img :src="item.imgsrc" alt="" :style="{ width: item.size + 'px', height: item.size + 'px' }" />
                        </div>
                        <div
                            v-for="specialScore of specialScores"
                            :key="JSON.stringify(specialScore)"
                            :style="{
                                left: specialScore.vector[0] + 'px',
                                top: specialScore.vector[1] + 'px',
                            }"
                            style="position: absolute; color: green"
                        >
                            +{{ Math.round(specialScore.score) }}
                        </div>
                        <div v-if="message" :class="messageType">
                            {{ message }}
                        </div>
                        <div v-if="receiveMessages.length" class="alert alert-success">
                            <div v-for="receiveMessage of receiveMessages" :key="receiveMessage">
                                {{ receiveMessage }}
                            </div>
                        </div>
                        <button
                            v-if="!gameStarted"
                            class="btn shadow-none"
                            style="position: absolute; left: 90%; top: 4% color:grey"
                            @click="buttonSound()"
                            id="settingsBtn"
                            data-bs-toggle="modal"
                            data-bs-target="#settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="5vw" height="5vw" fill="grey" class="bi bi-gear-fill" viewBox="0 0 16 16">
                                <path
                                    d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
                                />
                            </svg>
                        </button>
                        <div class="container" v-if="!gameStarted">
                            <button @keydown.enter.prevent class="btn shadow-none" @click="start()">
                                <a>{{ startButtonText }}</a>
                            </button>
                            <button @keydown.enter.prevent v-if="cancelButtonText" class="btn shadow-none" @click="cancel()">
                                <a>{{ cancelButtonText }}</a>
                            </button>
                            <br />
                            <button class="btn shadow-none" @keydown.enter.prevent @click="changePlayMode('normal')" v-if="!cancelButtonText">
                                <a>
                                    normal:
                                    <br />
                                    {{ player.playMode == 'normal' ? 'ON' : 'OFF' }}
                                </a>
                            </button>
                            <button class="btn shadow-none" @keydown.enter.prevent @click="changePlayMode('hardcore')" v-if="!cancelButtonText">
                                <a>
                                    hardcore:
                                    <br />
                                    {{ player.playMode == 'hardcore' ? 'ON' : 'OFF' }}
                                </a>
                            </button>

                            <button class="btn shadow-none" @keydown.enter.prevent @click="changePlayMode('totalchaos')" v-if="!cancelButtonText">
                                <a>
                                    total chaos:
                                    <br />
                                    {{ player.playMode == 'totalchaos' ? ' ON' : ' OFF' }}
                                </a>
                            </button>
                            <br />
                            <button
                                class="btn shadow-none"
                                @keydown.enter.prevent
                                @click="startBossFight('normal')"
                                v-if="player.weaponTree.weaponAvaibleTypes.length < weaponAmount && !cancelButtonText"
                            >
                                <a>{{ bossAvailable('normal') }}</a>
                            </button>
                            <button v-if="player.weaponTree.weaponAvaibleTypes.length >= weaponAmount && !cancelButtonText" class="btn shadow-none">
                                <a>you have unlocked all weapons</a>
                            </button>

                            <button
                                class="btn shadow-none"
                                @keydown.enter.prevent
                                @click="startBossFight('hardcore')"
                                v-if="player.passivTree.passivAvaibleTypes.length < passivAmount && !cancelButtonText"
                            >
                                <a>{{ bossAvailable('hardcore') }}</a>
                            </button>
                            <button v-if="player.passivTree.passivAvaibleTypes.length >= passivAmount && !cancelButtonText" class="btn shadow-none">
                                <a>you have unlocked all passivs</a>
                            </button>
                            <button
                                class="btn shadow-none"
                                @keydown.enter.prevent
                                @click="startBossFight('totalchaos')"
                                v-if="player.peculiarities.available.length < peculiarityAmout && !cancelButtonText"
                            >
                                <a>{{ bossAvailable('totalchaos') }}</a>
                            </button>
                            <button v-if="player.peculiarities.available.length >= peculiarityAmout && !cancelButtonText" class="btn shadow-none">
                                <a>you have unlocked all peculiarities</a>
                            </button>
                        </div>
                    </div>
                    <div class="col-1">
                        <div>cooldowns ({{ player.shop.energyCell.amount }})</div>
                        <div
                            class="mt-4"
                            v-for="ability of player.settings.abilitys"
                            :key="JSON.stringify(ability)"
                            :style="{
                                color:
                                    coolDowns[ability.name] == 0 && player.shop.energyCell.amount > skillDetails[ability.name].tier ? 'green' : 'red',
                            }"
                        >
                            <div v-if="ability.name">
                                {{ skillDetails[ability.name].name }}:
                                <br />
                                {{ (coolDowns[ability.name] / 1000).toFixed(1) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <div v-if="!user && !gameStarted">Log in to use all features.</div>
                <div v-if="user && !gameStarted">{{ tip }}</div>
                <div v-if="gameStarted" class="d-flex justify-content-center">
                    <div v-for="hp of playerInfo.hP" :key="hp">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2vw"
                            height="2vw"
                            fill="currentColor"
                            class="bi bi-heart-fill"
                            viewBox="0 0 16 16"
                        >
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                        </svg>
                    </div>
                    <div v-for="hp of shield" :key="hp" style="color: grey">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2vw"
                            height="2vw"
                            fill="currentColor"
                            class="bi bi-shield-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <!-- Modal -->
            <div
                class="modal fade"
                id="settings"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                @click="unDoChanges()"
                style="margin-top: 11vh"
            >
                <div class="modal-dialog" @click.stop="">
                    <div class="modal-content">
                        <div class="modal-body" style="background-color: grey">
                            <div class="row mt-1">
                                <div class="col-9" style="color: black">music volume:</div>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    class="col-3"
                                    style="background-color: darkgrey"
                                    v-model="settingsInput.musicVolume"
                                    @change="changeVolume(settingsInput.musicVolume)"
                                />
                            </div>
                            <div class="row mt-1">
                                <div class="col-9" style="color: black">effect volume:</div>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    class="col-3"
                                    style="background-color: darkgrey"
                                    v-model="settingsInput.effectVolume"
                                />
                            </div>
                            <div class="row mt-1" v-for="number of usedAbilitys.length" :key="number">
                                <select
                                    class="col-9"
                                    @click="buttonSound()"
                                    v-model="settingsInput.abilitys[number].name"
                                    style="background-color: grey"
                                >
                                    <option
                                        :value="
                                            Object.keys(skillDetails).filter(
                                                sD => skillDetails[sD].name == skillDetails[usedAbilitys[number - 1]].name
                                            )[0]
                                        "
                                    >
                                        {{ skillDetails[usedAbilitys[number - 1]].name }}
                                    </option>
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
                                <div class="col-9" style="color: black">move {{ direction }}:</div>
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
                            <div v-for="shopItem of ['lessStartEnemies', 'higherDifficultyTimer', 'lowerScoreTimer']" :key="shopItem" class="mt-1">
                                <label
                                    class="form-check-label w-100 rounded-bottom unselectable py-1 pointer"
                                    style="color: black"
                                    @click="
                                        {
                                            ;(player.shop[shopItem].use = !player.shop[shopItem].use), buttonSound()
                                        }
                                    "
                                    :style="{ backgroundColor: player.shop[shopItem].use ? 'green' : 'red' }"
                                    :data-title="shopDetails[shopItem].description"
                                >
                                    use {{ shopDetails[shopItem].name }}
                                </label>
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { addVec, dirVec, lenVec, lenVecSqrt, mulVec, norVec, rotVec, subVec, addVecNum, subVecVec } from '@/game/vectors'
import {
    checkPlayer,
    production,
    skillDetails,
    weaponAmount,
    passivAmount,
    peculiarityAmout,
    shopDetails,
    weaponDetails,
    modelDetails,
    maxCurrency,
    houseDetails,
    peculiarityDetails,
    passivDetails,
    hangarSize,
} from '@/global'
import { borderCheck, findSkill, getRandomInt, percent, roundHalf, grow, findHouse, sellModel, buyModel } from '@/game/helpers'
import { weapons } from '@/game/weapons'
import { plasmaMovement, playerMovement, enemyMovement } from '@/game/movement'
import { createEnemy, createItems } from '@/game/createStuff'
import { tips } from '@/game/tip'
import { currentUser } from '@/router'
import * as music from '@/music'
import * as type from '@/types'
import * as API from '@/API'

export default defineComponent({
    setup() {
        production
        currentUser
        skillDetails
        weaponDetails
        return {
            findSkill,
            skillDetails,
            weaponAmount,
            passivAmount,
            peculiarityAmout,
            shopDetails,
            percent,
        }
    },
    data() {
        return {
            // display
            dataLoad: false,
            user: currentUser,
            message: '',
            receiveMessages: [] as string[],
            messageType: '',
            startButtonText: 'start',
            cancelButtonText: '',
            middlex: window.innerWidth / 2,
            generalSize: (window.innerWidth / 1920 + window.innerHeight / 955) / 2,
            field: {
                borderRight: 0,
                borderLeft: 0,
                borderUp: 0,
                borderDown: 0,
            } as type.Field,
            production: production.value,
            specialScores: [] as type.SpecialScore[],
            tip: '',
            tipsNumber: 7,
            // debug
            enemiesSpawn: true,
            enemiesMove: true,
            enemiesType: '',
            itemSpawn: true,
            //player
            immunity: false,
            player: {} as type.Player,
            maxEnergyCell: 0,
            playerInfo: {
                vector: [0, 0] as type.Vector,
                moveVector: [0, 0] as type.Vector,
                size: 20,
                originalSize: 20,
                speed: 5,
                hP: 1,
            },
            effects: {
                grow: { active: false, duration: 0 },
                magnet: { active: false, duration: 0 },
                stopTime: { active: false, duration: 0 },
                slowEnemies: { active: false, duration: 0 },
            },
            bossFight: false,
            lastDirection: 0,
            plasmas: [] as type.Plasma[],
            coolDowns: {
                bombAbility: 0,
                shotAbility: 0,
                slowAbility: 0,
                fastAbility: 0,
                magnetAbility: 0,
                slowEnemyAbility: 0,
                stopTimeAbility: 0,
                growAbility: 0,
            },
            skillObject: {} as type.SkillObject,
            passivObject: {} as type.PassivObject,
            weaponObject: {} as type.WeaponObject,
            fleetSkillObject: {} as type.FleetSkillObject,
            multiplicator: 1,
            shield: 0,
            maxShield: 1,
            // boss
            bossEnemy: {} as type.BossEnemy,
            enemyPlasmas: [] as type.Plasma[],
            highscoreMultiplier: {
                normal: 25000,
                hardcore: 2500,
                totalchaos: 25000,
            },
            // gameSetup
            settingsInput: {} as type.Settings,
            hardCoreMode: false,
            gameStarted: false,
            spawnBadItems: true,
            startingEnemies: 4,
            difficulty: 2,
            scoreMultiplier: 2,
            score: 0,
            scorePerTick: 0,
            difficultyTimer: 1200,
            scoreTimer: 1200,
            lastScore: 0,
            gameloopCounter: 0,
            gameloopCounter2: 0,
            gameloopLastCounter: 0,
            countgpsID: 0,
            gps: 60,
            items: [] as type.Item[],
            pressedKeys: {} as Record<string, boolean>,
            enemies: [] as type.Enemy[],
            //fleet
            fleetMembers: [] as type.Player[],
            fleet: {} as type.SpaceFleet,
        }
    },
    computed: {
        haveShotAbility() {
            return () => Object.values(this.player.settings.abilitys).some(a => a.name == 'shotAbility')
        },
        fleetlvl() {
            let lvl = 0
            for (let member of this.fleetMembers) {
                for (let mode of ['normal', 'hardcore', 'totalchaos'] as type.PlayMode[]) lvl += member.defeatedBosses[mode]
            }
            if (lvl > 50) lvl = 50
            return lvl
        },
        spawnEnemyTimer() {
            let timer = Math.round(
                900 *
                    percent(this.skillObject['spawnLessEnemy'], 'in') *
                    (this.player.passivTree.passivType.includes('nerfEnemies') ? percent(this.passivObject['nerfEnemies'] / 4, 'in') : 1)
            )
            return timer
        },
        usedAbilitys() {
            let abilitys = [] as type.AbilityName[]
            for (let i = 1 as 1 | 2 | 3 | 4; i < 5; i++) {
                if (this.settingsInput.abilitys[i].name) {
                    abilitys.push(this.settingsInput.abilitys[i].name)
                }
            }
            return abilitys
        },
        availableAbilitys() {
            let abilitys = [] as any[]
            this.player.skillTree.skills.forEach(skill => {
                if (skillDetails[skill.name].maxlvl == 1 && skill.lvl == 1) {
                    abilitys.push(skill.name)
                }
            })
            return abilitys as type.AbilityName[]
        },
        checkSettings() {
            let double = true
            if (
                [...new Set(Object.values(this.settingsInput.moves).concat(Object.values(this.settingsInput.abilitys).map(a => a.key)))].filter(
                    s => s
                ).length <
                4 + this.usedAbilitys.length
            )
                double = false
            return double
        },
    },
    async mounted() {
        // start game if not started on enter press

        document.onkeyup = (e: any) => {
            if (e.code == 'Enter' && !this.gameStarted) this.start()
        }

        window.onresize = () => {
            this.changeDisplaySize()
        }
        setInterval(async () => {
            if (this.gameStarted) await this.gameloop()
        }, 1000 / 60)
        this.changeDisplaySize()
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
        if (this.player.spaceFleet) await this.loadFleet()
        this.player = checkPlayer(this.player) as type.Player
        this.settingsInput = JSON.parse(JSON.stringify(this.player.settings))
        music.changeVolume(this.player.settings.musicVolume)
        this.buttonSound()
        this.playerInfo.size *= this.generalSize
        this.playerStartPosition()
        this.bossFight = false
        this.tip = tips(getRandomInt(this.tipsNumber))
        this.skillObject = this.player.skillTree.skills.reduce((a, v) => ({ ...a, [v.name]: v.lvl }), {}) as type.SkillObject
        this.passivObject = this.player.passivTree.passivUpgrades.reduce((a, v) => ({ ...a, [v.name]: v.lvl }), {}) as type.PassivObject
        this.weaponObject = this.player.weaponTree.weaponUpgrades.reduce((a, v) => ({ ...a, [v.name]: v.lvl }), {}) as type.WeaponObject
        if (this.fleet.fleetInfo.founder)
            this.fleetSkillObject = this.fleet.skills.reduce((a, v) => ({ ...a, [v.name]: v.lvl }), {}) as type.FleetSkillObject
        this.playerInfo = {
            vector: [0, 0] as type.Vector,
            moveVector: [0, 0] as type.Vector,
            size: modelDetails[this.player.ship.selectedModel.rarity].size * percent(this.passivObject.shipStats / 5, 'de'),
            originalSize: modelDetails[this.player.ship.selectedModel.rarity].size * percent(this.passivObject.shipStats / 5, 'de'),
            speed: modelDetails[this.player.ship.selectedModel.rarity].speed * percent(this.passivObject.shipStats / 5, 'in'),
            hP: modelDetails[this.player.ship.selectedModel.rarity].hp,
        }
        this.maxEnergyCell = Math.round(modelDetails[this.player.ship.selectedModel.rarity].store * percent(this.passivObject.shipStats / 5, 'in'))
        this.dataLoad = true
    },
    methods: {
        unDoChanges() {
            music.ButtonSound(this.player.settings.effectVolume)
            this.settingsInput = JSON.parse(JSON.stringify(this.player.settings))
            this.changeVolume(this.player.settings.musicVolume)
        },
        changeVolume(volumeInput: number) {
            music.changeVolume(volumeInput)
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
        async loadFleet() {
            this.fleetMembers = []
            let result
            if (this.player.spaceFleet) {
                this.fleet = await API.getPlayerSpaceFleet(this.player.spaceFleet)
                if (!this.fleet.fleetInfo.founder || !this.fleet.members.includes(this.user!.uid)) {
                    this.player.spaceFleet = ''
                    this.fleet = {
                        members: [] as string[],
                        fleetInfo: {
                            founder: '',
                            img: '',
                            name: '',
                            info: '',
                            public: false,
                        },
                        skills: [
                            { name: 'bossEnemies', lvl: 0 },
                            { name: 'bossDifficulty', lvl: 0 },
                        ],
                    } as type.SpaceFleet
                    return
                }
            }
            result = (await API.getFleetMembers(this.player.spaceFleet!)) as type.User[]
            let fleetMembers = []
            for (let member of result) fleetMembers.push(member)
            this.fleetMembers = fleetMembers.filter(m => this.fleet.members.includes(m.id)).map(m => m.player)
        },
        //game
        async gameloop() {
            this.player.playedTime++
            this.multiplicator = 1
            this.handlePlayerAbilities()
            this.increaseScore()
            this.colisionHandling()
            this.despawnItems()
            if (!this.effects.stopTime.active) this.gameloopCounter2++
            this.gameloopCounter++
            if (this.bossFight) {
                this.handleBossEnemyMovement()
                if (this.gameloopCounter % 90 == 0) {
                    this.bossEnemyAbilitys()
                }
            } else {
                if (this.gameloopCounter % this.difficultyTimer == 0) this.difficulty += 0.5
                if (this.gameloopCounter % this.scoreTimer == 0) this.scoreMultiplier += 0.5
                if (this.gameloopCounter % this.spawnEnemyTimer == 0)
                    createEnemy(this.enemies, this.generalSize, this.field, this.skillObject, this.playerInfo)
            }
            if ((this.player.playMode == 'totalchaos' && !this.bossFight) || this.bossEnemy.type == 'totalchaos') {
                if (this.gameloopCounter % 60 == 0) this.handleTotalchaos()
            }
            if (this.gameloopCounter2 % 60 == 0) this.growBlackHole() // 1sek
            if (this.player.passivTree.passivType.includes('moreItems')) {
                if (this.gameloopCounter2 % Math.round(120 * percent(this.passivObject['moreItems'], 'de')) == 0) {
                    this.spawnItems(this.spawnBadItems) // 2sek
                    this.spawnBadItems = !this.spawnBadItems
                }
            } else {
                if (this.gameloopCounter2 % 120 == 0) this.spawnItems(true) // 2sek
            }
            if (this.player.peculiarities.selected == 'generator') {
                if (this.gameloopCounter2 % 600 == 0) {
                    if (
                        this.player.shop.currency >= shopDetails['energyCell'].cost &&
                        this.player.shop.energyCell.amount < this.maxEnergyCell + this.weaponObject['munitionsDepot']
                    ) {
                        this.player.shop.currency -= shopDetails['energyCell'].cost
                        this.player.shop.energyCell.amount++
                    }
                }
            }
            if (this.player.peculiarities.selected == 'autoShot' && this.haveShotAbility && this.coolDowns.shotAbility == 0) this.shotAbility(false)
            this.handlePlayerMovement()
            this.handlePlasmaMovement()
            this.handleEnemyMovement()
            this.reduceDuartion()
            this.handleEnemyRandom()
            await this.handleBossEnemyDead()
        },
        start() {
            if (this.gameStarted) return
            this.gameStarted = true
            this.buttonSound()
            this.playerInfo.hP = modelDetails[this.player.ship.selectedModel.rarity].hp + this.weaponObject['moreHP']
            if (this.bossFight) {
                this.bossEnemyPreparations()
            } else {
                switch (this.player.playMode) {
                    case 'normal':
                        this.startingEnemies = 6
                        break
                    case 'hardcore':
                        this.startingEnemies = 50
                        break
                    case 'totalchaos':
                        this.startingEnemies = 6
                        break
                }
                this.player.playedGames[this.player.playMode]++
                this.difficulty = 2
                for (let shopItem of ['lessStartEnemies', 'higherDifficultyTimer', 'lowerScoreTimer'] as type.ShopElement[]) {
                    if (this.player.shop[shopItem].use && this.player.shop[shopItem].amount > 0) {
                        this.player.shop[shopItem].amount--
                        switch (shopItem) {
                            case 'lessStartEnemies':
                                this.startingEnemies -= this.player.shop.lessStartEnemies.lvl
                                break
                            case 'higherDifficultyTimer':
                                this.difficultyTimer = 1200 + 90 * this.player.shop.higherDifficultyTimer.lvl
                                break
                            case 'lowerScoreTimer':
                                this.scoreTimer = 1200 - 90 * this.player.shop.lowerScoreTimer.lvl
                                break
                        }
                    }
                }
            }
            this.reset()
            this.scoreMultiplier = modelDetails[this.player.ship.selectedModel.rarity].scoreMultiplier
            this.playerInfo.speed = 5
            this.gameloopLastCounter = 0
            this.gameloopCounter = 0
            this.score = 0
            this.playerStartPosition()

            this.enemies = [] as type.Enemy[]
            this.items = [] as type.Item[]
            this.plasmas = [] as type.Plasma[]
            this.enemyPlasmas = [] as type.Plasma[]
            this.specialScores = [] as type.SpecialScore[]
            this.message = ''
            this.receiveMessages = [] as string[]
            this.startButtonText = 'start'
            this.cancelButtonText = ''
            window.onkeyup = (e: any) => {
                this.pressedKeys[e.key] = false
            }
            window.onkeydown = (e: any) => {
                this.pressedKeys[e.key] = true
            }
            for (let i = 0; i < this.startingEnemies; i++) createEnemy(this.enemies, this.generalSize, this.field, this.skillObject, this.playerInfo)
            if (this.skillObject['shieldGenerator']) this.shield = this.maxShield
            clearTimeout(this.countgpsID)
            this.countgps()
        },
        reset() {
            this.effects = {
                grow: { active: false, duration: 0 },
                magnet: { active: false, duration: 0 },
                stopTime: { active: false, duration: 0 },
                slowEnemies: { active: false, duration: 0 },
            }
            this.coolDowns = {
                bombAbility: 0,
                shotAbility: 0,
                fastAbility: 0,
                slowAbility: 0,
                magnetAbility: 0,
                slowEnemyAbility: 0,
                stopTimeAbility: 0,
                growAbility: 0,
            }
        },
        //total chaos mode
        handleTotalchaos() {
            this.playerInfo.speed = 5
            switch (getRandomInt(4)) {
                case 0:
                    this.chaosItems()
                    break
                case 1:
                    this.chaosPlayerSpeed()
                    break
                case 2:
                    this.chaosEffect()
                    break
                case 3:
                    this.chaosBuffEnemy()
                    break
            }
        },
        chaosItems() {
            for (let i = 0; i < 5; i++) this.spawnItems(true)
        },
        chaosPlayerSpeed() {
            switch (getRandomInt(2)) {
                case 0:
                    if (
                        this.player.peculiarities.selected == 'slowSpeed' &&
                        Object.values(this.player.settings.abilitys)
                            .map(e => e.name)
                            .includes('fastAbility')
                    )
                        break
                    this.playerInfo.speed *= 0.5
                    break
                case 1:
                    if (
                        this.player.peculiarities.selected == 'slowSpeed' &&
                        Object.values(this.player.settings.abilitys)
                            .map(e => e.name)
                            .includes('slowAbility')
                    )
                        break
                    this.playerInfo.speed *= 2
                    break
            }
        },
        chaosEffect() {
            switch (getRandomInt(4)) {
                case 0:
                    this.effects.magnet = { active: true, duration: 1000 }
                    break
                case 1:
                    this.effects.grow = { active: true, duration: 1000 }
                    break
                case 2:
                    this.effects.slowEnemies = { active: true, duration: 1000 }
                    break
                case 3:
                    this.effects.stopTime = { active: true, duration: 1000 }
                    break
            }
        },
        chaosBuffEnemy() {
            for (let enemy of this.enemies) {
                switch (getRandomInt(4)) {
                    case 0:
                        if (!enemy.isGrow) {
                            enemy = grow(enemy, 1.5, this.generalSize) as type.Enemy
                        }
                        enemy.isGrow = true
                        break
                    case 1:
                        enemy.isMagnet = true
                        break
                    case 2:
                        enemy.speed = 1.25
                        break
                    case 3:
                        enemy.speed = 0.75
                        break
                }
            }
        },
        //general
        increaseScore() {
            this.lastScore = this.score
            if (this.effects.grow.active) {
                this.playerInfo.size = this.playerInfo.originalSize * 2 * this.generalSize
                this.score +=
                    this.scoreMultiplier *
                    percent(this.skillObject['scoreMultiplicator'], 'in') *
                    1.2 *
                    percent(this.skillObject['betterGrowPotion'], 'in') *
                    (this.player.passivTree.passivType.includes('increaseScore') ? percent(this.passivObject['increaseScore'] / 1.5, 'in') : 1)
            } else {
                this.playerInfo.size = this.playerInfo.originalSize * this.generalSize
                this.score +=
                    this.scoreMultiplier *
                    percent(this.skillObject['scoreMultiplicator'], 'in') *
                    (this.player.passivTree.passivType.includes('increaseScore') ? percent(this.passivObject['increaseScore'] / 1.5, 'in') : 1)
            }
            let effectAmount = 0
            for (let effect of Object.values(this.effects)) {
                if (effect.active) effectAmount++
            }
            this.score += this.skillObject['scorePerEffect'] * effectAmount * 0.15
            this.scorePerTick = this.score - this.lastScore
        },
        countgps() {
            this.countgpsID = setTimeout(() => {
                this.gps = (this.gameloopCounter - this.gameloopLastCounter) * 2
                if (this.gps > 60) this.gps = 60
                this.gameloopLastCounter = this.gameloopCounter
                this.countgps()
            }, 500)
        },
        cancel() {
            this.buttonSound()
            this.bossEnemy = {} as type.BossEnemy
            this.bossFight = false
            this.startButtonText = 'start'
            this.cancelButtonText = ''
            this.message = ''
        },
        async gameOver(message: string, messageType: string) {
            if (this.bossFight) {
                this.score = 0
                this.startButtonText = 'try again'
                this.cancelButtonText = 'cancel'
            } else {
                for (let shopItem of ['lessStartEnemies', 'higherDifficultyTimer', 'lowerScoreTimer'] as type.ShopElement[]) {
                    if (this.player.shop[shopItem].use && this.player.shop[shopItem].reBuy) {
                        if (
                            this.player.shop.currency >= shopDetails[shopItem].cost &&
                            this.player.shop[shopItem].amount < shopDetails[shopItem].max
                        ) {
                            this.player.shop.currency -= shopDetails[shopItem].cost
                            this.player.shop[shopItem].amount++
                        }
                    }
                }
            }
            if (this.player.shop.energyCell.reBuy) {
                while (
                    this.player.shop.currency >= shopDetails['energyCell'].cost &&
                    this.player.shop.energyCell.amount < this.maxEnergyCell + this.weaponObject['munitionsDepot']
                ) {
                    this.player.shop.currency -= shopDetails['energyCell'].cost
                    this.player.shop.energyCell.amount++
                }
            }
            for (let house of this.player.spaceport.houses) {
                if (house.needScore) {
                    house.needScore -= Math.round(this.score)
                    if (house.needScore <= 0) {
                        house.needScore = 0
                        house.lvl++
                        this.receiveMessages.push(`${houseDetails[house.name].name} was finished`)
                    }
                }
            }
            this.gameStarted = false
            this.tip = tips(getRandomInt(this.tipsNumber))
            this.reset()
            this.message = message
            this.messageType = messageType
            this.newModel()
            if (this.score > this.player.highscore[this.player.playMode]) this.player.highscore[this.player.playMode] = this.score
            this.setSkillPoints()
            this.player.shop.currency = Math.round(this.player.shop.currency)
            try {
                await API.addPlayer(this.player)
            } catch {
                API.logout()
            }
        },
        newModel() {
            if (this.score < 10000) return
            let max = 2 + Math.floor(this.score / 3333333)
            if (max > 5) max = 5
            let result = buyModel(this.player, max, 0)
            this.player = result.player
            if (result.receiveMessage) this.receiveMessages.push(result.receiveMessage)
        },
        setSkillPoints() {
            if (this.player.skillTree.skillPoints < Math.floor(this.player.highscore['normal'] / 1000)) {
                this.receiveMessages.push(
                    `you get ${Math.floor(this.player.highscore['normal'] / 1000) - this.player.skillTree.skillPoints} skillpoints`
                )
                this.player.skillTree.skillPoints = Math.floor(this.player.highscore['normal'] / 1000)
            }
            if (this.player.weaponTree.weaponPoints < Math.floor(this.player.highscore['hardcore'] / 500)) {
                this.receiveMessages.push(
                    `you get ${Math.floor(this.player.highscore['hardcore'] / 500) - this.player.weaponTree.weaponPoints} weaponpoints`
                )
                this.player.weaponTree.weaponPoints = Math.floor(this.player.highscore['hardcore'] / 500)
            }
            if (this.player.passivTree.passivPoints < Math.floor(this.player.highscore['totalchaos'] / 2000)) {
                this.receiveMessages.push(
                    `you get ${Math.floor(this.player.highscore['totalchaos'] / 2000) - this.player.passivTree.passivPoints} passivpoints`
                )
                this.player.passivTree.passivPoints = Math.floor(this.player.highscore['totalchaos'] / 2000)
            }
        },
        // boss
        bossAvailable(type: type.BossType) {
            if (!findSkill(this.player, 'shotAbility')) return `skill ${skillDetails['shotAbility'].name}`
            if (!this.haveShotAbility) return `select ${skillDetails['shotAbility'].name}`
            if (this.bossEnemy.type == type) return 'cancel'
            if (
                this.player.highscore[type] >=
                Math.round(this.highscoreMultiplier[type] * (this.player.defeatedBosses[type] + 1) * percent(this.fleetlvl, 'de'))
            )
                return 'Boss fight available'
            else
                return `You need ${Math.round(
                    this.highscoreMultiplier[type] * (this.player.defeatedBosses[type] + 1) * percent(this.fleetlvl, 'de')
                )} highscore`
        },
        startBossFight(type: type.BossType) {
            if (this.bossEnemy.type == type) {
                this.cancel()
                return
            }
            if (!this.skillObject['shotAbility']) {
                this.$router.push('/skillTree')
                return
            }
            if (!this.haveShotAbility) {
                document.getElementById('settingsBtn')?.click()
                return
            }
            if (this.player.highscore[type] < this.highscoreMultiplier[type] * (this.player.defeatedBosses[type] + 1) * percent(this.fleetlvl, 'de'))
                return
            this.buttonSound()
            this.bossEnemy.type = type
            this.bossFight = true
        },
        bossEnemyPreparations() {
            this.bossEnemy.size = 50 * this.generalSize
            this.bossEnemy.imgsrc = '/gt/img/boss/bossEnemy.gif'
            this.bossEnemy.moveVector = norVec([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2])
            switch (this.bossEnemy.type) {
                case 'normal':
                    this.bossEnemy.maxHP = Math.round(60 * this.bossLifeMultiplier())
                    this.startingEnemies = Math.round(4 + this.player.defeatedBosses[this.bossEnemy.type])
                    this.difficulty = roundHalf(2 + this.player.defeatedBosses[this.bossEnemy.type])
                    break
                case 'hardcore':
                    this.bossEnemy.maxHP = Math.round(30 * this.bossLifeMultiplier())
                    this.startingEnemies = Math.round(50 + this.player.defeatedBosses[this.bossEnemy.type])
                    this.difficulty = roundHalf(2)
                    break
                case 'totalchaos':
                    this.bossEnemy.maxHP = Math.round(60 * this.bossLifeMultiplier())
                    this.startingEnemies = Math.round(4 + this.player.defeatedBosses[this.bossEnemy.type])
                    this.difficulty = roundHalf(2 + this.player.defeatedBosses[this.bossEnemy.type])
            }
            if (this.fleet.fleetInfo.founder) {
                this.startingEnemies -= this.fleetSkillObject['bossEnemies']
                this.startingEnemies = Math.round(this.startingEnemies * percent(this.fleetlvl, 'de'))
                if (this.startingEnemies < 1) this.startingEnemies = 1
                this.difficulty -= this.fleetSkillObject['bossDifficulty']
                this.difficulty = roundHalf(this.difficulty * percent(this.fleetlvl, 'de'))
                if (this.difficulty < 2) this.difficulty = 2
            }
            this.bossEnemy.hP = this.bossEnemy.maxHP
            this.bossEnemy.speed = 5
            do {
                this.bossEnemy.vector = [
                    getRandomInt(this.field.borderRight - this.field.borderLeft - this.bossEnemy.size) + this.field.borderLeft,
                    getRandomInt(this.field.borderDown - this.field.borderUp - this.bossEnemy.size) + this.field.borderUp,
                ] as type.Vector
            } while (lenVec(subVec(this.bossEnemy.vector, this.playerInfo.vector)) < 250 * this.generalSize)
        },
        bossLifeMultiplier() {
            return (
                (this.player.defeatedBosses[this.bossEnemy.type] + 1) *
                percent(this.player.defeatedBosses[this.bossEnemy.type] + 1 * 20, 'in') *
                (this.player.passivTree.passivType.includes('nerfBoss') ? percent(this.passivObject['nerfBoss'] / 2, 'de') : 1)
            )
        },
        bossEnemyAbilitys() {
            this.bossEnemy.speed = 5
            switch (getRandomInt(4)) {
                case 0:
                    this.bossEnemyAbilityShot()
                    break
                case 1:
                    this.bossEnemyAbilityMove()
                    break
                case 2:
                    switch (this.bossEnemy.type) {
                        case 'normal':
                            this.bossEnemyAbilityBuffEnemies()
                            break
                        case 'hardcore':
                            this.bossAbilitySpawnItems()
                            break
                    }
                    break
                case 3:
                    this.bossEnemyAbilitySpeedUp()
                    break
            }
        },
        bossEnemyAbilityShot() {
            switch (this.bossEnemy.type) {
                case 'normal':
                    for (let i = 0; i < 7; i++) {
                        this.enemyPlasmas.push({
                            moveVector: norVec(rotVec(this.bossEnemy.moveVector, (180 / 7) * i + 90)),
                            vector: addVec(this.bossEnemy.vector, this.bossEnemy.size / 2),
                            size: 20 * this.generalSize,
                            imgsrc: '/gt/img/char/enemy_plasma.png',
                            damage: 1,
                        })
                    }
                    break
                case 'hardcore':
                    for (let i = 0; i < 3; i++) {
                        this.enemyPlasmas.push({
                            moveVector: norVec(rotVec(this.bossEnemy.moveVector, 90 * (i + 1))),
                            vector: addVec(this.bossEnemy.vector, this.bossEnemy.size / 2),
                            size: 20 * this.generalSize,
                            imgsrc: '/gt/img/char/enemy_plasma.png',
                            damage: 1,
                        })
                    }
                    break
                case 'totalchaos':
                    for (let i = 0; i < 5; i++) {
                        this.enemyPlasmas.push({
                            moveVector: norVec(rotVec(this.bossEnemy.moveVector, (180 / 5) * i + 90)),
                            vector: addVec(this.bossEnemy.vector, this.bossEnemy.size / 2),
                            size: 20 * this.generalSize,
                            imgsrc: '/gt/img/char/enemy_plasma.png',
                            damage: 1,
                        })
                    }
                    break
            }
        },
        bossEnemyAbilityMove() {
            switch (this.bossEnemy.type) {
                case 'normal':
                case 'hardcore':
                    this.bossEnemy.moveVector = dirVec(this.playerInfo.vector, this.bossEnemy.vector)
                    break
                case 'totalchaos':
                    do {
                        this.bossEnemy.vector = [
                            getRandomInt(this.field.borderRight - this.field.borderLeft - this.bossEnemy.size) + this.field.borderLeft,
                            getRandomInt(this.field.borderDown - this.field.borderUp - this.bossEnemy.size) + this.field.borderUp,
                        ] as type.Vector
                    } while (lenVec(subVec(this.bossEnemy.vector, this.playerInfo.vector)) < 250 * this.generalSize)
                    break
            }
        },
        bossEnemyAbilitySpeedUp() {
            this.bossEnemy.speed = 7.5
        },
        bossEnemyAbilityBuffEnemies() {
            for (let enemy of this.enemies) {
                if (!enemy.isGrow) enemy = grow(enemy, 1.5, this.generalSize) as type.Enemy
                enemy.isGrow = true
                enemy.isMagnet = true
            }
        },
        bossAbilitySpawnItems() {
            for (let i = 0; i < 5; i++) this.spawnItems(false)
        },
        handleBossEnemyMovement() {
            this.bossEnemy.moveVector = mulVec(
                norVec(this.bossEnemy.moveVector),
                this.bossEnemy.speed *
                    this.generalSize *
                    percent(this.fleetlvl / 20, 'de') *
                    (this.player.passivTree.passivType.includes('nerfBoss') ? percent(this.passivObject['nerfBoss'] / 2, 'de') : 1)
            )
            this.bossEnemy.vector = addVec(this.bossEnemy.vector, this.bossEnemy.moveVector)
            switch (borderCheck(this.bossEnemy, 'inner', this.field)) {
                case 'left':
                case 'right':
                    this.bossEnemy.moveVector[0] *= -1
                    break
                case 'up':
                case 'down':
                    this.bossEnemy.moveVector[1] *= -1
                    break
            }
        },
        async handleBossEnemyDead() {
            if (this.bossEnemy.hP <= 0) {
                let newWeaponAvaibleType = Object.entries(weaponDetails)
                    .filter(([key, value]) => !value.maxlvl)
                    .flatMap(([key, value]) => key) as type.weaponType[]
                let newPassivAvaibleType = Object.keys(this.passivObject) as type.PassivType[]
                let newPeculiarities = Object.keys(peculiarityDetails) as type.PeculiarityName[]
                let unlock
                this.player.defeatedBosses[this.bossEnemy.type]++
                switch (this.bossEnemy.type) {
                    case 'normal':
                        newWeaponAvaibleType = newWeaponAvaibleType.filter(n => this.player.weaponTree.weaponAvaibleTypes.every(w => n != w))
                        if (newWeaponAvaibleType.length > 0) {
                            unlock = newWeaponAvaibleType[getRandomInt(newWeaponAvaibleType.length - 1)]
                            this.player.weaponTree.weaponAvaibleTypes.push(unlock)
                            this.receiveMessages.push(`you have unlocked the ${unlock}`)
                        }
                        break
                    case 'hardcore':
                        newPassivAvaibleType = newPassivAvaibleType.filter(n => this.player.passivTree.passivAvaibleTypes.every(p => n != p))
                        if (newPassivAvaibleType.length > 0) {
                            unlock = newPassivAvaibleType[getRandomInt(newPassivAvaibleType.length - 1)]
                            this.player.passivTree.passivAvaibleTypes.push(unlock)
                            this.receiveMessages.push(`you have unlocked the ${passivDetails[unlock].name}`)
                        }
                        break
                    case 'totalchaos':
                        newPeculiarities = newPeculiarities.filter(n => this.player.peculiarities.available.every(p => n != p))
                        if (newPeculiarities.length > 0) {
                            unlock = newPeculiarities[getRandomInt(newPeculiarities.length - 1)]
                            this.player.peculiarities.available.push(unlock)
                            this.receiveMessages.push(`you have unlocked the ${peculiarityDetails[unlock].name}`)
                        }
                        break
                }
                this.bossEnemy = {} as type.BossEnemy
                await this.gameOver('You have killed the boss', 'alert alert-success')
                this.startButtonText = 'start'
                this.cancelButtonText = ''
                this.bossFight = false
            }
        },
        //colliosion
        async bossColision() {
            if (this.collisionsCheck(this.bossEnemy, this.playerInfo)) await this.gameOver('you got killed by the boss', 'alert alert-danger')
            for (let plasma of this.plasmas) {
                if (this.collisionsCheck(this.bossEnemy, plasma)) {
                    this.bossEnemy.hP -= plasma.damage
                    this.deletePlasma(plasma)
                }
            }
        },
        async plasmaColision(item?: type.Item | false, enemy?: type.Enemy | false) {
            if (item) {
                for (let plasma of this.plasmas) {
                    this.gravity(item, plasma, 4, 0.5)
                    if (this.collisionsCheck(item, plasma)) this.deletePlasma(plasma)
                }
                return
            }
            if (enemy) {
                for (let plasma of [...this.plasmas]) {
                    if (this.collisionsCheck(enemy, plasma)) {
                        switch (this.player.weaponTree.weaponType) {
                            case 'aimgun':
                            case 'safegun':
                                this.deletePlasma(plasma)
                                break
                        }
                        if (plasma.split) {
                            for (let i = 0; i < 5; i++) {
                                let moveVector = plasma.moveVector
                                this.plasmas.push({
                                    moveVector: rotVec(moveVector, (360 / 5) * i),
                                    vector: plasma.vector,
                                    size: plasma.size,
                                    imgsrc: plasma.imgsrc,
                                    damage: plasma.damage,
                                } as type.Plasma)
                            }
                            this.deletePlasma(plasma)
                        } else {
                            plasma.damage--
                            if (plasma.damage <= 0) this.deletePlasma(plasma)
                        }
                        this.respawnEnemy(enemy)
                        let scoreIncrease =
                            50 *
                            this.scoreMultiplier *
                            (this.player.passivTree.passivType.includes('increaseScore')
                                ? percent(this.passivObject['increaseScore'] / 1.5, 'in')
                                : 1) *
                            percent(this.weaponObject['scorePerHit'], 'in')
                        this.score += scoreIncrease
                        if (!this.bossFight) {
                            this.specialScores.push({
                                vector: enemy.vector,
                                score: scoreIncrease,
                                duration: 1000,
                            })
                        }
                    }
                }
                return
            }
            for (let plasma of this.enemyPlasmas) {
                if (this.collisionsCheck(this.playerInfo, plasma)) {
                    this.handleDamage(1, 'you got killed by plasma')
                    this.deletePlasma(plasma)
                    return
                }
            }
        },
        async handleDamage(dmg: number, deathReason: string) {
            if (this.immunity) return
            if (this.player.peculiarities.selected == 'immunity') {
                this.immunity = true
                setTimeout(() => {
                    this.immunity = false
                }, 1000)
            }
            if (this.shield) {
                this.handleShield()
            } else {
                this.playerInfo.hP -= dmg
                if (this.playerInfo.hP <= 0) {
                    await this.gameOver(deathReason, 'alert alert-danger')
                    return
                }
            }
        },
        handleShield() {
            this.shield--
            setTimeout(() => {
                if (this.shield < this.maxShield) this.shield++
            }, 10000 * percent(this.skillObject['shieldGenerator'] * 5, 'de'))
        },
        blackHoleColision(item: type.Item) {
            this.gravity(item, this.playerInfo, 3, 1 - this.skillObject['friendlierDarkhole'] / 100)
            if (this.collisionsCheck(item, this.playerInfo)) this.touchBlackHole()
            for (let enemy of this.enemies) {
                this.gravity(item, enemy, 3, 1)
                if (this.collisionsCheck(item, enemy)) this.respawnEnemy(enemy)
            }
            for (let item2 of this.items) {
                if (item2.type != 'blackHole') {
                    this.gravity(item, item2, 3, 1 - this.skillObject['friendlierDarkhole'] / 100)
                    if (this.collisionsCheck(item, item2)) this.despawnItem(item2)
                }
            }
            this.plasmaColision(item, false)
        },
        enemyItemColision(item: type.Item) {
            if (item.type == 'growPotion') {
                for (let enemy of this.enemies) {
                    if (this.collisionsCheck(enemy, item)) {
                        if (!enemy.isGrow) {
                            this.despawnItem(item)
                            enemy = grow(enemy, 2, this.generalSize) as type.Enemy
                        }
                        enemy.isGrow = true
                    }
                }
            }
            if (item.type == 'magnet') {
                for (let enemy of this.enemies) {
                    if (this.collisionsCheck(enemy, item)) {
                        if (!enemy.isMagnet) {
                            this.despawnItem(item)
                            enemy.isMagnet = true
                        }
                    }
                }
            }
        },
        async enemyColision() {
            for (let enemy of this.enemies) {
                this.plasmaColision(false, enemy)
                if (this.effects.magnet.active) this.gravity(this.playerInfo, enemy, 2, -0.3 - this.skillObject['strongerMagnet'] / 100)
                if (enemy.isMagnet) this.gravity(enemy, this.playerInfo, 2, 0.7)
                if (this.collisionsCheck(enemy, this.playerInfo)) {
                    this.handleDamage(1, 'you got killed by an enemy')
                    this.respawnEnemy(enemy)
                }
            }
        },
        playerItemColision(item: type.Item) {
            music.itemSound(this.player.settings.effectVolume, item)
            this.items = this.items.filter(i => i != item)
            switch (item.type) {
                case 'coin':
                    this.collectCoin(item)
                    break
                case 'clearField':
                    this.collectClearField()
                    break
                case 'magnet':
                    this.collectMagnet(item)
                    break
                case 'stopTime':
                    this.collectStopTime(item)
                    break
                case 'slowEnemies':
                    this.collectSlowEnemies(item)
                    break
                case 'growPotion':
                    this.collectGrowPotion(item)
                    break
            }
        },
        colisionHandling() {
            if (this.bossFight) this.bossColision()
            this.plasmaColision()
            for (let item of this.items) {
                if (item.type == 'blackHole') this.blackHoleColision(item)
                else if (this.effects.magnet.active) this.gravity(this.playerInfo, item, 2, 1 + this.skillObject['strongerMagnet'] / 100)
                this.enemyItemColision(item)
                if (this.collisionsCheck(item, this.playerInfo)) this.playerItemColision(item)
            }
            this.enemyColision()
        },
        collisionsCheck(
            object1: type.Enemy | type.Item | type.PlayerInfo | type.Plasma | type.BossEnemy,
            object2: type.Enemy | type.Item | type.PlayerInfo | type.Plasma | type.BossEnemy
        ) {
            return (
                lenVecSqrt(subVecVec(addVecNum(object1.vector, object1.size / 2), addVecNum(object2.vector, object2.size / 2))) <
                (object1.size / 2 + object2.size / 2) ** 2
            )
        },
        //items
        spawnItems(badItems: boolean) {
            this.items =
                createItems(
                    this.effects.stopTime.active,
                    this.generalSize,
                    this.player,
                    this.items,
                    this.field,
                    badItems,
                    this.bossFight,
                    this.playerInfo
                ) || this.items
        },
        collectCoin(item: type.Item) {
            let scoreIncrease =
                ((this.scoreMultiplier * 15 * item.size * percent(this.skillObject['betterCoin'], 'in')) / this.generalSize) *
                (this.player.passivTree.passivType.includes('increaseScore') ? percent(this.passivObject['increaseScore'], 'in') / 1.5 : 1)
            this.score += scoreIncrease
            this.specialScores.push({
                vector: item.vector,
                score: scoreIncrease,
                duration: 1000,
            })
        },
        collectGrowPotion(item: type.Item) {
            if (!this.effects.grow.active) this.playerInfo.vector = subVec(this.playerInfo.vector, (this.playerInfo.size * this.generalSize) / 2)
            this.effects.grow = {
                active: true,
                duration: (this.effects.grow.duration +=
                    ((250 * item.size) / this.generalSize) * percent(this.passivObject['longerEffects'] / 3, 'in')),
            }
            if (this.player.peculiarities.selected == 'growPotion') {
                if (this.playerInfo.hP < modelDetails[this.player.ship.selectedModel.rarity].hp + this.weaponObject['moreHP']) {
                    this.playerInfo.hP++
                }
            }
        },
        collectMagnet(item: type.Item) {
            this.effects.magnet = {
                active: true,
                duration: (this.effects.magnet.duration +=
                    ((250 * item.size * percent(this.skillObject['longerMagnet'], 'in')) / this.generalSize) *
                    percent(this.passivObject['longerEffects'] / 3, 'in')),
            }
        },
        collectStopTime(item: type.Item) {
            this.effects.stopTime = {
                active: true,
                duration: (this.effects.stopTime.duration +=
                    ((75 * item.size * percent(this.skillObject['longerStopTime'], 'in')) / this.generalSize) *
                    percent(this.passivObject['longerEffects'] / 3, 'in')),
            }
        },
        collectSlowEnemies(item: type.Item) {
            this.effects.slowEnemies = {
                active: true,
                duration: (this.effects.slowEnemies.duration +=
                    ((250 * item.size * percent(this.skillObject['longerSlowEnemies'], 'in')) / this.generalSize) *
                    percent(this.passivObject['longerEffects'] / 3, 'in')),
            }
        },
        reduceDuartion() {
            for (let specialScore of this.specialScores) specialScore.duration -= 1000 / 60
            this.specialScores = this.specialScores.filter(s => s.duration > 0)
            this.effects.stopTime.active ? (this.effects.stopTime.duration -= 1000 / 60) : (this.effects.stopTime.duration = 0)
            if (this.effects.stopTime.duration <= 0) {
                this.effects.stopTime.active = false
                this.effects.stopTime.duration = 0
            }
            for (let ability of [
                'bombAbility',
                'magnetAbility',
                'slowEnemyAbility',
                'stopTimeAbility',
                'growAbility',
                'shotAbility',
            ] as type.AbilityName[]) {
                this.coolDowns[ability] > 0 ? (this.coolDowns[ability] -= 1000 / 60) : (this.coolDowns[ability] = 0)
                if (this.coolDowns[ability] < 0) this.coolDowns[ability] = 0
            }
            if (this.effects.stopTime.active) return
            for (let effect of Object.values(this.effects)) {
                effect.active ? (effect.duration -= 1000 / 60) : (effect.duration = 0)
                if (effect.active) {
                    if (effect.duration <= 0) {
                        if (this.effects.grow.active) {
                            if (this.effects.grow.duration <= 0) {
                                this.playerInfo.size = this.playerInfo.originalSize * this.generalSize
                                this.playerInfo.vector = addVec(this.playerInfo.vector, this.playerInfo.size / 2)
                            }
                        }
                        effect.duration = 0
                        effect.active = false
                    }
                }
            }
        },
        collectClearField() {
            for (let enemy of [...this.enemies]) this.respawnEnemy(enemy)
        },
        async touchBlackHole() {
            if (this.player.peculiarities.selected == 'darkHole') {
                this.handleDamage(1, 'you got sucked in')
            } else {
                await this.gameOver('you got sucked in', 'alert alert-danger')
            }
        },
        growBlackHole() {
            if (this.effects.stopTime.active) return
            for (let item of this.items) {
                if (item.type == 'blackHole') {
                    item.size += 20 * percent(this.skillObject['smallerBlackHole'], 'de') * this.generalSize
                    item.vector = subVec(item.vector, (20 * percent(this.skillObject['smallerBlackHole'], 'de') * this.generalSize) / 2)
                }
            }
        },
        despawnItems() {
            if (this.effects.stopTime.active) return
            for (let item of this.items) {
                item.timer--
                if (item.timer < 0) this.despawnItem(item)
            }
        },
        despawnItem(item: type.Item) {
            this.items = this.items.filter(i => i != item)
        },
        //Enemy

        handleEnemyMovement() {
            if (!this.enemiesMove) return
            if (this.effects.stopTime.active) return
            this.enemies = enemyMovement(
                this.enemies,
                this.difficulty,
                this.player,
                this.generalSize,
                this.effects.stopTime.active,
                this.field,
                this.skillObject,
                this.playerInfo
            )
        },
        respawnEnemy(enemy: type.Enemy) {
            this.enemies = this.enemies.filter(e => e != enemy)
            this.player.shop.currency += 1 + this.passivObject['moreScrap'] / 50
            if (this.player.shop.currency > maxCurrency) this.player.shop.currency = maxCurrency
            createEnemy(this.enemies, this.generalSize, this.field, this.skillObject, this.playerInfo)
        },

        handleEnemyRandom() {
            if (this.effects.stopTime.active) return
            for (let enemy of this.enemies) {
                if (enemy.type == 'random') {
                    if (enemy.timer % 120 == 0) enemy.moveVector = norVec([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2])
                }
            }
        },

        //playermovement
        handlePlayerMovement() {
            const newPlayer = playerMovement(
                this.player,
                this.pressedKeys,
                this.field,
                this.lastDirection,
                this.generalSize,
                this.multiplicator,
                this.playerInfo
            )
            this.player = newPlayer.player
            this.lastDirection = newPlayer.lastDirection
        },
        handlePlayerAbilities() {
            for (let i = 1 as 1 | 2 | 3 | 4; i < 5; i++) {
                if (!this.player.settings.abilitys[i].name) continue
                if (this.pressedKeys[this.player.settings.abilitys[i].key] && this.skillObject[this.player.settings.abilitys[i].name]) {
                    if (this.player.shop.energyCell.amount < skillDetails[this.player.settings.abilitys[i].name].tier) continue
                    if (this.coolDowns[this.player.settings.abilitys[i].name] > 0) continue
                    switch (this.player.settings.abilitys[i].name) {
                        case 'fastAbility':
                            if (this.player.peculiarities.selected == 'slowSpeed' && this.player.playMode == 'totalchaos') break
                            this.multiplicator *= 2
                            break
                        case 'slowAbility':
                            if (this.player.peculiarities.selected == 'slowSpeed' && this.player.playMode == 'totalchaos') break
                            this.multiplicator *= 0.5
                            break
                        case 'bombAbility':
                            this.bombAbility()
                            break
                        case 'shotAbility':
                            this.shotAbility(true)
                            break
                        case 'magnetAbility':
                            this.magnetAbility()
                            this.player.shop.energyCell.amount -= skillDetails[this.player.settings.abilitys[i].name].tier
                            break
                        case 'growAbility':
                            this.growAbility()
                            this.player.shop.energyCell.amount -= skillDetails[this.player.settings.abilitys[i].name].tier
                            break
                        case 'slowEnemyAbility':
                            this.slowEnemyAbility()
                            this.player.shop.energyCell.amount -= skillDetails[this.player.settings.abilitys[i].name].tier
                            break
                        case 'stopTimeAbility':
                            this.stopTimeAbility()
                            this.player.shop.energyCell.amount -= skillDetails[this.player.settings.abilitys[i].name].tier
                            break
                    }
                }
            }
        },
        magnetAbility() {
            this.coolDowns['magnetAbility'] = 10000
            this.effects.magnet = {
                active: true,
                duration: (this.effects.magnet.duration += 2500 * percent(this.passivObject['longerEffects'] / 3, 'in')),
            }
        },
        growAbility() {
            this.coolDowns['growAbility'] = 10000
            if (!this.effects.grow.active) this.playerInfo.vector = subVec(this.playerInfo.vector, (this.playerInfo.size * this.generalSize) / 2)
            this.effects.grow = {
                active: true,
                duration: (this.effects.slowEnemies.duration += 2500 * percent(this.passivObject['longerEffects'] / 3, 'in')),
            }
        },
        slowEnemyAbility() {
            this.coolDowns['slowEnemyAbility'] = 10000
            this.effects.slowEnemies = {
                active: true,
                duration: (this.effects.slowEnemies.duration += 2500 * percent(this.passivObject['longerEffects'] / 3, 'in')),
            }
        },
        stopTimeAbility() {
            this.coolDowns['stopTimeAbility'] = 10000
            this.effects.stopTime = {
                active: true,
                duration: (this.effects.stopTime.duration += 700 * percent(this.passivObject['longerEffects'] / 3, 'in')),
            }
        },
        bombAbility() {
            let bombs = [...this.items].filter(i => i.type == 'clearField')
            if (!bombs.length) return
            this.coolDowns['bombAbility'] = 1000
            this.player.shop.energyCell.amount -= skillDetails['bombAbility'].tier
            if (bombs.length) {
                bombs.sort((a, b) => {
                    return lenVec(subVec(a.vector, this.playerInfo.vector)) - lenVec(subVec(b.vector, this.playerInfo.vector))
                })
                music.itemSound(this.player.settings.effectVolume, bombs[0])
                this.items = this.items.filter(i => i != bombs[0])
                this.collectClearField()
            }
        },
        shotAbility(pay: boolean) {
            if (this.player.playMode == 'hardcore' && !this.bossFight) return
            if (pay) this.player.shop.energyCell.amount -= skillDetails['shotAbility'].tier
            music.plasmaSound(this.player.settings.effectVolume)
            let weapon = weapons(this.player, this.generalSize, this.lastDirection, this.playerInfo, this.weaponObject, this.passivObject)
            this.coolDowns['shotAbility'] = weapon.shotCoolDownDuration
            for (let p of weapon.plasmas) this.plasmas.push(p)
        },
        handlePlasmaMovement() {
            const newPlasmas = plasmaMovement(
                this.plasmas,
                this.enemyPlasmas,
                this.enemies,
                this.player,
                this.generalSize,
                this.field,
                this.bossEnemy
            )
            this.plasmas = newPlasmas.plasmas
            this.enemyPlasmas = newPlasmas.enemyPlasmas
        },
        deletePlasma(plasma: type.Plasma) {
            this.plasmas = this.plasmas.filter(p => p != plasma)
            this.enemyPlasmas = this.enemyPlasmas.filter(p => p != plasma)
        },
        gravity(
            object1: type.Enemy | type.Item | type.PlayerInfo | type.Plasma,
            object2: type.Enemy | type.Item | type.PlayerInfo | type.Plasma,
            range: number,
            speed: number
        ) {
            if (this.effects.stopTime.active) return
            if (
                lenVecSqrt(subVecVec(addVecNum(object1.vector, object1.size / 2), addVecNum(object2.vector, object2.size / 2))) * this.generalSize <
                ((object1.size + object2.size) * range) ** 2
            ) {
                object2.vector = addVec(object2.vector, mulVec(dirVec(object1.vector, object2.vector), speed * this.generalSize))
            }
        },
        // displaysize
        changeDisplaySize() {
            this.generalSize = (window.innerWidth / 1920 + window.innerHeight / 955) / 2
            this.playerInfo.size = this.playerInfo.originalSize * this.generalSize
            this.middlex = window.innerWidth / 2
            this.field.borderLeft = 0
            this.field.borderUp = 0
            this.field.borderRight = Math.round(window.innerWidth * 0.75)
            this.field.borderDown = Math.round(window.innerHeight * 0.8)
        },
        playerStartPosition() {
            this.playerInfo.vector = [this.field.borderRight / 2, this.field.borderDown / 2]
        },
        changePlayMode(playMode: type.PlayMode) {
            if (playMode != this.player.playMode) {
                this.buttonSound()
                this.player.playMode = playMode
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>

<style lang="scss" scoped>
.noneCursor {
    cursor: none;
}
.game {
    background-image: url(/gt/img/spacefield.png);
    background-repeat: repeat;
    width: 75vw;
    height: 80vh;
    border: 1px solid black;
    background-color: rgb(0, 0, 0);
    z-index: 1;
    position: relative;
    overflow: hidden;
}

// button
.sizeBtn {
    position: relative;
    width: 15vw;
    height: 10vh;
    margin: 1vw;
}
.container .btn {
    position: relative;
    width: 15vw;
    height: 10vh;
    margin: 1vw;
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
.container .btn::before,
.container .btn::after {
    background: #2bd2ff;
    box-shadow: 0 0 5px #2bd2ff, 0 0 15px #2bd2ff, 0 0 30px #2bd2ff, 0 0 60px #2bd2ff;
}
</style>
