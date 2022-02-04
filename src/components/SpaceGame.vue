<template>
    <div class="row" id="scoreCard">
        <div class="col align-self-center">
            <img src="../../public/img/items/coin/coin.gif" alt="coin" />
            Score:
            <span id="scoreSpan">{{ Math.round(score) }}</span>
        </div>
        <div class="col align-self-center">
            Enemies:
            <span id="scoreSpan">{{ enemies.length }}</span>
        </div>
        <div class="col align-self-center">
            difficulty:
            <span id="scoreSpan">{{ difficulty }}</span>
        </div>
        <div class="col align-self-center">
            <img src="../../public/img/items/coin/coin.gif" alt="coin" />
            Highscore:
            <span id="scoreSpan">{{ player.hardcoreMode ? Math.round(player.highscoreHardcore) : Math.round(player.highscore) }}</span>
        </div>
        <div>gps:{{ Math.round(gps) }}</div>
    </div>
    <div class="d-flex justify-content-center">
        <div class="game" :class="{ noneCursor: gameStarted }">
            <div
                :style="{
                    left: player.vector[0] + 'px',
                    top: player.vector[1] + 'px',
                    width: player.size + 'px',
                    height: player.size + 'px',
                }"
                style="position: absolute; border-radius: 50%"
            >
                <img
                    :src="`/gt/img/char/playership_${player.outlook}.png`"
                    alt=""
                    :style="{
                        width: player.size + 'px',
                        height: player.size + 'px',
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
                style="position: absolute; border-radius: 50%"
            >
                <img :src="item.imgsrc" alt="" :style="{ width: item.size + 'px', height: item.size + 'px' }" />
            </div>
            <div v-if="message" id="Message" :class="messageType">
                {{ message }}
            </div>
            <div class="container" v-if="!gameStarted">
                <button class="btn" id="startGameBtn" @click="start()">
                    <a>Starten</a>
                </button>
            </div>
        </div>
    </div>
    <div
        :style="{
            left: 0 + 'px',
            top: borderDown + 5 + 'px',
        }"
        style="position: absolute; z-index: 3"
        class="row col-12"
    >
        <div class="col-2"></div>
        <div class="col-2">
            <div v-if="isMagnet" style="z-index: 3">Magnet:{{ Math.round(magnetDuration) }}</div>
        </div>
        <div class="col-2">
            <div v-if="isGrow" style="z-index: 3">Grow:{{ Math.round(growDuration) }}</div>
        </div>
        <div class="col-2">
            <div v-if="isStopTime" style="z-index: 3">Stop time:{{ Math.round(stopTimeDuration) }}</div>
        </div>
        <div class="col-2">
            <div v-if="isSlowEnemies" style="z-index: 3">Slow enemies:{{ Math.round(slowEnemiesDuration) }}</div>
        </div>
    </div>
    <!-- <div
    class="btn-group"
    role="group"
    aria-label="Basic checkbox toggle button group"
  >
    <input
      type="checkbox"
      class="btn-check"
      id="btncheck1"
      autocomplete="off"
      v-model="hardCoreMode"
    />
    <label class="btn btn-outline-primary shadow-none w-25" for="btncheck1"
      >Hardcore Mode</label
    >
  </div>

  <div class="d-flex flex-column" v-if="!production">
    <button
      @click="enemiesSpawn = !enemiesSpawn"
      class="btn btn-success align-self-center shadow-none p-0"
    >
      Enemies: {{ enemiesSpawn }}
    </button>
    <button
      @click="enemiesMove = !enemiesMove"
      class="btn btn-success align-self-center shadow-none p-0"
    >
      Enemiesmove: {{ enemiesMove }}
    </button>
    <div class="input-group w-25 align-self-center p-0">
      <label class="input-group-text" for="inputGroupSelect01"
        >Enemie Type</label
      >
      <select
        class="form-select p-0"
        id="inputGroupSelect01"
        v-model="enemiesType"
      >
        <option selected value=""></option>
        <option value="curve">curve</option>
        <option value="colorswitch">colorswitch</option>
        <option value="aimbot">aimbot</option>
        <option value="chasebot">chasebot</option>
        <option value="getbigger">getbigger</option>
      </select>
    </div>
    <button
      @click="itemSpawn = !itemSpawn"
      class="btn btn-success align-self-center shadow-none p-0"
    >
      Items: {{ itemSpawn }}
    </button>
    <div>borderUp:{{ borderUp }}</div>
    <div>borderDown:{{ borderDown }}</div>
    <div>borderLeft:{{ borderLeft }}</div>
    <div>borderRight:{{ borderRight }}</div>
    <div>X:{{ x }}</div>
    <div>Y:{{ y }}</div>
    <button
      class="btn btn-success align-self-center shadow-none p-0"
      @click="sizer()"
    >
      sizes
    </button>
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { checkPlayer, player, production } from '@/global'
import * as type from '@/types'
import * as API from '@/API'
export default defineComponent({
    setup() {
        player
        production
    },
    data() {
        return {
            // display
            message: '',
            messageType: '',
            middlex: window.innerWidth / 2,
            generalSize: (window.innerWidth / 1920 + window.innerHeight / 955) / 2,
            production: production.value,
            // debug
            enemiesSpawn: true,
            enemiesMove: true,
            enemiesType: '',
            itemSpawn: true,
            //player
            player: player.value as type.Player,
            isGrow: false,
            isMagnet: false,
            isStopTime: false,
            isSlowEnemies: false,
            growDuration: 0,
            magnetDuration: 0,
            slowEnemiesDuration: 0,
            stopTimeDuration: 0,
            bombCoolDown: false,
            bombCoolDownID: 0,
            bestPlayers: [] as type.Player[],
            // gameSetup
            hardCoreMode: false,
            gameStarted: false,
            startingEnemies: 4,
            borderRight: 0,
            borderLeft: 0,
            borderUp: 0,
            borderDown: 0,
            difficulty: 2,
            score: 0,
            gameloopCounter: 0,
            gameloopLastCounter: 0,
            countgpsID: 0,
            gps: 60,
            items: [] as type.Item[],
            pressedKeys: {} as Record<string, boolean>,
            enemies: [] as type.Enemy[],
        }
    },

    async mounted() {
        // start game if not started on enter press
        document.addEventListener('keyup', e => e.code == 'Enter' && !this.gameStarted && this.start())

        window.addEventListener('resize', () => {
            this.changeDisplaySize()
        })
        setInterval(() => {
            this.gameStarted ? this.gameloop() : null
        }, 1000 / 60)

        this.changeDisplaySize()
        this.playerStartPosition()
        let result = await API.getPlayer()
        if (result) {
            this.player = result.player
        }
        this.player = checkPlayer(this.player) as type.Player
        this.player.size *= this.generalSize
    },
    methods: {
        //game
        gameloop() {
            this.handlePlayerMovement()
            this.handleEnemyMovement()
            if (this.isGrow) {
                this.player.size = this.player.originalSize * 2 * this.generalSize
                this.score +=
                    this.difficulty *
                    this.percent(this.findSkill('scoreMultiplicator'), 'in') *
                    1.2 *
                    this.percent(this.findSkill('betterGrowPotion'), 'in')
            } else {
                this.player.size = this.player.originalSize * this.generalSize
                this.score += this.difficulty * this.percent(this.findSkill('scoreMultiplicator'), 'in')
            }
            this.colisionHandling()
            this.despawnItems()
            this.gameloopCounter++
            if (this.gameloopCounter % 20 == 0) this.handleEnemyGetBigger() // 0.3sek
            if (this.gameloopCounter % 60 == 0) this.growBlackHole() // 1sek
            if (this.gameloopCounter % 120 == 0) this.spawnItems() // 2sek
            if (this.gameloopCounter % 1200 == 0) this.difficulty += 0.5 // 20sek
            if (this.gameloopCounter % (900 * this.percent(this.findSkill('spawnLessEnemy'), 'in')) == 0) this.createEnemy()
            this.reduceDuartion()
            this.handleEnemyRandom()
        },
        countgps() {
            this.countgpsID = setTimeout(() => {
                this.gps = (this.gameloopCounter - this.gameloopLastCounter) * 2
                if (this.gps > 60) this.gps = 60
                this.gameloopLastCounter = this.gameloopCounter
                this.countgps()
            }, 500)
        },
        async start() {
            this.player.hardcoreMode
                ? ((this.startingEnemies = 400), this.player.playedHardcore++)
                : ((this.startingEnemies = 4), this.player.playedGames++)
            await API.addPlayer(this.player)
            this.isGrow = false
            this.isMagnet = false
            this.message = ''
            this.gameloopLastCounter = 0
            this.gameloopCounter = 0
            this.score = 0
            this.difficulty = 2
            this.playerStartPosition()
            this.enemies = [] as type.Enemy[]
            this.items = [] as type.Item[]
            this.gameStarted = true
            window.onkeyup = (e: any) => {
                this.pressedKeys[e.key] = false
            }
            window.onkeydown = (e: any) => {
                this.pressedKeys[e.key] = true
            }
            for (let i = 0; i < this.startingEnemies; i++) this.createEnemy()
            clearTimeout(this.countgpsID)
            this.countgps()
        },
        playerStartPosition() {
            //this.player.vector=this.subVec(this.player.vector,[window.innerWidth / 2,window.innerHeight / 2])
            this.player.vector[0] = window.innerWidth / 2
            // (this.borderRight + this.borderLeft)
            this.player.vector[1] = window.innerHeight / 2
            // this.borderDown - this.borderUp;
        },
        async gameOver(message: string, messageType: string) {
            this.gameStarted = false
            if (this.player.hardcoreMode) {
                if (this.score > this.player.highscoreHardcore) {
                    this.player.highscoreHardcore = this.score
                    this.setSkillPoints()
                }
                await API.addPlayer(this.player)
            } else if (this.score > this.player.highscore) {
                this.player.highscore = this.score
                this.setSkillPoints()
                await API.addPlayer(this.player)
            }
            this.message = message
            this.messageType = messageType
        },
        setSkillPoints() {
            this.player.skillTree.skillPoints = Math.floor(this.player.highscore / 1000) + Math.floor(this.player.highscoreHardcore / 250)
        },
        //colliosion
        colisionHandling() {
            for (let item of this.items) {
                if (item.type == 'blackHole') {
                    this.gravity(item, this.player, 4, 0.5)
                    if (this.collisionsCheck(item, this.player)) {
                        this.touchBlackHole()
                    }
                    for (let enemy of this.enemies) {
                        this.gravity(item, enemy, 4, 0.5)
                        if (this.collisionsCheck(item, enemy)) {
                            this.respawnEnemy(enemy)
                        }
                    }
                    for (let item2 of this.items) {
                        if (item != item2) {
                            if (item2.type != 'blackHole') {
                                this.gravity(item, item2, 4, 0.5)
                                if (this.collisionsCheck(item, item2)) {
                                    this.despawnItem(item2)
                                }
                            }
                        }
                    }
                } else {
                    if (this.isMagnet) {
                        this.gravity(this.player, item, 2, 1)
                    }
                }
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
                if (this.collisionsCheck(item, this.player)) {
                    this.items = this.items.filter(i => i != item)
                    switch (item.type) {
                        case 'coin':
                            this.collectCoin(item)
                            break
                        case 'growPotion':
                            this.collectGrowPotion(item)
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
                    }
                }
            }
            for (let enemy of this.enemies) {
                if (this.isMagnet) {
                    this.gravity(this.player, enemy, 2, -0.3)
                }
                if (enemy.isMagnet) {
                    this.gravity(enemy, this.player, 2, 0.7)
                }
                if (this.collisionsCheck(enemy, this.player)) {
                    this.gameOver('you got killed by an enemy', 'alert alert-danger')
                }
            }
        },
        collisionsCheck(object1: type.Enemy | type.Item | type.Player, object2: type.Enemy | type.Item | type.Player) {
            return (
                this.lenVec(this.subVec(this.addVec(object1.vector, object1.size / 2), this.addVec(object2.vector, object2.size / 2))) <
                object1.size / 2 + object2.size / 2
            )
        },
        //itemEvents
        collectCoin(item: type.Item) {
            this.score += (this.difficulty * 15 * item.size * this.percent(this.findSkill('betterCoin'), 'in')) / this.generalSize
        },
        collectGrowPotion(item: type.Item) {
            if (!this.isGrow) {
                this.player.vector = this.subVec(this.player.vector, this.player.size / 2)
            }
            this.isGrow = true
            this.growDuration += (250 * item.size) / this.generalSize
        },
        collectMagnet(item: type.Item) {
            this.isMagnet = true
            this.magnetDuration += (250 * item.size * this.percent(this.findSkill('longerMagnet'), 'in')) / this.generalSize
        },
        collectStopTime(item: type.Item) {
            this.isStopTime = true
            this.stopTimeDuration += (75 * item.size * this.percent(this.findSkill('longerStopTime'), 'in')) / this.generalSize
        },
        collectSlowEnemies(item: type.Item) {
            this.isSlowEnemies = true
            this.slowEnemiesDuration += (250 * item.size * this.percent(this.findSkill('longerSlowEnemies'), 'in')) / this.generalSize
        },
        reduceDuartion() {
            this.isStopTime ? (this.stopTimeDuration -= 1000 / 60) : (this.stopTimeDuration = 0)
            if (this.stopTimeDuration <= 0) this.isStopTime = false
            if (this.isStopTime) return
            this.isGrow ? (this.growDuration -= 1000 / 60) : (this.growDuration = 0)
            this.isMagnet ? (this.magnetDuration -= 1000 / 60) : (this.magnetDuration = 0)
            this.isSlowEnemies ? (this.slowEnemiesDuration -= 1000 / 60) : (this.slowEnemiesDuration = 0)
            if (this.slowEnemiesDuration <= 0) this.isSlowEnemies = false
            if (this.isGrow) {
                if (this.growDuration <= 0) {
                    this.isGrow = false
                    this.player.vector = this.addVec(this.player.vector, this.player.size / 2)
                }
            }
            if (this.magnetDuration <= 0) this.isMagnet = false
        },
        collectClearField() {
            for (let enemy of [...this.enemies]) {
                this.respawnEnemy(enemy)
            }
        },
        touchBlackHole() {
            this.gameOver('you got sucked in', 'alert alert-danger')
        },
        growBlackHole() {
            if (this.isStopTime) return
            for (let item of this.items) {
                if (item.type == 'blackHole') {
                    item.size += 20 * this.percent(this.findSkill('smallerBlackHole'), 'de') * this.generalSize
                    item.vector = this.subVec(item.vector, [10, 10])
                }
            }
        },
        despawnItems() {
            if (this.isStopTime) return
            for (let item of this.items) {
                item.timer--
                if (item.timer < 0) {
                    this.despawnItem(item)
                }
            }
        },
        despawnItem(item: type.Item) {
            this.items = this.items.filter(i => i != item)
        },
        spawnItems() {
            if (!this.itemSpawn) return
            if (this.isStopTime) return
            let type = ''
            let vector = [0, 0] as type.Vector
            let size = 20 * this.generalSize
            let imgsrc = ''
            vector[0] = this.getRandomInt(this.borderRight - this.borderLeft - 20) + this.borderLeft
            vector[1] = this.getRandomInt(this.borderDown - this.borderUp - 20) + this.borderUp
            if (this.lenVec(this.subVec(vector, this.player.vector)) < 150 * this.generalSize) {
                this.spawnItems()
                return
            }
            switch (this.getRandomInt(7)) {
                case 0:
                    type = 'coin'
                    size = (this.getRandomInt(25) + 20) * this.generalSize
                    imgsrc = '/gt/img/items/coin/coin.gif'
                    break
                case 1:
                    type = 'blackHole'
                    size = 20 * this.percent(this.findSkill('smallerBlackHole'), 'de') * this.generalSize
                    imgsrc = '/gt/img/items/darkhole/darkhole.png'
                    break
                case 2:
                    type = 'growPotion'
                    size = (this.getRandomInt(25) + 20) * this.generalSize
                    imgsrc = '/gt/img/items/potion/potion.gif'
                    break
                case 3:
                    type = 'clearField'
                    imgsrc = '/gt/img/items/bomb/bomb.gif'
                    break
                case 4:
                    type = 'magnet'
                    imgsrc = '/gt/img/items/magnet/magnet.png'
                    size = (this.getRandomInt(25) + 20) * this.generalSize
                    break
                case 5:
                    type = 'slowEnemies'
                    imgsrc = '/gt/img/items/snowflake/snowflake.png'
                    size = (this.getRandomInt(25) + 20) * this.generalSize
                    break
                case 6:
                    type = 'stopTime'
                    imgsrc = '/gt/img/items/clock/clock.png'
                    size = (this.getRandomInt(25) + 20) * this.generalSize
                    break
            }
            this.items.push({
                type: type as type.Itemtype,
                imgsrc: imgsrc,
                vector: vector,
                size: size,
                timer: 450, // 7.5sek
            })
        },

        //Enemy
        createEnemy() {
            if (!this.enemiesSpawn) return
            let size = 0
            let vector = [0, 0] as type.Vector
            let type = ''
            let imgsrc = ''
            let timer = 0
            let moveArray = [0, 0] as type.Vector
            let circleDir = ''
            switch (this.getRandomInt(4)) {
                case 0:
                    imgsrc = '/gt/img/char/enemy_pingu.png'
                    break
                case 1:
                    imgsrc = '/gt/img/char/enemy_cupcake.gif'
                    break
                case 2:
                    imgsrc = '/gt/img/char/enemy_gasman.gif'
                    break
                case 3:
                    imgsrc = '/gt/img/char/enemy_komet.png'
                    break
            }
            switch (this.getRandomInt(3)) {
                case 0:
                    size = 20 * this.generalSize
                    break
                case 1:
                    size = 25 * this.generalSize
                    break
                case 2:
                    size = 30 * this.generalSize
                    break
            }
            switch (this.getRandomInt(4)) {
                case 0:
                    vector[1] = this.borderUp - size
                    moveArray = [(Math.random() - 0.5) * 2, 1]
                    break
                case 1:
                    vector[1] = this.borderDown
                    moveArray = [(Math.random() - 0.5) * 2, -1]
                    break
                case 2:
                    vector[0] = this.borderRight
                    moveArray = [-1, (Math.random() - 0.5) * 2]
                    break
                case 3:
                    vector[0] = this.borderLeft - size
                    moveArray = [1, (Math.random() - 0.5) * 2]
                    break
            }
            moveArray = this.norVec(moveArray)
            if (!vector[0]) {
                vector[0] = this.getRandomInt(this.borderRight - this.borderLeft) + this.borderLeft
            }
            if (!vector[1]) {
                vector[1] = this.getRandomInt(this.borderDown - this.borderUp) + this.borderUp
            }
            switch (this.getRandomInt(7)) {
                case 0:
                    type = 'curve'
                    break
                case 1:
                    type = 'aimbot'
                    break
                case 2:
                    type = 'chasebot'
                    timer = 450
                    break
                case 3:
                    type = 'getbigger'
                    break
                case 4:
                    type = 'circle'
                    break
                case 5:
                    type = 'random'
                    timer = 900
                    break
                case 6:
                    type = 'spiral'
                    timer = 100
                    break
            }
            switch (this.getRandomInt(2)) {
                case 0:
                    circleDir = 'left'
                    break
                case 1:
                    circleDir = 'right'
                    break
            }
            this.player.hardcoreMode ? (type = 'aimbot') : null
            this.enemiesType ? (type = this.enemiesType) : null

            if (type == 'aimbot') {
                moveArray = this.dirVec(this.player.vector, vector)
            }
            this.enemies.push({
                vector: vector,
                size: size,
                id: JSON.stringify(Math.random()),
                type: type as type.EnemyType,
                imgsrc: imgsrc,
                spawnMoveVector: moveArray as type.Vector,
                moveVector: moveArray as type.Vector,
                timer: timer,
                circle: type == 'cicrle' ? false : null,
                circleRadius: Math.random() * 0.03 + 0.01,
                circleDir: circleDir as type.Dir,
                isGrow: false,
                isMagnet: false,
            })
        },

        handleEnemyMovement() {
            if (!this.enemiesMove) return
            if (this.isStopTime) return
            for (let enemy of this.enemies) {
                if (enemy.type == 'spiral') {
                    this.moveSpiralEnemy(enemy)
                }
                if (enemy.type == 'circle') {
                    this.moveCircleEnemy(enemy)
                }
                if (enemy.type == 'curve') {
                    this.moveCurveEnemy(enemy)
                }
                if (enemy.type == 'chasebot') {
                    this.moveChasebotEnemy(enemy)
                } else {
                    enemy.moveVector = this.norVec(enemy.moveVector)
                    enemy.vector = this.addVec(
                        enemy.vector,
                        this.mulVec(
                            enemy.moveVector,
                            this.difficulty * this.percent(this.findSkill('slowEnemy'), 'de') * this.generalSize * (this.isSlowEnemies ? 0.5 : 1)
                        )
                    )
                }
                if (this.borderCheck(enemy, 'outer')) {
                    this.respawnEnemy(enemy)
                }
                if (enemy.type == 'chasebot' || enemy.type == 'random') {
                    enemy.timer ? enemy.timer-- : this.respawnEnemy(enemy)
                }
            }
        },
        moveChasebotEnemy(enemy: type.Enemy) {
            enemy.vector = this.addVec(
                enemy.vector,
                this.mulVec(this.dirVec(this.player.vector, enemy.vector), 2 * this.generalSize * (this.isSlowEnemies ? 0.5 : 1))
            )
        },
        moveCurveEnemy(enemy: type.Enemy) {
            enemy.moveVector[enemy.moveVector.findIndex(v => v != 1)] > 0
                ? (enemy.moveVector[enemy.moveVector.findIndex(v => v != 1)] += 0.02 * Math.random())
                : (enemy.moveVector[enemy.moveVector.findIndex(v => v != 1)] -= 0.02 * Math.random())
        },
        moveSpiralEnemy(enemy: type.Enemy) {
            let acc
            if (enemy.timer > 0) {
                enemy.timer--
            } else {
                acc = this.rotVec(enemy.moveVector, 90)
                acc = this.mulVec(acc, enemy.circleRadius * 2)
                if (enemy.circleDir == 'left') {
                    enemy.moveVector = this.addVec(enemy.moveVector, acc)
                }
                if (enemy.circleDir == 'right') {
                    enemy.moveVector = this.subVec(enemy.moveVector, acc)
                }
                enemy.moveVector = this.norVec(enemy.moveVector)
                enemy.vector = this.addVec(
                    enemy.vector,
                    this.mulVec(
                        enemy.spawnMoveVector,
                        this.difficulty * this.percent(this.findSkill('slowEnemy'), 'de') * this.generalSize * 0.3 * (this.isSlowEnemies ? 0.5 : 1)
                    )
                )
            }
        },
        moveCircleEnemy(enemy: type.Enemy) {
            let acc
            if (enemy.timer > 5000) {
                enemy.timer += 3 * Math.random()
                enemy.moveVector = enemy.spawnMoveVector
            } else {
                enemy.timer += this.getRandomInt(3) + this.difficulty + 2
                if (enemy.timer > 1000) {
                    enemy.circle = true
                }
            }
            if (enemy.circle) {
                acc = this.rotVec(enemy.moveVector, 90)
                acc = this.mulVec(acc, enemy.circleRadius)
                if (enemy.circleDir == 'left') {
                    enemy.moveVector = this.addVec(enemy.moveVector, acc)
                }
                if (enemy.circleDir == 'right') {
                    enemy.moveVector = this.subVec(enemy.moveVector, acc)
                }
            }
        },
        respawnEnemy(enemy: type.Enemy) {
            this.enemies.splice(
                this.enemies.findIndex(e => e == enemy),
                1
            )
            this.createEnemy()
        },
        handleEnemyGetBigger() {
            if (this.isStopTime) return
            for (let enemy of this.enemies) {
                enemy.type == 'getbigger' ? (enemy.size += 0.5) : null
            }
        },
        handleEnemyRandom() {
            if (this.isStopTime) return
            for (let enemy of this.enemies) {
                if (enemy.timer % 120 == 0) {
                    if (enemy.type == 'random') {
                        enemy.moveVector = this.norVec([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2])
                    }
                }
            }
        },

        //playermovement
        bombAbility() {
            if (this.bombCoolDown) return
            this.bombCoolDown = true
            this.bombCoolDownID = setTimeout(() => {
                this.bombCoolDown = false
            }, 1000)
            let bombs = [...this.items].filter(i => i.type == 'clearField')
            if (bombs.length) {
                bombs.sort((a, b) => {
                    return this.lenVec(this.subVec(a.vector, this.player.vector)) - this.lenVec(this.subVec(b.vector, this.player.vector))
                })
                this.items.splice(
                    this.items.findIndex(i => i == bombs[0]),
                    1
                )
                this.collectClearField()
            }
        },
        handlePlayerMovement() {
            let multiplicator = 1
            this.player.moveVector = [0, 0]
            if (this.pressedKeys['3'] && this.findSkill('bombAbility')) this.bombAbility()

            if (this.pressedKeys['1'] && this.findSkill('fastAbility')) multiplicator = 2

            if (this.pressedKeys['2'] && this.findSkill('slowAbility')) multiplicator = 0.5

            if (this.pressedKeys['ArrowLeft'] || this.pressedKeys['a']) {
                this.left(multiplicator)
            }
            if (this.pressedKeys['ArrowRight'] || this.pressedKeys['d']) {
                this.right(multiplicator)
            }
            if (this.pressedKeys['ArrowUp'] || this.pressedKeys['w']) {
                this.up(multiplicator)
            }
            if (this.pressedKeys['ArrowDown'] || this.pressedKeys['s']) {
                this.down(multiplicator)
            }

            this.player.moveVector = this.mulVec(this.norVec(this.player.moveVector), 5)
            this.player.vector = this.addVec(this.player.vector, this.player.moveVector)
            if (this.player.moveVector[0] > 0) {
                this.player.outlook = 'right'
            }
            if (this.player.moveVector[0] < 0) {
                this.player.outlook = 'left'
            }
            if (this.player.moveVector[1] > 0) {
                this.player.outlook = 'down'
            }
            if (this.player.moveVector[1] < 0) {
                this.player.outlook = 'up'
            }

            if (this.player.moveVector[0] > 0 && this.player.moveVector[1] > 0) {
                this.player.outlook = 'downright'
            }
            if (this.player.moveVector[0] < 0 && this.player.moveVector[1] > 0) {
                this.player.outlook = 'downleft'
            }
            if (this.player.moveVector[0] > 0 && this.player.moveVector[1] < 0) {
                this.player.outlook = 'upright'
            }
            if (this.player.moveVector[0] < 0 && this.player.moveVector[1] < 0) {
                this.player.outlook = 'upleft'
            }
            switch (this.borderCheck(this.player, 'inner')) {
                case 'right':
                    this.player.vector[0] = this.borderRight - this.player.size
                    break
                case 'left':
                    this.player.vector[0] = this.borderLeft + 1
                    break
                case 'up':
                    this.player.vector[1] = this.borderUp - 2
                    break
                case 'down':
                    this.player.vector[1] = this.borderDown - (this.player.size + 6)
                    break
            }
        },
        left(multiplicator: number) {
            if (this.player.vector[0] > this.borderLeft) {
                this.player.moveVector[0] = this.player.speed * multiplicator * this.generalSize * -1
            }
        },
        right(multiplicator: number) {
            if (this.player.vector[0] < this.borderRight) {
                if (this.player.moveVector[0] == 0) {
                    this.player.moveVector[0] = this.player.speed * multiplicator * this.generalSize
                } else {
                    this.player.moveVector[0] = 0
                }
            }
        },
        up(multiplicator: number) {
            if (this.player.vector[1] > this.borderUp) {
                this.player.moveVector[1] = this.player.speed * multiplicator * this.generalSize * -1
            }
        },
        down(multiplicator: number) {
            if (this.player.vector[1] < this.borderDown) {
                if (this.player.moveVector[1] == 0) {
                    this.player.moveVector[1] = this.player.speed * multiplicator * this.generalSize
                } else {
                    this.player.moveVector[1] = 0
                }
            }
        },
        borderCheck(object: type.Enemy | type.Item | type.Player, border: 'inner' | 'outer') {
            if (border == 'inner') {
                if (object.vector[0] > this.borderRight - object.size) {
                    return 'right'
                }
                if (object.vector[0] < this.borderLeft + 1) {
                    return 'left'
                }
                if (object.vector[1] < this.borderUp - 2) {
                    return 'up'
                }
                if (object.vector[1] > this.borderDown - (object.size + 6)) {
                    return 'down'
                }
            }
            if (border == 'outer') {
                if (object.vector[0] > this.borderRight) {
                    return 'right'
                }
                if (object.vector[0] < this.borderLeft - 1 - object.size) {
                    return 'left'
                }
                if (object.vector[1] < this.borderUp - 1 - object.size) {
                    return 'up'
                }
                if (object.vector[1] > this.borderDown) {
                    return 'down'
                }
            }
            return false
        },
        gravity(object1: type.Enemy | type.Item | type.Player, object2: type.Enemy | type.Item | type.Player, range: number, speed: number) {
            if (this.isStopTime) return
            if (
                this.lenVec(this.subVec(this.addVec(object1.vector, object1.size / 2), this.addVec(object2.vector, object2.size / 2))) *
                    this.generalSize <
                (object1.size + object2.size) * range
            ) {
                object2.vector = this.addVec(
                    object2.vector,
                    this.mulVec(
                        this.dirVec(object1.vector, object2.vector),
                        speed * (100 / this.lenVec(this.subVec(object1.vector, object2.vector))) * this.generalSize
                    )
                )
            }
        },
        //rnd
        getRandomInt(max: number) {
            return Math.floor(Math.random() * max)
        },
        findSkill(skill: type.Skillname) {
            return this.player.skillTree.skills[this.player.skillTree.skills.findIndex(s => s.name == skill)].lvl
        },
        percent(number: number, change: 'in' | 'de') {
            if (change == 'in') {
                return (number + 100) / 100
            }
            if (change == 'de') {
                return number < 100 ? (100 - number) / 100 : 0
            }
            return 1
        },

        //Vector calculate
        addVec(vec1: type.Vector, vec2: type.Vector | number) {
            if (typeof vec2 == 'number') {
                return [vec1[0] + vec2, vec1[1] + vec2] as type.Vector
            } else {
                return [vec1[0] + vec2[0], vec1[1] + vec2[1]] as type.Vector
            }
        },
        subVec(vec1: type.Vector, vec2: type.Vector | number) {
            if (typeof vec2 == 'number') {
                return [vec1[0] - vec2, vec1[1] - vec2] as type.Vector
            } else {
                return [vec1[0] - vec2[0], vec1[1] - vec2[1]] as type.Vector
            }
        },
        dirVec(vec1: type.Vector, vec2: type.Vector) {
            let deltaArray = this.subVec(vec1, vec2) as type.Vector
            deltaArray = this.divVec(deltaArray, this.lenVec(deltaArray))
            return deltaArray
        },
        mulVec(vec1: type.Vector, vec2: type.Vector | number) {
            if (typeof vec2 == 'number') {
                return [vec1[0] * vec2, vec1[1] * vec2] as type.Vector
            } else {
                return [vec1[0] * vec2[0], vec1[1] * vec2[1]] as type.Vector
            }
        },
        divVec(vec1: type.Vector, vec2: type.Vector | number) {
            if (typeof vec2 == 'number') {
                return [vec1[0] / vec2, vec1[1] / vec2] as type.Vector
            } else {
                return [vec1[0] / vec2[0], vec1[1] / vec2[1]] as type.Vector
            }
        },
        norVec(vec: type.Vector) {
            if (this.lenVec(vec) != 0) {
                return this.divVec(vec, this.lenVec(vec)) as type.Vector
            } else {
                return [0, 0] as type.Vector
            }
        },
        lenVec(vec: type.Vector) {
            return Math.sqrt(vec[0] ** 2 + vec[1] ** 2)
        },
        rotVec(vec: type.Vector, angle: number) {
            let helpVec = [...vec]
            helpVec[0] = vec[0] * Math.cos(angle) - vec[1] * Math.sin(angle)
            helpVec[1] = vec[0] * Math.sin(angle) + vec[1] * Math.cos(angle)
            return helpVec as type.Vector
        },
        // displaysize
        changeDisplaySize() {
            this.generalSize = (window.innerWidth / 1920 + window.innerHeight / 955) / 2
            this.player.size = this.player.originalSize * this.generalSize
            this.middlex = window.innerWidth / 2
            this.borderRight = Math.round(window.innerWidth - (window.innerWidth / 100) * 12.5 - 60)
            this.borderLeft = Math.round((window.innerWidth / 100) * 12.5 + 60)
            this.borderUp = Math.round((window.innerHeight / 100) * 13 + 60)
            this.borderDown = Math.round((window.innerHeight / 100) * 93 - 61)
        },
    },
})
</script>

<style lang="scss" scoped>
* {
    color: red;
}
.noneCursor {
    cursor: none;
}
.game {
    background-image: url(/gt/img/spacefield.png);
    background-repeat: repeat;
    // widht=1280px
    width: 75vw;
    height: 80vh;
    border: 60px solid black;
    background-color: rgb(0, 0, 0);
    z-index: 1;
}
#scoreCard {
    font-weight: 1000;
    height: 5vh;
    position: relative;
    z-index: 1;
    padding: 0 !important;
    margin: 0 !important;
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
</style>
