<template>
    <div v-if="dataLoad" style="color: red">
        <div class="row g-0" style="height: 5vh; position: relative">
            <div v-if="!bossEnemy.type" class="col-3 align-self-center">
                <img src="../../public/img/items/coin/coin.gif" alt="coin" />
                Score: {{ Math.round(score) }}
            </div>
            <div v-else class="col-3"></div>
            <div class="col-2 align-self-center">Enemies:{{ enemies.length }}</div>
            <div class="col-2 align-self-center">difficulty:{{ difficulty }}</div>
            <div class="col-2 align-self-center">gps:{{ Math.round(gps) }}</div>
            <div v-if="!bossEnemy.type" class="col-3 align-self-center">
                <img src="../../public/img/items/coin/coin.gif" alt="coin" />
                Highscore:
                <span id="scoreSpan" v-if="player.playMode == 'normal'">{{ Math.round(player.highscore) }}</span>
                <span id="scoreSpan" v-if="player.playMode == 'hardcore'">{{ Math.round(player.highscoreHardcore) }}</span>
                <span id="scoreSpan" v-if="player.playMode == 'totalchaos'">{{ Math.round(player.highscoreTotalchaos) }}</span>
            </div>
            <div v-else class="col-3"></div>
            <div v-if="bossFight && !bossEnemy.size">Boss Fight</div>
            <div v-if="bossEnemy.size">Boss HP:{{ Math.ceil(bossEnemy.hP) }}</div>
            <div v-else>{{ player.playMode }}</div>
        </div>
        <div class="d-flex justify-content-center">
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
                    :key="plasma"
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
                    :key="plasma"
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
                    :class="item.type"
                    v-for="item of items"
                    :key="item"
                    :style="{
                        left: item.vector[0] + 'px',
                        top: item.vector[1] + 'px',
                        backgroundColor: item.imgsrc,
                    }"
                    style="position: absolute"
                >
                    <img :src="item.imgsrc" alt="" :style="{ width: item.size + 'px', height: item.size + 'px' }" />
                </div>
                <div v-if="message" :class="messageType">
                    {{ message }}
                </div>
                <div class="container" v-if="!gameStarted">
                    <button class="btn shadow-none" @click="start()">
                        <a>{{ startButtonText }}</a>
                    </button>
                    <button v-if="cancelButtonText" class="btn shadow-none" @click="cancel()">
                        <a>{{ cancelButtonText }}</a>
                    </button>
                    <br />
                    <button class="btn shadow-none" @keydown.enter.prevent @click="player.playMode = 'normal'" v-if="!cancelButtonText">
                        <a>
                            normal:
                            <br />
                            {{ player.playMode == 'normal' ? 'ON' : 'OFF' }}
                        </a>
                    </button>
                    <button class="btn shadow-none" @keydown.enter.prevent @click="player.playMode = 'hardcore'" v-if="!cancelButtonText">
                        <a>
                            hardcore:
                            <br />
                            {{ player.playMode == 'hardcore' ? 'ON' : 'OFF' }}
                        </a>
                    </button>
                    <button class="btn shadow-none" @keydown.enter.prevent @click="player.playMode = 'totalchaos'" v-if="!cancelButtonText">
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
                        v-if="player.weaponTree.weaponAvaibleTypes.length < 5 && !cancelButtonText"
                    >
                        <a>{{ findSkill(player, 'shotAbility') ? bossAvailable('normal') : `skill ${skillDetails['shotAbility'].name}` }}</a>
                    </button>
                    <div v-else class="d- inline-block sizeBtn"></div>
                    <button
                        class="btn shadow-none"
                        @keydown.enter.prevent
                        @click="startBossFight('hardcore')"
                        v-if="player.passivTree.passivAvaibleTypes.length < 4 && !cancelButtonText"
                    >
                        <a>{{ findSkill(player, 'shotAbility') ? bossAvailable('hardcore') : `skill ${skillDetails['shotAbility'].name}` }}</a>
                    </button>
                    <div v-else class="d-inline-block sizeBtn"></div>
                    <button class="btn shadow-none" @keydown.enter.prevent @click="startBossFight('totalchaos')" v-if="!cancelButtonText">
                        <a>{{ findSkill(player, 'shotAbility') ? bossAvailable('totalchaos') : `skill ${skillDetails['shotAbility'].name}` }}</a>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="!user && !gameStarted">Log in to use all features.</div>
        <div
            :style="{
                left: 11 + '%',
                top: 95 + '%',
            }"
            style="position: absolute; z-index: 3"
            class="row col-10"
        >
            <div class="col-2">
                <div v-if="isMagnet" style="z-index: 3">
                    Magnet:
                    <br />
                    {{ Math.round(magnetDuration) }}
                </div>
            </div>
            <div class="col-2">
                <div v-if="isGrow" style="z-index: 3">
                    Grow:
                    <br />
                    {{ Math.round(growDuration) }}
                </div>
            </div>
            <div class="col-2">
                <div v-if="isSlowEnemies" style="z-index: 3">
                    Slow enemies:
                    <br />
                    {{ Math.round(slowEnemiesDuration) }}
                </div>
            </div>
            <div class="col-2">
                <div v-if="isStopTime" style="z-index: 3">
                    Stop time:
                    <br />
                    {{ Math.round(stopTimeDuration) }}
                </div>
            </div>
            <div class="col-2">
                <div v-if="shotCoolDown" style="z-index: 3">
                    Shot:
                    <br />
                    {{ Math.round(shotCoolDownDuration) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { addVec, dirVec, lenVec, mulVec, norVec, rotVec, subVec } from '@/game/vectors'
import { checkPlayer, production, bossFight, skillDetails } from '@/global'
import { borderCheck, findPassivUpgrade, findSkill, getRandomInt, percent, roundHalf } from '@/game/helpers'
import { weapons } from '@/game/weapons'
import { plasmaMovement, playerMovement, enemyMovement } from '@/game/movement'
import { createEnemy, createItems } from '@/game/createStuff'

import { currentUser } from '@/router'
import * as type from '@/types'
import * as API from '@/API'

export default defineComponent({
    setup() {
        production
        bossFight
        currentUser
        skillDetails
        return {
            findSkill,
            skillDetails,
        }
    },
    data() {
        return {
            // display
            dataLoad: false,
            user: currentUser,
            message: '',
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
            bombCoolDown: false,
            bombCoolDownDuration: 0,
            shotCoolDown: false,
            shotCoolDownDuration: 0,
            bossFight: bossFight,
            lastDirection: 0,
            plasmas: [] as type.Plasma[],
            // boss
            bossEnemy: {} as type.BossEnemy,
            enemyPlasmas: [] as type.Plasma[],
            highscoreMultiplier: 25000,
            highscoreTotalchaosMultiplier: 25000,
            highscoreHardcoreMultiplier: 2500,
            // gameSetup
            hardCoreMode: false,
            gameStarted: false,
            startingEnemies: 4,
            difficulty: 2,
            score: 0,
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
            fleet: {
                members: [] as string[],
                founder: '',
                img: '',
                name: '',
                info: '',
                public: false,
            } as type.SpaceFleet,
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
        this.player.size *= this.generalSize
        this.playerStartPosition()
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
            this.handlePlayerMovement()
            this.handlePlayerAbilities()
            this.handlePlasmaMovement()
            this.handleEnemyMovement()
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
                if (this.gameloopCounter % 1200 == 0) this.difficulty += 0.5 // 20sek
                if (
                    this.gameloopCounter %
                        (900 *
                            Math.round(
                                percent(findSkill(this.player, 'spawnLessEnemy'), 'in') *
                                    (this.player.passivTree.passivType == 'nerfEnemies'
                                        ? percent(findPassivUpgrade(this.player, 'nerfEnemies') / 4, 'in')
                                        : 1)
                            )) ==
                    0
                )
                    createEnemy(this.enemies, this.generalSize, this.field, this.player)
            }
            if ((this.player.playMode == 'totalchaos' && !this.bossFight) || this.bossEnemy.type == 'totalchaos') {
                if (this.gameloopCounter % 60 == 0) this.handleTotalchaos()
            }
            if (this.gameloopCounter2 % 20 == 0) this.handleEnemyGetBigger() // 0.3sek
            if (this.gameloopCounter2 % 60 == 0) this.growBlackHole() // 1sek
            if (this.player.passivTree.passivType == 'moreItems') {
                if (this.gameloopCounter2 % Math.round(240 * percent(findPassivUpgrade(this.player, 'moreItems'), 'de')) == 0) {
                    this.spawnItems(true) // 4sek
                    this.spawnItems(false) // 4sek
                }
            } else {
                if (this.gameloopCounter2 % 120 == 0) this.spawnItems(true) // 2sek
            }

            this.reduceDuartion()
            this.handleEnemyRandom()
            await this.handleBossEnemyDead()
        },
        start() {
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
            this.isGrow = false
            this.isMagnet = false
            this.isStopTime = false
            this.isSlowEnemies = false
            this.bombCoolDown = false
            this.shotCoolDown = false
            this.growDuration = 0
            this.magnetDuration = 0
            this.stopTimeDuration = 0
            this.slowEnemiesDuration = 0
            this.bombCoolDownDuration = 0
            this.shotCoolDownDuration = 0
            this.gameloopLastCounter = 0
            this.gameloopCounter = 0
            this.score = 0
            this.playerStartPosition()
            this.enemies = [] as type.Enemy[]
            this.items = [] as type.Item[]
            this.plasmas = [] as type.Plasma[]
            this.enemyPlasmas = [] as type.Plasma[]
            this.message = ''
            this.startButtonText = 'start'
            this.cancelButtonText = ''
            this.gameStarted = true
            window.onkeyup = (e: any) => {
                this.pressedKeys[e.key] = false
            }
            window.onkeydown = (e: any) => {
                this.pressedKeys[e.key] = true
            }
            for (let i = 0; i < this.startingEnemies; i++) createEnemy(this.enemies, this.generalSize, this.field, this.player)
            clearTimeout(this.countgpsID)
            this.countgps()
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
            for (let i = 0; i < 5; i++) {
                this.spawnItems(true)
            }
        },
        chaosPlayerSpeed() {
            switch (getRandomInt(2)) {
                case 0:
                    this.player.speed = 2.5
                    break
                case 1:
                    this.player.speed = 10
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
                        if (!enemy.isGrow) enemy.size *= 1.5
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
            if (this.isGrow) {
                this.player.size = this.player.originalSize * 2 * this.generalSize
                this.score +=
                    this.difficulty *
                    percent(findSkill(this.player, 'scoreMultiplicator'), 'in') *
                    1.2 *
                    percent(findSkill(this.player, 'betterGrowPotion'), 'in') *
                    (this.player.passivTree.passivType == 'increaseScore' ? percent(findPassivUpgrade(this.player, 'increaseScore') / 1.5, 'in') : 1)
            } else {
                this.player.size = this.player.originalSize * this.generalSize
                this.score +=
                    this.difficulty *
                    percent(findSkill(this.player, 'scoreMultiplicator'), 'in') *
                    (this.player.passivTree.passivType == 'increaseScore' ? percent(findPassivUpgrade(this.player, 'increaseScore') / 1.5, 'in') : 1)
            }
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
            this.bossEnemy = {} as type.BossEnemy
            this.bossFight = false
            this.startButtonText = 'start'
            this.cancelButtonText = ''
            this.message = ''
        },
        async gameOver(message: string, messageType: string) {
            this.gameStarted = false
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
            if (!findSkill(this.player, 'shotAbility')) {
                this.$router.push('/skillTree')
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
                    this.startingEnemies = Math.round(75 + this.player.defeatedBossesHardcore * percent(this.fleetlvl, 'de'))
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
                            this.bossAbilityEnemyRespawn()
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
                if (!enemy.isGrow) enemy.size *= 1.5
                enemy.isGrow = true
                enemy.isMagnet = true
            }
        },
        bossAbilityEnemyRespawn() {
            for (let enemy of [...this.enemies]) this.respawnEnemy(enemy)
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
                this.bossFight = false
                this.startButtonText = 'start'
                this.cancelButtonText = ''
                let newWeaponAvaibleType = ['standard', 'shotgun', 'MG', 'aimgun', 'splitgun', 'safegun'] as type.weaponType[]
                let newPassivAvaibleType = ['increaseScore', 'increaseGun', 'nerfEnemies', 'moreItems', 'nerfBoss'] as type.PassivType[]
                switch (this.bossEnemy.type) {
                    case 'normal':
                        this.player.defeatedBosses++
                        newWeaponAvaibleType = newWeaponAvaibleType.filter(n => this.player.weaponTree.weaponAvaibleTypes.every(w => n != w))
                        if (newWeaponAvaibleType.length > 0)
                            this.player.weaponTree.weaponAvaibleTypes.push(newWeaponAvaibleType[getRandomInt(newWeaponAvaibleType.length - 1)])
                        break
                    case 'hardcore':
                        this.player.defeatedBossesHardcore++
                        newPassivAvaibleType = newPassivAvaibleType.filter(n => this.player.passivTree.passivAvaibleTypes.every(p => n != p))
                        if (newPassivAvaibleType.length > 0)
                            this.player.passivTree.passivAvaibleTypes.push(newPassivAvaibleType[getRandomInt(newPassivAvaibleType.length - 1)])
                        break
                    case 'totalchaos':
                        this.player.defeatedBossesTotalchaos++
                        break
                }
                this.bossEnemy = {} as type.BossEnemy
                await this.gameOver('You have killed the boss', 'alert alert-success')
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
            for (let plasma of this.enemyPlasmas) {
                if (this.collisionsCheck(this.player, plasma)) {
                    await this.gameOver('you got killed by plasma', 'alert alert-danger')
                    return
                }
            }
            if (item) {
                for (let plasma of this.plasmas) {
                    this.gravity(item, plasma, 4, 0.5)
                    if (this.collisionsCheck(item, plasma)) this.deletePlasma(plasma)
                }
            }
            if (enemy) {
                for (let plasma of this.plasmas) {
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
                        this.score +=
                            50 *
                            this.difficulty *
                            (this.player.passivTree.passivType == 'increaseScore'
                                ? percent(findPassivUpgrade(this.player, 'increaseScore') / 1.5, 'in')
                                : 1)
                    }
                }
            }
        },
        blackHoleColision(item: type.Item) {
            this.gravity(item, this.player, 3, 1)
            if (this.collisionsCheck(item, this.player)) this.touchBlackHole()
            for (let enemy of this.enemies) {
                this.gravity(item, enemy, 3, 1)
                if (this.collisionsCheck(item, enemy)) this.respawnEnemy(enemy)
            }
            for (let item2 of this.items) {
                if (item != item2) {
                    if (item2.type != 'blackHole') {
                        this.gravity(item, item2, 3, 1)
                        if (this.collisionsCheck(item, item2)) this.despawnItem(item2)
                    }
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
                            enemy.size *= 2
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
                if (this.isMagnet) this.gravity(this.player, enemy, 2, -0.3)
                if (enemy.isMagnet) this.gravity(enemy, this.player, 2, 0.7)
                if (this.collisionsCheck(enemy, this.player)) await this.gameOver('you got killed by an enemy', 'alert alert-danger')
            }
        },
        playerItemColision(item: type.Item) {
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
                else if (this.isMagnet) this.gravity(this.player, item, 2, 1)
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
                lenVec(subVec(addVec(object1.vector, object1.size / 2), addVec(object2.vector, object2.size / 2))) <
                object1.size / 2 + object2.size / 2
            )
        },
        //items
        spawnItems(badItems: boolean) {
            this.items = createItems(this.isStopTime, this.generalSize, this.player, this.items, this.field, badItems) || this.items
        },
        collectCoin(item: type.Item) {
            this.score +=
                ((this.difficulty * 15 * item.size * percent(findSkill(this.player, 'betterCoin'), 'in')) / this.generalSize) *
                (this.player.passivTree.passivType == 'increaseScore' ? percent(findPassivUpgrade(this.player, 'increaseScore'), 'in') / 2 : 1)
        },
        collectGrowPotion(item: type.Item) {
            if (!this.isGrow) {
                this.player.vector = subVec(this.player.vector, (this.player.size * this.generalSize) / 2)
            }
            this.isGrow = true
            this.growDuration += (250 * item.size) / this.generalSize
        },
        collectMagnet(item: type.Item) {
            this.isMagnet = true
            this.magnetDuration += (250 * item.size * percent(findSkill(this.player, 'longerMagnet'), 'in')) / this.generalSize
        },
        collectStopTime(item: type.Item) {
            this.isStopTime = true
            this.stopTimeDuration += (75 * item.size * percent(findSkill(this.player, 'longerStopTime'), 'in')) / this.generalSize
        },
        collectSlowEnemies(item: type.Item) {
            this.isSlowEnemies = true
            this.slowEnemiesDuration += (250 * item.size * percent(findSkill(this.player, 'longerSlowEnemies'), 'in')) / this.generalSize
        },
        reduceDuartion() {
            this.isStopTime ? (this.stopTimeDuration -= 1000 / 60) : (this.stopTimeDuration = 0)
            if (this.stopTimeDuration <= 0) this.isStopTime = false
            this.shotCoolDown ? (this.shotCoolDownDuration -= 1000 / 60) : (this.shotCoolDownDuration = 0)
            if (this.shotCoolDownDuration <= 0) this.shotCoolDown = false
            if (this.isStopTime) return
            this.isGrow ? (this.growDuration -= 1000 / 60) : (this.growDuration = 0)
            if (this.isGrow) {
                if (this.growDuration <= 0) {
                    this.isGrow = false
                    this.player.size = this.player.originalSize * this.generalSize
                    this.player.vector = addVec(this.player.vector, this.player.size / 2)
                }
            }
            this.isMagnet ? (this.magnetDuration -= 1000 / 60) : (this.magnetDuration = 0)
            if (this.magnetDuration <= 0) this.isMagnet = false
            this.isSlowEnemies ? (this.slowEnemiesDuration -= 1000 / 60) : (this.slowEnemiesDuration = 0)
            if (this.slowEnemiesDuration <= 0) this.isSlowEnemies = false
            this.bombCoolDown ? (this.bombCoolDownDuration -= 1000 / 60) : (this.bombCoolDownDuration = 0)
            if (this.bombCoolDownDuration <= 0) this.bombCoolDown = false
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
                    item.size += 20 * percent(findSkill(this.player, 'smallerBlackHole'), 'de') * this.generalSize
                    item.vector = subVec(item.vector, (20 * percent(findSkill(this.player, 'smallerBlackHole'), 'de') * this.generalSize) / 2)
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
            this.enemies = enemyMovement(this.enemies, this.difficulty, this.player, this.generalSize, this.isSlowEnemies, this.field)
        },

        respawnEnemy(enemy: type.Enemy) {
            this.enemies = this.enemies.filter(e => e != enemy)
            createEnemy(this.enemies, this.generalSize, this.field, this.player)
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
        handlePlayerMovement() {
            const newPlayer = playerMovement(this.player, this.pressedKeys, this.field, this.lastDirection, this.generalSize)
            this.player = newPlayer.player
            this.lastDirection = newPlayer.lastDirection
        },
        handlePlayerAbilities() {
            if (this.pressedKeys['3'] && findSkill(this.player, 'bombAbility')) this.bombAbility()
            if (this.pressedKeys['4'] && findSkill(this.player, 'shotAbility')) this.shotAbility()
        },
        bombAbility() {
            if (this.bombCoolDown) return
            this.bombCoolDown = true
            this.bombCoolDownDuration = 1000
            let bombs = [...this.items].filter(i => i.type == 'clearField')
            if (bombs.length) {
                bombs.sort((a, b) => {
                    return lenVec(subVec(a.vector, this.player.vector)) - lenVec(subVec(b.vector, this.player.vector))
                })
                this.items = this.items.filter(i => i != bombs[0])
                this.collectClearField()
            }
        },
        shotAbility() {
            if (this.shotCoolDown) return
            if (this.player.playMode == 'hardcore' && !this.bossFight) return
            this.shotCoolDown = true
            let weapon = weapons(this.player, this.generalSize, this.lastDirection)
            this.shotCoolDownDuration = weapon.shotCoolDownDuration
            for (let p of weapon.plasmas) this.plasmas.push(p)
        },
        handlePlasmaMovement() {
            const newPlasmas = plasmaMovement(this.plasmas, this.enemyPlasmas, this.enemies, this.player, this.generalSize, this.field)
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
                lenVec(subVec(addVec(object1.vector, object1.size / 2), addVec(object2.vector, object2.size / 2))) * this.generalSize <
                (object1.size + object2.size) * range
            ) {
                object2.vector = addVec(
                    object2.vector,
                    mulVec(dirVec(object1.vector, object2.vector), speed * (100 / lenVec(subVec(object1.vector, object2.vector))) * this.generalSize)
                )
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
