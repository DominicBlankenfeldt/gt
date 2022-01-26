<template>
  <div class="row" id="scoreCard">
    <div class="col align-self-center">
      <img src="../../public/img/items/coin/coin.gif" alt="coin" />
      Score: <span id="scoreSpan">{{ Math.round(score) }}</span>
    </div>
    <div class="col align-self-center">
      Enemies: <span id="scoreSpan">{{ enemies.length }}</span>
    </div>
    <div class="col align-self-center">
      difficulty: <span id="scoreSpan">{{ difficulty }}</span>
    </div>
    <div class="col align-self-center">
      <img src="../../public/img/items/coin/coin.gif" alt="coin" />
      Highscore:
      <span id="scoreSpan">{{
        player.hardcoreMode
          ? Math.round(player.highscoreHardcore)
          : Math.round(player.highscore)
      }}</span>
    </div>
    <div>gps:{{ Math.round(gps) }}</div>
  </div>
  <div class="d-flex justify-content-center">
    <div class="game">
      <div
        :style="{
          left: player.vector[0] + 'px',
          top: player.vector[1] + 'px',
          width: player.size + 'px',
          height: player.size + 'px',
        }"
        style="position: absolute; background-color: red; border-radius: 50%"
      ></div>
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
        <img
          :src="item.imgsrc"
          alt=""
          :style="{ width: item.size + 'px', height: item.size + 'px' }"
        />
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
import { defineComponent } from "vue";
import { player, production } from "@/global";
import * as type from "@/types";
import * as API from "@/API";
export default defineComponent({
  setup() {
    player;
    production;
  },
  data() {
    return {
      // display
      message: "",
      messageType: "",
      production: production.value,
      // debug
      enemiesSpawn: true,
      enemiesMove: true,
      enemiesType: "",
      itemSpawn: true,
      //player
      player: player.value as type.Player,
      isGrow: false,
      isMagnet: false,
      bombCoolDown: false,
      bombCoolDownID: 0,
      bestPlayers: [] as type.Player[],
      // gameSetup
      hardCoreMode: false,
      growPotionID: 0,
      magnetID: 0,
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
    };
  },

  async mounted() {
    // start game if not started on enter press
    document.addEventListener(
      "keyup",
      (e) => e.code == "Enter" && !this.gameStarted && this.start()
    );

    window.addEventListener("resize", () => {
      this.changeDisplaySize();
    });
    setInterval(() => {
      this.gameStarted ? this.gameloop() : null;
    }, 1000 / 60);

    this.changeDisplaySize();
    this.playerStartPosition();
    let result = await API.getPlayer();
    if (result) {
      this.player = result.player;
    }
  },
  methods: {
    //game
    gameloop() {
      this.handlePlayerMovement();
      this.handleEnemyMovement();
      if (this.isGrow) {
        this.player.size = 40;
        this.score +=
          this.difficulty *
          this.percent(this.findSkill("scoreMultiplicator"), "in") *
          1.2 *
          this.percent(this.findSkill("betterGrowPotion"), "in");
      } else {
        this.player.size = 20;
        this.score +=
          this.difficulty *
          this.percent(this.findSkill("scoreMultiplicator"), "in");
      }
      this.colisionHandling();
      this.despawnItems();
      this.gameloopCounter++;
      //this.gameloopCounter % 60 == 0 ? this.handleEnemyColorSwitch() : null; // 1sek
      this.gameloopCounter % 20 == 0 ? this.handleEnemyGetBigger() : null; // 0.3sek
      this.gameloopCounter % 60 == 0 ? this.growBlackHole() : null; // 1sek
      this.gameloopCounter % 120 == 0 ? this.spawnItems() : null; // 2sek
      this.gameloopCounter % 1200 == 0 ? (this.difficulty += 0.5) : null; // 20sek
      this.gameloopCounter % (900 + 3 * this.findSkill("spawnLessEnemy")) == 0
        ? this.createEnemy()
        : null;
    },
    countgps() {
      this.countgpsID = setTimeout(() => {
        this.gps = (this.gameloopCounter - this.gameloopLastCounter) * 2;
        this.gameloopLastCounter = this.gameloopCounter;
        this.countgps();
      }, 500);
    },
    start() {
      this.player.hardcoreMode
        ? ((this.startingEnemies = 400),
          (this.player.playedHardcore = this.player.playedHardcore + 1),
          API.addPlayer(this.player))
        : ((this.startingEnemies = 4),
          (this.player.playedGames = this.player.playedGames + 1),
          API.addPlayer(this.player));
      this.isGrow = false;
      this.isMagnet = false;
      this.message = "";
      this.gameloopLastCounter = 0;
      this.gameloopCounter = 0;
      this.score = 0;
      this.difficulty = 2;
      this.playerStartPosition();
      this.enemies = [] as type.Enemy[];
      this.items = [] as type.Item[];
      this.gameStarted = true;
      window.onkeyup = (e: any) => {
        this.pressedKeys[e.key] = false;
      };
      window.onkeydown = (e: any) => {
        this.pressedKeys[e.key] = true;
      };
      for (let i = 0; i < this.startingEnemies; i++) this.createEnemy();
      clearTimeout(this.countgpsID);
      this.countgps();
    },
    playerStartPosition() {
      //this.player.vector=this.subVec(this.player.vector,[window.innerWidth / 2,window.innerHeight / 2])
      this.player.vector[0] = window.innerWidth / 2;
      // (this.borderRight + this.borderLeft)
      this.player.vector[1] = window.innerHeight / 2;
      // this.borderDown - this.borderUp;
    },
    async gameOver(message: string, messageType: string) {
      this.gameStarted = false;
      if (this.player.hardcoreMode) {
        if (this.score > this.player.highscoreHardcore) {
          this.player.highscoreHardcore = this.score;
        }
        API.addPlayer(this.player);
      } else if (this.score > this.player.highscore) {
        this.player.highscore = this.score;
        this.player.skillTree.skillPoints = Math.floor(
          this.player.highscore / 1000
        );
        API.addPlayer(this.player);
      }
      this.message = message;
      this.messageType = messageType;
    },
    //colliosion
    colisionHandling() {
      for (let item of this.items) {
        if (item.type == "blackHole") {
          this.gravity(item, this.player, 4, 0.5);
          for (let enemy of this.enemies) {
            this.gravity(item, enemy, 4, 0.5);
            if (this.collisionsCheck(item, enemy)) {
              this.respawnEnemy(enemy);
            }
          }
          for (let item2 of this.items) {
            if (item != item2) {
              if (item2.type != "blackHole") {
                this.gravity(item, item2, 4, 0.5);
                if (this.collisionsCheck(item, item2)) {
                  this.despawnItem(item2);
                }
              }
            }
          }

          if (this.collisionsCheck(item, this.player)) {
            this.touchBlackHole();
          }
        } else {
          if (this.isMagnet) {
            this.gravity(this.player, item, 2, 1);
          }
        }

        if (item.type == "growPotion") {
          for (let enemy of this.enemies) {
            if (this.collisionsCheck(enemy, item)) {
              this.despawnItem(item);
              if (!enemy.isGrow) {
                enemy.size *= 2;
              }
              enemy.isGrow = true;
            }
          }
        }
        if (this.collisionsCheck(item, this.player)) {
          this.items = this.items.filter((i) => i != item);
          switch (item.type) {
            case "coin":
              this.collectCoin(item);
              break;
            case "growPotion":
              this.collectGrowPotion(item);
              break;
            case "clearField":
              this.collectClearField();
              break;
            case "magnet":
              this.collectMagnet(item);
              break;
          }
        }
      }
      for (let enemy of this.enemies) {
        if (this.isMagnet) {
          this.gravity(this.player, enemy, 2, -1);
        }
        if (this.collisionsCheck(enemy, this.player)) {
          this.gameOver("you got killed by an enemy", "alert alert-danger");
        }
      }
    },
    collisionsCheck(
      object1: type.Enemy | type.Item | type.Player,
      object2: type.Enemy | type.Item | type.Player
    ) {
      return (
        this.lenVec(
          this.subVec(
            this.addVec(object1.vector, object1.size / 2),
            this.addVec(object2.vector, object2.size / 2)
          )
        ) <
        object1.size / 2 + object2.size / 2
      );
    },
    //itemEvents
    collectCoin(item: type.Item) {
      this.score +=
        this.difficulty *
        15 *
        item.size *
        this.percent(this.findSkill("betterCoin"), "in");
    },
    collectGrowPotion(item: type.Item) {
      this.isGrow = true;
      clearTimeout(this.growPotionID);
      this.growPotionID = setTimeout(() => {
        this.isGrow = false;
      }, 200 * item.size);
    },
    collectMagnet(item: type.Item) {
      this.isMagnet = true;
      clearTimeout(this.magnetID);
      this.magnetID = setTimeout(() => {
        this.isMagnet = false;
      }, 300 * item.size * this.percent(this.findSkill("longerMagnet"), "in"));
    },
    collectClearField() {
      for (let enemy of [...this.enemies]) {
        this.respawnEnemy(enemy);
      }
    },
    touchBlackHole() {
      this.gameOver("you got exploded", "alert alert-danger");
    },
    growBlackHole() {
      for (let item of this.items) {
        if (item.type == "blackHole") {
          item.size +=
            20 * this.percent(this.findSkill("smallerBlackHole"), "de");
          item.vector = this.subVec(item.vector, [10, 10]);
        }
      }
    },
    despawnItems() {
      for (let item of this.items) {
        item.timer--;
        if (item.timer < 0) {
          this.despawnItem(item);
        }
      }
    },
    despawnItem(item: type.Item) {
      this.items = this.items.filter((i) => i != item);
    },
    spawnItems() {
      if (!this.itemSpawn) return;
      let type = "";
      let vector = [0, 0] as type.Vector;
      let size = 20;
      let imgsrc = "";
      switch (this.getRandomInt(5)) {
        case 0:
          type = "coin";
          size = this.getRandomInt(25) + 20;
          imgsrc = "/gt/img/items/coin/coin.gif";
          break;
        case 1:
          type = "blackHole";
          size = 20 * this.percent(this.findSkill("smallerBlackHole"), "de");
          imgsrc = "blue";
          break;
        case 2:
          type = "growPotion";
          size = this.getRandomInt(25) + 20;
          imgsrc = "/gt/img/items/potion/potion.gif";
          break;
        case 3:
          type = "clearField";
          imgsrc = "/gt/img/items/bomb/bomb.gif";
          break;
        case 4:
          type = "magnet";
          imgsrc = "green";
          size = this.getRandomInt(25) + 20;
          break;
      }
      vector[0] =
        this.getRandomInt(this.borderRight - this.borderLeft - 20) +
        this.borderLeft;
      vector[1] =
        this.getRandomInt(this.borderDown - this.borderUp - 20) + this.borderUp;
      this.items.push({
        type: type as type.Itemtype,
        imgsrc: imgsrc,
        vector: vector,
        size: size,
        timer: 300, // 5sek
      });
    },

    //Enemy
    createEnemy() {
      if (!this.enemiesSpawn) return;
      let size = 0;
      let vector = [0, 0] as type.Vector;
      let type = "";
      let imgsrc = "";
      let moveArray = [] as number[];
      switch (this.getRandomInt(4)) {
        case 0:
          vector[1] = this.borderUp - 25;
          moveArray = [(Math.random() - 0.5) * 2, 1];
          break;
        case 1:
          vector[1] = this.borderDown;
          moveArray = [(Math.random() - 0.5) * 2, -1];
          break;
        case 2:
          vector[0] = this.borderRight + 2;
          moveArray = [-1, (Math.random() - 0.5) * 2];
          break;
        case 3:
          vector[0] = this.borderLeft - 25;
          moveArray = [1, (Math.random() - 0.5) * 2];
          break;
      }
      if (!vector[0]) {
        vector[0] =
          this.getRandomInt(this.borderRight - this.borderLeft) +
          this.borderLeft;
      }
      if (!vector[1]) {
        vector[1] =
          this.getRandomInt(this.borderDown - this.borderUp) + this.borderUp;
      }
      switch (this.getRandomInt(3)) {
        case 0:
          size = 20;
          imgsrc = "/gt/img/char/enemy_pingu.png";
          break;
        case 1:
          size = 25;
          imgsrc = "/gt/img/char/enemy_cupcake.gif";
          break;
        case 2:
          size = 30;
          imgsrc = "/gt/img/char/enemy_gasman.gif";
          break;
      }
      switch (this.getRandomInt(4)) {
        case 0:
          type = "curve";
          break;
        case 1:
          type = "aimbot";
          break;
        case 2:
          type = "chasebot";
          break;
        case 3:
          type = "getbigger";
          break;
        // case 4:
        //   type = "colorswitch";
        //   break;
      }
      this.player.hardcoreMode ? (type = "aimbot") : null;
      this.enemiesType ? (type = this.enemiesType) : null;

      if (type == "aimbot") {
        moveArray = this.dirVec(this.player.vector, vector);
      }
      this.enemies.push({
        vector: vector,
        size: size,
        id: JSON.stringify(this.getRandomInt(100000000)),
        type: type as type.EnemyType,
        imgsrc: imgsrc,
        moveVector: moveArray as type.Vector,
        timer: type == "chasebot" ? 300 : null,
        isGrow: false,
      });
    },

    handleEnemyMovement() {
      if (!this.enemiesMove) return;
      for (let enemy of this.enemies) {
        if (enemy.type == "curve") {
          enemy.moveVector[enemy.moveVector.findIndex((v) => v != 1)] > 0
            ? (enemy.moveVector[enemy.moveVector.findIndex((v) => v != 1)] +=
                0.02 * Math.random())
            : (enemy.moveVector[enemy.moveVector.findIndex((v) => v != 1)] -=
                0.02 * Math.random());
        }
        if (enemy.type != "chasebot") {
          enemy.vector = this.addVec(
            enemy.vector,
            this.mulVec(
              enemy.moveVector,
              this.difficulty * this.percent(this.findSkill("slowEnemy"), "de")
            )
          );
        } else {
          enemy.vector = this.addVec(
            enemy.vector,
            this.mulVec(this.dirVec(this.player.vector, enemy.vector), 2)
          );
          enemy.timer ? enemy.timer-- : this.respawnEnemy(enemy);
        }

        if (this.borderCheck(enemy, "outer")) {
          this.respawnEnemy(enemy);
        }
      }
    },

    respawnEnemy(enemy: type.Enemy) {
      this.enemies.splice(
        this.enemies.findIndex((e) => e == enemy),
        1
      );
      this.createEnemy();
    },
    handleEnemyGetBigger() {
      for (let enemy of this.enemies) {
        enemy.type == "getbigger" ? (enemy.size += 0.5) : null;
      }
    },
    // handleEnemyColorSwitch() {
    //   for (let enemy of this.Enemies) {
    //     if (enemy.type == "colorswitch") {
    //       switch (this.getRandomInt(3)) {
    //         case 0:
    //           enemy.color = "rgb(99, 206, 50)";
    //           break;
    //         case 1:
    //           enemy.color = "rgb(50, 206, 198)";
    //           break;
    //         case 2:
    //           enemy.color = "rgb(84, 50, 206)";
    //           break;
    //       }
    //     }
    //   }
    // },

    //playermovement
    bombAbility() {
      if (this.bombCoolDown) return;
      this.bombCoolDown = true;
      this.bombCoolDownID = setTimeout(() => {
        this.bombCoolDown = false;
      }, 1000);
      let bombs = [...this.items].filter((i) => i.type == "clearField");
      if (bombs.length) {
        bombs.sort((a, b) => {
          return (
            this.lenVec(this.subVec(a.vector, this.player.vector)) -
            this.lenVec(this.subVec(b.vector, this.player.vector))
          );
        });
        this.items.splice(
          this.items.findIndex((i) => i == bombs[0]),
          1
        );
        this.collectClearField();
      }
    },
    handlePlayerMovement() {
      let multiplicator = 1;
      if (this.pressedKeys["3"] && this.findSkill("bombAbility"))
        this.bombAbility();

      if (this.pressedKeys["1"] && this.findSkill("fastAbility"))
        multiplicator = 2;

      if (this.pressedKeys["2"] && this.findSkill("slowAbility"))
        multiplicator = 0.5;

      if (this.pressedKeys["ArrowLeft"] || this.pressedKeys["a"]) {
        this.left(multiplicator);
      }
      if (this.pressedKeys["ArrowRight"] || this.pressedKeys["d"]) {
        this.right(multiplicator);
      }
      if (this.pressedKeys["ArrowUp"] || this.pressedKeys["w"]) {
        this.up(multiplicator);
      }
      if (this.pressedKeys["ArrowDown"] || this.pressedKeys["s"]) {
        this.down(multiplicator);
      }
      switch (this.borderCheck(this.player, "inner")) {
        case "right":
          this.player.vector[0] = this.borderRight - this.player.size;
          break;
        case "left":
          this.player.vector[0] = this.borderLeft + 1;
          break;
        case "up":
          this.player.vector[1] = this.borderUp + 1;
          break;
        case "down":
          this.player.vector[1] = this.borderDown - (this.player.size + 2);
          break;
      }
    },
    left(multiplicator: number) {
      if (this.player.vector[0] > this.borderLeft) {
        this.player.vector[0] -= this.player.speed * multiplicator;
      }
      this.player.outlook = "left";
    },
    right(multiplicator: number) {
      if (this.player.vector[0] < this.borderRight) {
        this.player.vector[0] += this.player.speed * multiplicator;
      }
      this.player.outlook = "right";
    },
    up(multiplicator: number) {
      if (this.player.vector[1] > this.borderUp) {
        this.player.vector[1] -= this.player.speed * multiplicator;
      }
      this.player.outlook = "up";
    },
    down(multiplicator: number) {
      if (this.player.vector[1] < this.borderDown) {
        this.player.vector[1] += this.player.speed * multiplicator;
      }
      this.player.outlook = "down";
    },
    borderCheck(
      object: type.Enemy | type.Item | type.Player,
      border: "inner" | "outer"
    ) {
      if (border == "inner") {
        if (object.vector[0] > this.borderRight - object.size) {
          return "right";
        }
        if (object.vector[0] < this.borderLeft + 1) {
          return "left";
        }
        if (object.vector[1] < this.borderUp + 1) {
          return "up";
        }
        if (object.vector[1] > this.borderDown - (object.size + 2)) {
          return "down";
        }
      }
      if (border == "outer") {
        if (object.vector[0] > this.borderRight) {
          return "right";
        }
        if (object.vector[0] < this.borderLeft + 1 - object.size) {
          return "left";
        }
        if (object.vector[1] < this.borderUp + 1 - object.size) {
          return "up";
        }
        if (object.vector[1] > this.borderDown) {
          return "down";
        }
      }
      return false;
    },
    gravity(
      object1: type.Enemy | type.Item | type.Player,
      object2: type.Enemy | type.Item | type.Player,
      range: number,
      speed: number
    ) {
      if (
        this.lenVec(
          this.subVec(
            this.addVec(object1.vector, object1.size / 2),
            this.addVec(object2.vector, object2.size / 2)
          )
        ) <
        (object1.size + object2.size) * range
      ) {
        object2.vector = this.addVec(
          object2.vector,
          this.mulVec(this.dirVec(object1.vector, object2.vector), speed)
        );
      }
    },
    //rnd
    getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    },
    findSkill(skill: type.Skillname) {
      return this.player.skillTree.skills[
        this.player.skillTree.skills.findIndex((s) => s.name == skill)
      ].lvl;
    },
    percent(number: number, change: "in" | "de") {
      if (change == "in") {
        return (number + 100) / 100;
      }
      if (change == "de") {
        return number < 100 ? (100 - number) / 100 : 0;
      }
      return 1;
    },

    //Vector calculate
    addVec(vec1: type.Vector, vec2: type.Vector | number) {
      if (typeof vec2 == "number") {
        return [vec1[0] + vec2, vec1[1] + vec2] as type.Vector;
      } else {
        return [vec1[0] + vec2[0], vec1[1] + vec2[1]] as type.Vector;
      }
    },
    subVec(vec1: type.Vector, vec2: type.Vector | number) {
      if (typeof vec2 == "number") {
        return [vec1[0] - vec2, vec1[1] - vec2] as type.Vector;
      } else {
        return [vec1[0] - vec2[0], vec1[1] - vec2[1]] as type.Vector;
      }
    },
    dirVec(vec1: type.Vector, vec2: type.Vector) {
      let deltaArray = this.subVec(vec1, vec2) as type.Vector;
      deltaArray[1] /= Math.abs(deltaArray[0]);
      deltaArray[0] /= Math.abs(deltaArray[0]);
      if (Math.abs(deltaArray[1]) > 1.5) {
        deltaArray[0] /= Math.abs(deltaArray[1]);
        deltaArray[1] /= Math.abs(deltaArray[1]);
      }
      return deltaArray;
    },
    mulVec(vec1: type.Vector, vec2: type.Vector | number) {
      if (typeof vec2 == "number") {
        return [vec1[0] * vec2, vec1[1] * vec2] as type.Vector;
      } else {
        return [vec1[0] * vec2[0], vec1[1] * vec2[1]] as type.Vector;
      }
    },
    lenVec(vec: type.Vector) {
      return Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
    },
    // displaysize
    changeDisplaySize() {
      this.borderRight = Math.round(
        window.innerWidth - (window.innerWidth / 100) * 12.5 - 60
      );
      this.borderLeft = Math.round((window.innerWidth / 100) * 12.5 + 60);
      this.borderUp = Math.round((window.innerHeight / 100) * 13 + 60);
      this.borderDown = Math.round((window.innerHeight / 100) * 93 - 61);
    },
  },
});
</script>

<style lang="scss" scoped>
* {
  color: red;
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
</style>
