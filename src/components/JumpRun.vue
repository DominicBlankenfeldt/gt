<template>
  <div class="row" id="scoreCard">
    <div class="col align-self-center">
      Score: <span id="scoreSpan">{{ Math.round(score) }}</span>
    </div>
    <div class="col align-self-center">
      Enemies: <span id="scoreSpan">{{ Enemies.length }}</span>
    </div>
    <div class="col align-self-center">
      difficulty: <span id="scoreSpan">{{ difficulty }}</span>
    </div>
    <div class="col align-self-center">
      Highscore: <span id="scoreSpan">{{ Math.round(highscore) }}</span>
    </div>
  </div>
  <div class="game">
    <div
      :style="{
        left: playerx + 'px',
        top: playery + 'px',
        width: playerSize + 'px',
        height: playerSize + 'px',
      }"
      style="position: absolute; border-radius: 50%; background-color: red"
    ></div>
    <div
      :class="Enemy.size"
      v-for="Enemy of Enemies"
      :key="Enemy"
      :style="{
        left: Enemy.x + 'px',
        top: Enemy.y + 'px',
        width: Enemy.size + 'px',
        height: Enemy.size + 'px',
        backgroundColor: Enemy.color,
      }"
      style="position: absolute; border-radius: 50%"
    ></div>
    <div
      :class="item.type"
      v-for="item of items"
      :key="item"
      :style="{
        left: item.x + 'px',
        top: item.y + 'px',
        width: item.size + 'px',
        height: item.size + 'px',
        backgroundColor: item.color,
      }"
      style="position: absolute; border-radius: 50%"
    ></div>
    <div v-if="message" id="Message" :class="messageType">{{ message }}</div>
    <button
      @click="start()"
      :class="{ startBtn: true == gameStarted }"
      class="btn btn-success align-self-center shadow-none mt-1"
    >
      Start Game
    </button>
  </div>
  <div class="d-flex flex-column bottom">
    <button
      @click="enemiesSpawn = !enemiesSpawn"
      class="btn btn-success align-self-center shadow-none mt-1"
    >
      Enemies: {{ enemiesSpawn }}
    </button>
    <button
      @click="enemiesMove = !enemiesMove"
      class="btn btn-success align-self-center shadow-none mt-1"
    >
      Enemiesmove: {{ enemiesMove }}
    </button>
    <div class="input-group w-25 align-self-center mt-1">
      <label class="input-group-text" for="inputGroupSelect01"
        >Enemie Type</label
      >
      <select class="form-select" id="inputGroupSelect01" v-model="enemiesType">
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
      class="btn btn-success align-self-center shadow-none mt-1"
    >
      Items: {{ itemSpawn }}
    </button>
  </div>

  <!-- <div>
    borderUp:{{borderUp}}
  </div> -->
  <!-- <div>
    borderDown:{{borderDown}}
  </div> -->
  <!-- <div>
    borderLeft:{{borderLeft}}
  </div> -->
  <!-- <div>
    borderRight:{{borderRight}}
  </div> -->
  <!-- <div>
    X:{{x}}
  </div> -->
  <!-- <div>
    Y:{{y}}
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { skillTree } from "@/global";
import * as type from "@/types";
export default defineComponent({
  setup() {
    skillTree;
  },
  data() {
    return {
      // display
      message: "",
      messageType: "",
      // debug
      enemiesSpawn: true,
      enemiesMove: true,
      enemiesType: "",
      itemSpawn: true,
      //player
      playerx: 0,
      playery: 0,
      playerSize: 15,
      // gameSetup
      gameStarted: false,
      startingEnemies: 4,
      borderRight: 0,
      borderLeft: 0,
      borderUp: 0,
      borderDown: 0,
      difficulty: 2,
      highscore: 0,
      score: 0,
      gameloopCounter: 0,
      items: [] as type.Item[],
      pressedKeys: {} as Record<string, boolean>,
      Enemies: [] as type.Enemy[],
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.changeDisplaySize();
    });
    setInterval(() => {
      this.gameStarted ? this.gameloop() : null;
    }, 1000 / 60);
    this.changeDisplaySize();
    this.playerStartPosition();
  },
  methods: {
    //game
    gameloop() {
      this.handlePlayerMovement();
      this.handleEnemyMovement();
      this.score += this.difficulty;
      this.colisionHandling();
      this.despawnItems();
      this.gameloopCounter++;
      this.gameloopCounter % 60 == 0 ? this.handleEnemyColorSwitch() : null; // 1sek
      this.gameloopCounter % 120 == 0 ? this.handleEnemyGetBigger() : null; // 2sek
      this.gameloopCounter % 420 == 0 ? this.spawnItems() : null; // 7sek
      this.gameloopCounter % 1200 == 0 ? (this.difficulty += 0.5) : null; // 20sek
      this.gameloopCounter % 900 == 0 ? this.createEnemy() : null; // 15sek
    },

    start() {
      this.message = "";
      this.gameloopCounter = 0;
      this.score = 0;
      this.difficulty = 2;
      this.playerStartPosition();
      this.Enemies = [] as type.Enemy[];
      this.items = [] as type.Item[];
      this.gameStarted = true;
      window.onkeyup = (e: any) => {
        this.pressedKeys[e.key] = false;
      };
      window.onkeydown = (e: any) => {
        this.pressedKeys[e.key] = true;
      };
      for (let i = 0; i < this.startingEnemies; i++) this.createEnemy();
    },
    playerStartPosition() {
      this.playery = this.borderDown - this.borderUp * 1.5;
      this.playerx = this.borderRight - this.borderLeft * 2;
    },
    gameOver(message: string, messageType: string) {
      this.gameStarted = false;
      this.score > this.highscore ? (this.highscore = this.score) : null;
      this.message = message;
      this.messageType = messageType;
    },
    //colliosion

    colisionHandling() {
      for (let item of this.items) {
        if (this.collisionsCheck(item)) {
          switch (item.type) {
            case "coin":
              this.items.splice(
                this.items.findIndex((i) => i == item),
                1
              );
              this.collectCoin();
              break;
            case "bomb":
              this.explosionBomb(item);
              break;
          }
        }
      }
      for (let enemy of this.Enemies) {
        if (this.collisionsCheck(enemy)) {
          this.gameOver("you got killed by an enemy", "alert alert-danger");
        }
      }
    },
    collisionsCheck(object: type.Enemy | type.Item, range?: number) {
      let map = {
        eSmall: 15,
        eMedium: 20,
        eBig: 25,
      };
      return (
        Math.sqrt(
          (object.x + object.size / 2 - (this.playerx + 7.5)) ** 2 +
            (object.y + object.size / 2 - (this.playery + 7.5)) ** 2
        ) <
        (object.size * (range || 1)) / 2 + 7.5
      );
    },
    //itemEvents
    collectCoin() {
      this.score += this.difficulty * 300; // 5sek
    },

    explosionBomb(item: type.Item) {
      if (this.collisionsCheck(item, 5)) {
        this.gameOver("you got exploded", "alert alert-danger");
      }
    },
    despawnItems() {
      for (let item of this.items) {
        item.timer--;
        if (item.timer < 0) {
          item.type == "bomb" ? this.explosionBomb(item) : null;
          this.items.splice(
            this.items.findIndex((i) => i == item),
            1
          );
        }
      }
    },
    spawnItems() {
      if (!this.itemSpawn) return;
      let type = "";
      let x = 0;
      let y = 0;
      let color = "";
      switch (this.getRandomInt(2)) {
        case 0:
          type = "coin";
          color = "rgb(199, 219, 15)";
          break;
        case 1:
          type = "bomb";
          color = "rgb(0, 0, 0)";
          break;
      }
      x =
        this.getRandomInt(this.borderRight - this.borderLeft - 20) +
        this.borderLeft;
      y =
        this.getRandomInt(this.borderDown - this.borderUp - 20) + this.borderUp;
      this.items.push({
        type: type,
        color: color,
        x: x,
        y: y,
        size: 20,
        timer: 300, // 5sek
      });
    },

    //Enemy
    createEnemy() {
      if (!this.enemiesSpawn) return;
      let size = 0;
      let x = 0;
      let y = 0;
      let type = "";
      let color = "";
      let moveArray = [] as number[];
      switch (this.getRandomInt(4)) {
        case 0:
          y = this.borderUp - 25;
          moveArray = [(Math.random() - 0.5) * 2, 1];
          break;
        case 1:
          y = this.borderDown + 25;
          moveArray = [(Math.random() - 0.5) * 2, -1];
          break;
        case 2:
          x = this.borderRight + 2;
          moveArray = [-1, (Math.random() - 0.5) * 2];
          break;
        case 3:
          x = this.borderLeft - 25;
          moveArray = [1, (Math.random() - 0.5) * 2];
          break;
      }
      if (!x) {
        x =
          this.getRandomInt(this.borderRight - this.borderLeft) +
          this.borderLeft;
      }
      if (!y) {
        y = this.getRandomInt(this.borderDown - this.borderUp) + this.borderUp;
      }
      switch (this.getRandomInt(3)) {
        case 0:
          size = 15;
          color = "rgb(99, 206, 50)";
          break;
        case 1:
          size = 20;
          color = "rgb(50, 206, 198)";
          break;
        case 2:
          size = 25;
          color = "rgb(84, 50, 206)";
          break;
      }
      switch (this.getRandomInt(5)) {
        case 0:
          type = "curve";
          break;
        case 1:
          type = "colorswitch";
          break;
        case 2:
          type = "aimbot";
          break;
        case 3:
          type = "chasebot";
          break;
        case 4:
          type = "getbigger";
          break;
      }

      this.enemiesType ? (type = this.enemiesType) : null;

      if (type == "aimbot") {
        let deltax = this.playerx - x;
        let deltay = this.playery - y;
        deltay /= Math.abs(deltax);
        deltax /= Math.abs(deltax);
        if (Math.abs(deltay) > 1.5) {
          deltax /= Math.abs(deltay);
          deltay /= Math.abs(deltay);
        }
        moveArray = [deltax, deltay];
      }
      this.Enemies.push({
        x: x,
        y: y,
        size: size,
        id: JSON.stringify(this.getRandomInt(100000000)),
        type: type,
        color: color,
        moveVektor: moveArray,
        timer: type == "chasebot" ? 300 : null,
      });
    },

    handleEnemyMovement() {
      if (!this.enemiesMove) return;
      for (let enemy of this.Enemies) {
        if (enemy.type == "curve") {
          enemy.moveVektor[enemy.moveVektor.findIndex((v) => v != 1)] +=
            0.04 * Math.random();
        }
        if (enemy.type != "chasebot") {
          enemy.x += enemy.moveVektor[0] * this.difficulty;
          enemy.y += enemy.moveVektor[1] * this.difficulty;
        } else {
          let deltax = this.playerx - enemy.x;
          let deltay = this.playery - enemy.y;
          deltay /= Math.abs(deltax);
          deltax /= Math.abs(deltax);
          if (Math.abs(deltay) > 1.5) {
            deltax /= Math.abs(deltay);
            deltay /= Math.abs(deltay);
          }
          enemy.x += deltax * 2;
          enemy.y += deltay * 2;
          enemy.timer ? enemy.timer-- : this.respawnEnemy(enemy);
        }

        if (enemy.y < this.borderUp - 25 || enemy.y > this.borderDown + 25) {
          this.respawnEnemy(enemy);
        }
        if (enemy.x < this.borderLeft - 25 || enemy.x > this.borderRight + 25) {
          this.respawnEnemy(enemy);
        }
      }
    },

    respawnEnemy(enemy: type.Enemy) {
      this.Enemies.splice(
        this.Enemies.findIndex((e) => e == enemy),
        1
      );
      this.createEnemy();
    },
    handleEnemyGetBigger() {
      for (let enemy of this.Enemies) {
        enemy.type == "getbigger" ? (enemy.size += 2) : null;
      }
    },
    handleEnemyColorSwitch() {
      for (let enemy of this.Enemies) {
        if (enemy.type == "colorswitch") {
          switch (this.getRandomInt(3)) {
            case 0:
              enemy.color = "rgb(99, 206, 50)";
              break;
            case 1:
              enemy.color = "rgb(50, 206, 198)";
              break;
            case 2:
              enemy.color = "rgb(84, 50, 206)";
              break;
          }
        }
      }
    },

    //rnd
    getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    },

    //playermovement
    handlePlayerMovement() {
      if (this.pressedKeys["ArrowDown"] || this.pressedKeys["s"]) {
        this.down();
      }
      if (this.pressedKeys["ArrowLeft"] || this.pressedKeys["a"]) {
        this.left();
      }
      if (this.pressedKeys["ArrowRight"] || this.pressedKeys["d"]) {
        this.right();
      }
      if (this.pressedKeys["ArrowUp"] || this.pressedKeys["w"]) {
        this.up();
      }
    },
    up() {
      if (this.playery > this.borderUp) {
        this.playery -= 5;
        this.playery < this.borderUp + 2
          ? (this.playery = this.borderUp + 2)
          : null;
      }
    },
    down() {
      if (this.playery < this.borderDown) {
        this.playery += 5;
        this.playery > this.borderDown - 17
          ? (this.playery = this.borderDown - 17)
          : null;
      }
    },
    right() {
      if (this.playerx < this.borderRight) {
        this.playerx += 5;
        this.playerx > this.borderRight - 15
          ? (this.playerx = this.borderRight - 15)
          : null;
      }
    },
    left() {
      if (this.playerx > this.borderLeft) {
        this.playerx -= 5;
        this.playerx < this.borderLeft + 1
          ? (this.playerx = this.borderLeft + 1)
          : null;
      }
    },

    //displaysize
    changeDisplaySize() {
      this.borderRight = Math.round(
        (window.innerWidth * (100 - 100 / 6)) / 100 - 2
      );
      this.borderLeft = Math.round((window.innerWidth * (100 / 6)) / 100 + 2);
      this.borderUp = window.innerHeight * 0.2;
      this.borderDown = this.borderUp + 550;
    },
  },
});
</script>

<style lang="scss" scoped>
.game {
  // widht=1280px
  width: 100%;
  height: 550px;
  border: 2px solid black;
  background-color: rgb(255, 255, 255);
  z-index: 1;
}
#scoreCard {
  background-color: white;
  height: 5vh;
  position: relative;
  z-index: 1;
}
.bottom {
  width: 100%;
  z-index: 1;
  background-color: rgb(255, 255, 255);
  position: relative;
  padding: 0 !important;
}
.sideBlock {
  background-color: red;
  z-index: 1;
  position: fixed;
}
.block {
  width: 100%;
  height: 30px;
  z-index: 1;
  background-color: blue;
  position: fixed;
}
.startBtn {
  display: none;
}
</style>
