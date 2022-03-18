<template>
    <div v-if="dataLoad" style="color: red">
        <div class="row g-0" style="height: 5vh; position: relative">
            <div v-if="!bossEnemy.type" class="col-2 text-end">
                <img src="../../public/img/items/coin/coin.gif" alt="coin" />
                Score: {{ Math.round(score) }}
            </div>
            <div v-else class="col-3"></div>
            <div v-if="!bossEnemy.type" class="col-1">
                + {{ (scorePerTick * 60).toFixed(0) }}/s
                <img src="../../public/img/items/coin/coin.gif" alt="coin" />
            </div>
            <div class="col-2">
                Enemies:{{ enemies.length }}{{ !bossFight ? `+(${((spawnEnemyTimer - (gameloopCounter % spawnEnemyTimer)) / 60).toFixed(1)}s)` : '' }}
            </div>
            <div class="col-3">
                difficulty:{{ difficulty }}{{ !bossFight ? `+(${((difficultyTimer - (gameloopCounter % difficultyTimer)) / 60).toFixed(1)}s)` : '' }}
            </div>

            <div class="col-1">gps:{{ Math.round(gps) }}</div>
            <div v-if="!bossEnemy.type" class="col-3">
                <img src="../../public/img/items/coin/coin.gif" alt="coin" />
                Highscore:
                <span id="scoreSpan" v-if="player.playMode == 'normal'">{{ Math.round(player.highscore) }}</span>
                <span id="scoreSpan" v-if="player.playMode == 'hardcore'">{{ Math.round(player.highscoreHardcore) }}</span>
                <span id="scoreSpan" v-if="player.playMode == 'totalchaos'">{{ Math.round(player.highscoreTotalchaos) }}</span>
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
                    <div class="mt-4" :style="{ color: magnetDuration > 0 ? 'green' : 'red' }">
                        Magnet:
                        <br />
                        {{ (magnetDuration / 1000).toFixed(1) }}
                    </div>
                    <div class="mt-4" :style="{ color: growDuration > 0 ? 'green' : 'red' }">
                        Grow:
                        <br />
                        {{ (growDuration / 1000).toFixed(1) }}
                    </div>
                    <div class="mt-4" :style="{ color: slowEnemiesDuration > 0 ? 'green' : 'red' }">
                        Slow enemies:
                        <br />
                        {{ (slowEnemiesDuration / 1000).toFixed(1) }}
                    </div>
                    <div class="mt-4" :style="{ color: stopTimeDuration > 0 ? 'green' : 'red' }">
                        Stop time:
                        <br />
                        {{ (stopTimeDuration / 1000).toFixed(1) }}
                    </div>
                </div>
                <div class="game" :class="{ noneCursor: gameStarted }">
                    <div
                        :style="{
                            left: player.vector[0] + 'px',
                            top: player.vector[1] + 'px',
                            width: player.size + 'px',
                            height: player.size + 'px',
                            transform: `rotate(${lastDirection}deg)`,
                        }"
                        style="position: absolute"
                    >
                        <img
                            :src="`/gt/img/char/playership.png`"
                            alt=""
                            :style="{
                                width: player.size + 'px',
                                height: player.size + 'px',
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
                    <div v-if="unlockMessage" :class="messageType">
                        {{ unlockMessage }}
                    </div>
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
                        <button class="btn shadow-none" @keydown.enter.prevent @click="startBossFight('totalchaos')" v-if="!cancelButtonText">
                            <a>{{ bossAvailable('totalchaos') }}</a>
                        </button>
                    </div>
                </div>
                <div class="col-1">
                    <div>cooldowns</div>
                    <div
                        class="mt-4"
                        v-for="ability of player.settings.abilitys"
                        :key="JSON.stringify(ability)"
                        :style="{ color: coolDowns[ability.name] > 0 ? 'red' : 'green' }"
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
                <div v-for="hp of player.hP" :key="hp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { addVec, dirVec, lenVec, lenVecSqrt, mulVec, norVec, rotVec, subVec, addVecNum, subVecVec } from '@/game/vectors'
import { checkPlayer, production, skillDetails, weaponAmount, passivAmount } from '@/global'
import { borderCheck, findPassivUpgrade, findSkill, getRandomInt, percent, roundHalf, grow, findWeaponUpgrade } from '@/game/helpers'
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

        return {
            findSkill,
            skillDetails,
            weaponAmount,
            passivAmount,
            percent,
            findPassivUpgrade,
        }
    },
    data() {
        return {
            // display
            dataLoad: false,
            user: currentUser,
            message: '',
            unlockMessage: '',
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
            player: {} as type.Player,
            isGrow: false,
            isMagnet: false,
            isStopTime: false,
            isSlowEnemies: false,
            growDuration: 0,
            magnetDuration: 0,
            slowEnemiesDuration: 0,
            stopTimeDuration: 0,
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
            multiplicator: 1,
            shield: 0,
            // boss
            bossEnemy: {} as type.BossEnemy,
            enemyPlasmas: [] as type.Plasma[],
            highscoreMultiplier: 25000,
            highscoreTotalchaosMultiplier: 25000,
            highscoreHardcoreMultiplier: 2500,
            // gameSetup
            hardCoreMode: false,
            gameStarted: false,
            spawnBadItems: true,
            startingEnemies: 4,
            difficulty: 2,
            score: 0,
            scorePerTick: 0,
            difficultyTimer: 1200,
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
        fleetlvl() {
            let lvl = 0
            for (let member of this.fleetMembers) {
                lvl += member.defeatedBosses
                lvl += member.defeatedBossesHardcore
                lvl += member.defeatedBossesTotalchaos
            }
            if (lvl > 50) lvl = 50
            return lvl
        },
        spawnEnemyTimer() {
            let timer = Math.round(
                900 *
                    percent(this.skillObject['spawnLessEnemy'], 'in') *
                    (this.player.passivTree.passivType == 'nerfEnemies' ? percent(findPassivUpgrade(this.player, 'nerfEnemies') / 4, 'in') : 1)
            )
            return timer
        },
    },
    async mounted() {
        // start game if not started on enter press
        document.addEventListener('keyup', e => e.code == 'Enter' && !this.gameStarted && this.start())
        window.addEventListener('resize', () => {
            this.changeDisplaySize()
        })
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
                if (this.player.spaceFleet) await this.loadFleet()
            } catch {
                API.logout()
            }
        }
        this.player = checkPlayer(this.player) as type.Player
        music.changeVolume(this.player.settings.musicVolume)
        this.player.size *= this.generalSize
        this.playerStartPosition()
        this.bossFight = false
        this.buttonSound()
        this.tip = tips(getRandomInt(this.tipsNumber))
        this.skillObject = this.player.skillTree.skills.reduce((a, v) => ({ ...a, [v.name]: v.lvl }), {}) as type.SkillObject
        this.dataLoad = true
    },
    methods: {
        async loadFleet() {
            this.fleetMembers = []
            let result
            if (this.player.spaceFleet) {
                this.fleet = await API.getPlayerSpaceFleet(this.player.spaceFleet)
                if (!this.fleet || !this.fleet.members.includes(this.user!.uid)) {
                    this.player.spaceFleet = ''
                    this.fleet = {
                        members: [] as string[],
                        founder: '',
                        img: '',
                        name: '',
                        info: '',
                        public: false,
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
            if (!this.isStopTime) this.gameloopCounter2++
            this.gameloopCounter++
            if (this.bossFight) {
                this.handleBossEnemyMovement()
                if (this.gameloopCounter % 90 == 0) {
                    this.bossEnemyAbilitys()
                }
            } else {
                if (this.gameloopCounter % this.difficultyTimer == 0) this.difficulty += 0.5 // 20sek
                if (this.gameloopCounter % this.spawnEnemyTimer == 0)
                    createEnemy(this.enemies, this.generalSize, this.field, this.player, this.skillObject)
            }
            if ((this.player.playMode == 'totalchaos' && !this.bossFight) || this.bossEnemy.type == 'totalchaos') {
                if (this.gameloopCounter % 60 == 0) this.handleTotalchaos()
            }
            if (this.gameloopCounter2 % 20 == 0) this.handleEnemyGetBigger() // 0.3sek
            if (this.gameloopCounter2 % 60 == 0) this.growBlackHole() // 1sek
            if (this.player.passivTree.passivType == 'moreItems') {
                if (this.gameloopCounter2 % Math.round(120 * percent(findPassivUpgrade(this.player, 'moreItems'), 'de')) == 0) {
                    this.spawnItems(this.spawnBadItems) // 2sek
                    this.spawnBadItems = !this.spawnBadItems
                }
            } else {
                if (this.gameloopCounter2 % 120 == 0) this.spawnItems(true) // 2sek
            }
            this.handlePlayerMovement()
            this.handlePlasmaMovement()
            this.handleEnemyMovement()
            this.reduceDuartion()
            this.handleEnemyRandom()
            await this.handleBossEnemyDead()
        },
        start() {
            if (this.gameStarted) return
            this.buttonSound()
            this.player.hP = 1 + findWeaponUpgrade(this.player, 'moreHP')
            if (this.bossFight) {
                this.bossEnemyPreparations()
            } else {
                switch (this.player.playMode) {
                    case 'normal':
                        this.startingEnemies = 4
                        this.player.playedGames++
                        break
                    case 'hardcore':
                        this.startingEnemies = 50
                        this.player.playedHardcore++
                        break
                    case 'totalchaos':
                        this.startingEnemies = 4
                        this.player.playedTotalchaos++
                        break
                }
                this.difficulty = 2
            }
            this.player.speed = 5
            this.reset()
            this.gameloopLastCounter = 0
            this.gameloopCounter = 0
            this.score = 0
            this.playerStartPosition()
            this.enemies = [] as type.Enemy[]
            this.items = [] as type.Item[]
            this.plasmas = [] as type.Plasma[]
            this.enemyPlasmas = [] as type.Plasma[]
            this.message = ''
            this.unlockMessage = ''
            this.startButtonText = 'start'
            this.cancelButtonText = ''
            this.gameStarted = true
            window.onkeyup = (e: any) => {
                this.pressedKeys[e.key] = false
            }
            window.onkeydown = (e: any) => {
                this.pressedKeys[e.key] = true
            }
            for (let i = 0; i < this.startingEnemies; i++) createEnemy(this.enemies, this.generalSize, this.field, this.player, this.skillObject)
            if (this.skillObject['shieldGenerator']) this.shield++
            clearTimeout(this.countgpsID)
            this.countgps()
        },
        reset() {
            this.isGrow = false
            this.isMagnet = false
            this.isStopTime = false
            this.isSlowEnemies = false
            this.spawnBadItems = true
            this.growDuration = 0
            this.magnetDuration = 0
            this.stopTimeDuration = 0
            this.slowEnemiesDuration = 0
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
            this.player.speed = 5
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
                    this.player.speed *= 0.5
                    break
                case 1:
                    this.player.speed *= 2
                    break
            }
        },
        chaosEffect() {
            switch (getRandomInt(4)) {
                case 0:
                    this.magnetDuration = 1000
                    this.isMagnet = true
                    break
                case 1:
                    this.growDuration = 1000
                    this.isGrow = true
                    break
                case 2:
                    this.slowEnemiesDuration = 1000
                    this.isSlowEnemies = true
                    break
                case 3:
                    this.stopTimeDuration = 1000
                    this.isStopTime = true
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
            if (this.isGrow) {
                this.player.size = this.player.originalSize * 2 * this.generalSize
                this.score +=
                    this.difficulty *
                    percent(this.skillObject['scoreMultiplicator'], 'in') *
                    1.2 *
                    percent(this.skillObject['betterGrowPotion'], 'in') *
                    (this.player.passivTree.passivType == 'increaseScore' ? percent(findPassivUpgrade(this.player, 'increaseScore') / 1.5, 'in') : 1)
            } else {
                this.player.size = this.player.originalSize * this.generalSize
                this.score +=
                    this.difficulty *
                    percent(this.skillObject['scoreMultiplicator'], 'in') *
                    (this.player.passivTree.passivType == 'increaseScore' ? percent(findPassivUpgrade(this.player, 'increaseScore') / 1.5, 'in') : 1)
            }
            let effectAmount = 0
            if (this.isGrow) effectAmount++
            if (this.isMagnet) effectAmount++
            if (this.isSlowEnemies) effectAmount++
            if (this.isStopTime) effectAmount++
            this.score += this.skillObject['scorePerEffect'] * effectAmount * 0.2
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
            this.gameStarted = false
            this.tip = tips(getRandomInt(this.tipsNumber))
            this.reset()
            this.message = message
            this.messageType = messageType
            if (this.bossFight) {
                this.score = 0
                this.startButtonText = 'try again'
                this.cancelButtonText = 'cancel'
            }
            switch (this.player.playMode) {
                case 'normal':
                    if (this.score > this.player.highscore) this.player.highscore = this.score
                    break
                case 'hardcore':
                    if (this.score > this.player.highscoreHardcore) this.player.highscoreHardcore = this.score
                    break
                case 'totalchaos':
                    if (this.score > this.player.highscoreTotalchaos) this.player.highscoreTotalchaos = this.score
                    break
            }
            this.setSkillPoints()
            try {
                await API.addPlayer(this.player)
            } catch {
                API.logout()
            }
        },
        setSkillPoints() {
            this.player.skillTree.skillPoints = Math.floor(this.player.highscore / 1000)
            this.player.weaponTree.weaponPoints = Math.floor(this.player.highscoreHardcore / 500)
            this.player.passivTree.passivPoints = Math.floor(this.player.highscoreTotalchaos / 2000)
        },
        // boss
        bossAvailable(type: type.BossType) {
            if (!findSkill(this.player, 'shotAbility')) return `skill ${skillDetails['shotAbility'].name}`
            if (!Object.values(this.player.settings.abilitys).some(a => a.name == 'shotAbility')) return `select ${skillDetails['shotAbility'].name}`
            switch (type) {
                case 'normal':
                    if (this.bossEnemy.type == 'normal') return 'cancel'
                    if (this.player.highscore >= this.highscoreMultiplier * (this.player.defeatedBosses + 1) * percent(this.fleetlvl, 'de'))
                        return 'Boss fight available'
                    else return `You need ${this.highscoreMultiplier * (this.player.defeatedBosses + 1) * percent(this.fleetlvl, 'de')} highscore`
                case 'hardcore':
                    if (this.bossEnemy.type == 'hardcore') return 'cancel'
                    if (
                        this.player.highscoreHardcore >=
                        this.highscoreHardcoreMultiplier * (this.player.defeatedBossesHardcore + 1) * percent(this.fleetlvl, 'de')
                    )
                        return 'Boss fight available'
                    else
                        return `You need ${
                            this.highscoreHardcoreMultiplier * (this.player.defeatedBossesHardcore + 1) * percent(this.fleetlvl, 'de')
                        } highscore`
                case 'totalchaos':
                    if (this.bossEnemy.type == 'totalchaos') return 'cancel'
                    if (
                        this.player.highscoreTotalchaos >=
                        this.highscoreTotalchaosMultiplier * (this.player.defeatedBossesTotalchaos + 1) * percent(this.fleetlvl, 'de')
                    )
                        return 'Boss fight available'
                    else
                        return `You need ${
                            this.highscoreTotalchaosMultiplier * (this.player.defeatedBossesTotalchaos + 1) * percent(this.fleetlvl, 'de')
                        } highscore`
            }
        },
        startBossFight(type: type.BossType) {
            if (this.bossEnemy.type == type) {
                this.cancel()
                return
            }
            if (!this.skillObject['shotAbility']) {
                this.$router.push('/skillTree')
                this.buttonSound()
                return
            }
            switch (type) {
                case 'normal':
                    if (this.player.highscore < this.highscoreMultiplier * (this.player.defeatedBosses + 1) * percent(this.fleetlvl, 'de')) return
                    break
                case 'hardcore':
                    if (
                        this.player.highscoreHardcore <
                        this.highscoreHardcoreMultiplier * (this.player.defeatedBossesHardcore + 1) * percent(this.fleetlvl, 'de')
                    )
                        return
                    break
                case 'totalchaos':
                    if (
                        this.player.highscoreTotalchaos <
                        this.highscoreTotalchaosMultiplier * (this.player.defeatedBossesTotalchaos + 1) * percent(this.fleetlvl, 'de')
                    )
                        return
                    break
            }
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
                    this.bossEnemy.maxHP = Math.round(
                        50 *
                            (this.player.defeatedBosses + 1) *
                            percent(this.player.defeatedBosses + 1 * 10, 'in') *
                            (this.player.passivTree.passivType == 'nerfBoss' ? percent(findPassivUpgrade(this.player, 'nerfBoss') / 2, 'de') : 1)
                    )
                    this.startingEnemies = Math.round(4 + this.player.defeatedBosses * percent(this.fleetlvl, 'de'))
                    this.difficulty = roundHalf(2 + this.player.defeatedBosses * percent(this.fleetlvl, 'de'))
                    break
                case 'hardcore':
                    this.bossEnemy.maxHP = Math.round(
                        25 *
                            (this.player.defeatedBossesHardcore + 1) *
                            percent(this.player.defeatedBossesHardcore + 1 * 10, 'in') *
                            (this.player.passivTree.passivType == 'nerfBoss' ? percent(findPassivUpgrade(this.player, 'nerfBoss') / 2, 'de') : 1)
                    )
                    this.startingEnemies = Math.round(50 + this.player.defeatedBossesHardcore * percent(this.fleetlvl, 'de'))
                    this.difficulty = roundHalf(2 * percent(this.fleetlvl, 'de'))
                    break
                case 'totalchaos':
                    this.bossEnemy.maxHP = Math.round(
                        50 *
                            (this.player.defeatedBossesTotalchaos + 1) *
                            percent(this.player.defeatedBossesTotalchaos + 1 * 10, 'in') *
                            (this.player.passivTree.passivType == 'nerfBoss' ? percent(findPassivUpgrade(this.player, 'nerfBoss') / 2, 'de') : 1)
                    )
                    this.startingEnemies = Math.round(4 + this.player.defeatedBossesTotalchaos * percent(this.fleetlvl, 'de'))
                    this.difficulty = roundHalf(2 + this.player.defeatedBossesTotalchaos * percent(this.fleetlvl, 'de'))
            }
            this.bossEnemy.hP = this.bossEnemy.maxHP
            this.bossEnemy.speed = 5
            do {
                this.bossEnemy.vector = [
                    getRandomInt(this.field.borderRight - this.field.borderLeft - this.bossEnemy.size) + this.field.borderLeft,
                    getRandomInt(this.field.borderDown - this.field.borderUp - this.bossEnemy.size) + this.field.borderUp,
                ] as type.Vector
            } while (lenVec(subVec(this.bossEnemy.vector, this.player.vector)) < 250 * this.generalSize)
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
                    for (let i = 0; i < 3; i++) {
                        this.enemyPlasmas.push({
                            moveVector: norVec(rotVec(this.bossEnemy.moveVector, 90 * (i + 1))),
                            vector: addVec(this.bossEnemy.vector, this.bossEnemy.size / 2),
                            size: 20 * this.generalSize,
                            imgsrc: '/gt/img/char/plasma.png',
                            damage: 1,
                        })
                    }
                    break
                case 'hardcore':
                    for (let i = 0; i < 5; i++) {
                        this.enemyPlasmas.push({
                            moveVector: norVec(rotVec(this.bossEnemy.moveVector, (180 / 5) * i + 90)),
                            vector: addVec(this.bossEnemy.vector, this.bossEnemy.size / 2),
                            size: 20 * this.generalSize,
                            imgsrc: '/gt/img/char/plasma.png',
                            damage: 1,
                        })
                    }
                    break
                case 'totalchaos':
                    for (let i = 0; i < 7; i++) {
                        this.enemyPlasmas.push({
                            moveVector: norVec(rotVec(this.bossEnemy.moveVector, (180 / 7) * i + 90)),
                            vector: addVec(this.bossEnemy.vector, this.bossEnemy.size / 2),
                            size: 20 * this.generalSize,
                            imgsrc: '/gt/img/char/plasma.png',
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
                    this.bossEnemy.moveVector = dirVec(this.player.vector, this.bossEnemy.vector)
                    break
                case 'totalchaos':
                    do {
                        this.bossEnemy.vector = [
                            getRandomInt(this.field.borderRight - this.field.borderLeft - this.bossEnemy.size) + this.field.borderLeft,
                            getRandomInt(this.field.borderDown - this.field.borderUp - this.bossEnemy.size) + this.field.borderUp,
                        ] as type.Vector
                    } while (lenVec(subVec(this.bossEnemy.vector, this.player.vector)) < 250 * this.generalSize)
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
                    (this.player.passivTree.passivType == 'nerfBoss' ? percent(findPassivUpgrade(this.player, 'nerfBoss') / 2, 'de') : 1)
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
                let newWeaponAvaibleType = ['standard', 'shotgun', 'MG', 'aimgun', 'splitgun', 'safegun'] as type.weaponType[]
                let newPassivAvaibleType = ['increaseScore', 'increaseGun', 'nerfEnemies', 'moreItems', 'nerfBoss'] as type.PassivType[]
                let unlock
                switch (this.bossEnemy.type) {
                    case 'normal':
                        this.player.defeatedBosses++
                        newWeaponAvaibleType = newWeaponAvaibleType.filter(n => this.player.weaponTree.weaponAvaibleTypes.every(w => n != w))
                        if (newWeaponAvaibleType.length > 0) {
                            unlock = newWeaponAvaibleType[getRandomInt(newWeaponAvaibleType.length - 1)]
                            this.player.weaponTree.weaponAvaibleTypes.push(unlock)
                            this.unlockMessage = `you have unlocked the ${unlock}`
                        }

                        break
                    case 'hardcore':
                        this.player.defeatedBossesHardcore++
                        newPassivAvaibleType = newPassivAvaibleType.filter(n => this.player.passivTree.passivAvaibleTypes.every(p => n != p))
                        if (newPassivAvaibleType.length > 0) {
                            unlock = newPassivAvaibleType[getRandomInt(newPassivAvaibleType.length - 1)]
                            this.player.passivTree.passivAvaibleTypes.push(unlock)
                            this.unlockMessage = `you have unlocked ${unlock}`
                        }

                        break
                    case 'totalchaos':
                        this.player.defeatedBossesTotalchaos++
                        this.unlockMessage = `the maximum level of your skills is increased`
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
            if (this.collisionsCheck(this.bossEnemy, this.player)) await this.gameOver('you got killed by the boss', 'alert alert-danger')
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
                            this.difficulty *
                            (this.player.passivTree.passivType == 'increaseScore'
                                ? percent(findPassivUpgrade(this.player, 'increaseScore') / 1.5, 'in')
                                : 1)
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
                if (this.collisionsCheck(this.player, plasma)) {
                    if (this.shield) {
                        this.shield--
                        setTimeout(() => this.shield++, 6000 * percent(this.skillObject['shieldGenerator'] * 10, 'de'))
                    } else {
                        this.player.hP--
                        if (this.player.hP <= 0) {
                            await this.gameOver('you got killed by plasma', 'alert alert-danger')
                            return
                        }
                    }
                    this.deletePlasma(plasma)
                    return
                }
            }
        },
        blackHoleColision(item: type.Item) {
            this.gravity(item, this.player, 3, 1 - this.skillObject['friendlierDarkhole'] / 100)
            if (this.collisionsCheck(item, this.player)) this.touchBlackHole()
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
                if (this.isMagnet) this.gravity(this.player, enemy, 2, -0.3 - this.skillObject['strongerMagnet'] / 100)
                if (enemy.isMagnet) this.gravity(enemy, this.player, 2, 0.7)
                if (this.collisionsCheck(enemy, this.player)) {
                    if (this.shield) {
                        this.shield--
                        setTimeout(() => this.shield++, 6000 * percent(this.skillObject['shieldGenerator'] * 10, 'de'))
                    } else {
                        this.player.hP--
                        if (this.player.hP <= 0) {
                            await this.gameOver('you got killed by an enemy', 'alert alert-danger')
                            return
                        }
                    }
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
                else if (this.isMagnet) this.gravity(this.player, item, 2, 1 + this.skillObject['strongerMagnet'] / 100)
                this.enemyItemColision(item)
                if (this.collisionsCheck(item, this.player)) this.playerItemColision(item)
            }
            this.enemyColision()
        },
        collisionsCheck(
            object1: type.Enemy | type.Item | type.Player | type.Plasma | type.BossEnemy,
            object2: type.Enemy | type.Item | type.Player | type.Plasma | type.BossEnemy
        ) {
            return (
                lenVecSqrt(subVecVec(addVecNum(object1.vector, object1.size / 2), addVecNum(object2.vector, object2.size / 2))) <
                (object1.size / 2 + object2.size / 2) ** 2
            )
        },
        //items
        spawnItems(badItems: boolean) {
            this.items = createItems(this.isStopTime, this.generalSize, this.player, this.items, this.field, badItems, this.bossFight) || this.items
        },
        collectCoin(item: type.Item) {
            let scoreIncrease =
                ((this.difficulty * 15 * item.size * percent(this.skillObject['betterCoin'], 'in')) / this.generalSize) *
                (this.player.passivTree.passivType == 'increaseScore' ? percent(findPassivUpgrade(this.player, 'increaseScore'), 'in') / 1.5 : 1)
            this.score += scoreIncrease
            this.specialScores.push({
                vector: item.vector,
                score: scoreIncrease,
                duration: 1000,
            })
        },
        collectGrowPotion(item: type.Item) {
            if (!this.isGrow) this.player.vector = subVec(this.player.vector, (this.player.size * this.generalSize) / 2)
            this.isGrow = true
            this.growDuration += (250 * item.size) / this.generalSize
        },
        collectMagnet(item: type.Item) {
            this.isMagnet = true
            this.magnetDuration += (250 * item.size * percent(this.skillObject['longerMagnet'], 'in')) / this.generalSize
        },
        collectStopTime(item: type.Item) {
            this.isStopTime = true
            this.stopTimeDuration += (75 * item.size * percent(this.skillObject['longerStopTime'], 'in')) / this.generalSize
        },
        collectSlowEnemies(item: type.Item) {
            this.isSlowEnemies = true
            this.slowEnemiesDuration += (250 * item.size * percent(this.skillObject['longerSlowEnemies'], 'in')) / this.generalSize
        },
        reduceDuartion() {
            for (let specialScore of this.specialScores) specialScore.duration -= 1000 / 60
            this.specialScores = this.specialScores.filter(s => s.duration > 0)
            this.isStopTime ? (this.stopTimeDuration -= 1000 / 60) : (this.stopTimeDuration = 0)
            if (this.stopTimeDuration <= 0) {
                this.isStopTime = false
                this.stopTimeDuration = 0
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

            if (this.isStopTime) return
            this.isGrow ? (this.growDuration -= 1000 / 60) : (this.growDuration = 0)

            if (this.isGrow) {
                if (this.growDuration <= 0) {
                    this.growDuration = 0
                    this.isGrow = false
                    this.player.size = this.player.originalSize * this.generalSize
                    this.player.vector = addVec(this.player.vector, this.player.size / 2)
                }
            }
            this.isMagnet ? (this.magnetDuration -= 1000 / 60) : (this.magnetDuration = 0)
            if (this.magnetDuration <= 0) {
                this.isMagnet = false
                this.magnetDuration = 0
            }
            this.isSlowEnemies ? (this.slowEnemiesDuration -= 1000 / 60) : (this.slowEnemiesDuration = 0)
            if (this.slowEnemiesDuration <= 0) {
                this.isSlowEnemies = false
                this.slowEnemiesDuration = 0
            }
        },
        collectClearField() {
            for (let enemy of [...this.enemies]) this.respawnEnemy(enemy)
        },
        async touchBlackHole() {
            await this.gameOver('you got sucked in', 'alert alert-danger')
        },
        growBlackHole() {
            if (this.isStopTime) return
            for (let item of this.items) {
                if (item.type == 'blackHole') {
                    item.size += 20 * percent(this.skillObject['smallerBlackHole'], 'de') * this.generalSize
                    item.vector = subVec(item.vector, (20 * percent(this.skillObject['smallerBlackHole'], 'de') * this.generalSize) / 2)
                }
            }
        },
        despawnItems() {
            if (this.isStopTime) return
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
            if (this.isStopTime) return
            this.enemies = enemyMovement(
                this.enemies,
                this.difficulty,
                this.player,
                this.generalSize,
                this.isSlowEnemies,
                this.field,
                this.skillObject
            )
        },

        respawnEnemy(enemy: type.Enemy) {
            this.enemies = this.enemies.filter(e => e != enemy)
            createEnemy(this.enemies, this.generalSize, this.field, this.player, this.skillObject)
        },
        handleEnemyGetBigger() {
            if (this.isStopTime) return
            for (let enemy of this.enemies) if (enemy.type == 'getbigger') enemy.size += 0.5
        },
        handleEnemyRandom() {
            if (this.isStopTime) return
            for (let enemy of this.enemies) {
                if (enemy.type == 'random') {
                    if (enemy.timer % 120 == 0) enemy.moveVector = norVec([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2])
                }
            }
        },

        //playermovement
        handleShield() {
            if (!this.shield) this.shield++
        },
        handlePlayerMovement() {
            const newPlayer = playerMovement(this.player, this.pressedKeys, this.field, this.lastDirection, this.generalSize, this.multiplicator)
            this.player = newPlayer.player
            this.lastDirection = newPlayer.lastDirection
        },
        handlePlayerAbilities() {
            for (let i = 1 as 1 | 2 | 3 | 4; i < 5; i++) {
                if (!this.player.settings.abilitys[i].name) break
                if (this.pressedKeys[this.player.settings.abilitys[i].key] && this.skillObject[this.player.settings.abilitys[i].name]) {
                    switch (this.player.settings.abilitys[i].name) {
                        case 'fastAbility':
                            this.multiplicator *= 2
                            break
                        case 'slowAbility':
                            this.multiplicator *= 0.5
                            break
                        case 'bombAbility':
                            this.bombAbility()
                            break
                        case 'shotAbility':
                            this.shotAbility()
                            break
                        case 'magnetAbility':
                            this.magnetAbility()
                            break
                        case 'growAbility':
                            this.growAbility()
                            break
                        case 'slowEnemyAbility':
                            this.slowEnemyAbility()
                            break
                        case 'stopTimeAbility':
                            this.stopTimeAbility()
                            break
                    }
                }
            }
        },
        magnetAbility() {
            if (this.coolDowns['magnetAbility'] > 0) return
            this.coolDowns['magnetAbility'] = 10000
            this.isMagnet = true
            this.magnetDuration += 2500
        },
        growAbility() {
            if (this.coolDowns['growAbility'] > 0) return
            if (!this.isGrow) this.player.vector = subVec(this.player.vector, (this.player.size * this.generalSize) / 2)
            this.coolDowns['growAbility'] = 10000
            this.isGrow = true
            this.growDuration += 2500
        },
        slowEnemyAbility() {
            if (this.coolDowns['slowEnemyAbility'] > 0) return
            this.coolDowns['slowEnemyAbility'] = 10000
            this.isSlowEnemies = true
            this.slowEnemiesDuration += 2500
        },
        stopTimeAbility() {
            if (this.coolDowns['stopTimeAbility'] > 0) return
            this.coolDowns['stopTimeAbility'] = 10000
            this.isStopTime = true
            this.stopTimeDuration += 700
        },
        bombAbility() {
            if (this.coolDowns['bombAbility'] > 0) return
            let bombs = [...this.items].filter(i => i.type == 'clearField')
            if (!bombs.length) return
            this.coolDowns['bombAbility'] = 1000
            if (bombs.length) {
                bombs.sort((a, b) => {
                    return lenVec(subVec(a.vector, this.player.vector)) - lenVec(subVec(b.vector, this.player.vector))
                })
                music.itemSound(this.player.settings.effectVolume, bombs[0])
                this.items = this.items.filter(i => i != bombs[0])
                this.collectClearField()
            }
        },
        shotAbility() {
            if (this.coolDowns['shotAbility'] > 0) return
            if (this.player.playMode == 'hardcore' && !this.bossFight) return
            music.plasmaSound(this.player.settings.effectVolume)
            let weapon = weapons(this.player, this.generalSize, this.lastDirection)
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
            object1: type.Enemy | type.Item | type.Player | type.Plasma,
            object2: type.Enemy | type.Item | type.Player | type.Plasma,
            range: number,
            speed: number
        ) {
            if (this.isStopTime) return
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
            this.player.size = this.player.originalSize * this.generalSize
            this.middlex = window.innerWidth / 2
            this.field.borderLeft = 0
            this.field.borderUp = 0
            this.field.borderRight = Math.round(window.innerWidth * 0.75)
            this.field.borderDown = Math.round(window.innerHeight * 0.8)
        },
        playerStartPosition() {
            this.player.vector = [this.field.borderRight / 2, this.field.borderDown / 2]
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
