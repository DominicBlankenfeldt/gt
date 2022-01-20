<template>
  <div class="row" id="scoreCard">
    <div class="col align-self-center">
      <img src="../../public/img/items/coin/coin.gif" alt="coin" />
      Score &nbsp;
      <span style="position:absolute">
        <div v-for="player in allPlayers" :key="player.id"><span id="scoreSpan">{{player.id}}: {{ Math.round(player.score) }}</span></div>
      </span>
    </div>
    <div class="col align-self-center">
      Enemies: <span id="scoreSpan">{{ Enemies.length }}</span>
    </div>
    <div class="col align-self-center">
      difficulty: <span id="scoreSpan">{{ difficulty }}</span>
    </div>
    <div class="col align-self-center">
      <img src="../../public/img/items/coin/coin.gif" alt="coin" />
      Highscore: <span id="scoreSpan">{{ Math.round(highscore) }}</span>
    </div>
  </div>
  <div class="game">
    <div
      v-for="player in players"
      :key="JSON.stringify(player)"
      :style="{
        left: player.x + 'px',
        top: player.y + 'px',
        width: player.size + 'px',
        height: player.size + 'px',
        backgroundColor: player.color
      }"
      style="position: absolute; border-radius: 50%; "
    ></div>
    <div
      :class="Enemy.size"
      v-for="Enemy of Enemies"
      :key="Enemy.id"
      :style="{
        left: Enemy.x + 'px',
        top: Enemy.y + 'px',
        width: Enemy.size + 'px',
        height: Enemy.size + 'px',
      }"
      style="position: absolute; border-radius: 50%"
    >
      <img :src="Enemy.imgsrc" alt="enemy" />
    </div>
    <div
      :class="item.type"
      v-for="item of items"
      :key="JSON.stringify(item)"
      :style="{
        left: item.x + 'px',
        top: item.y + 'px',
        width: item.size + 'px',
        height: item.size + 'px',
        backgroundColor: item.imgsrc,
      }"
      style="position: absolute; border-radius: 50%"
    >
      <img :src="item.imgsrc" />
    </div>
    <div v-if="message" id="Message" :class="messageType">{{ message }}</div>
    <button
      @click="start()"
      v-if="!gameStarted"
      id="startGameBtn"
      class="btn btn-success align-self-center shadow-none mt-1"
    >
      Start Game
    </button>
  </div>
  <div class="bottom"></div>
  <div class="btn-group " role="group" aria-label="Basic checkbox toggle button group">
  <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" v-model="hardCoreMode">
  <label class="btn btn-outline-primary shadow-none  w-25" for="btncheck1">Hardcore Mode</label>
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
      <select class="form-select p-0" id="inputGroupSelect01" v-model="enemiesType">
        <option selected value=""></option>
        <option value="curve">curve</option>
        <!-- <option value="colorswitch">colorswitch</option> -->
        <option value="aimbot">aimbot</option>
        <option value="chasebot">chasebot</option>
        <option value="getbigger">getbigger</option>
      </select>
    </div>
    <!-- <button
      @click="itemSpawn = !itemSpawn"
      class="btn btn-success align-self-center shadow-none p-0"
    >
      Items: {{ itemSpawn }}
    </button> -->
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { skillTree, production } from "@/global";
import * as type from "@/types";
import { createNewAIPlayer, getNewGeneration } from "@/AI";
export default defineComponent({
  setup() {
    skillTree;
    production;
  },
  computed:{
    allPlayers():type.Player[]{
      return [...this.players,...this.deadPlayers].sort((a,b)=>a.id<b.id?-1:1)
    }
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
      players: [] as type.Player[],
      deadPlayers: [] as type.Player[],
      skillTree: skillTree,
      // gameSetup
      hardCoreMode:false,
      growPotionID: 0,
      gameStarted: false,
      startingEnemies: 10,
      borderRight: 0,
      borderLeft: 0,
      borderUp: 0,
      borderDown: 0,
      difficulty: 2,
      highscore: 0,
      gameloopCounter: 0,
      items: [] as type.Item[],
      pressedKeys: {} as Record<string, boolean>,
      Enemies: [] as type.Enemy[],
    };
  },

  mounted() {
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
  },

  methods: {
    //game
    gameloop() {
      for (let player of this.players) this.handlePlayerMovement(player);
      this.handleEnemyMovement();
      for (let player of this.players)
        player.score += this.difficulty * ((this.skillTree.skills[4].lvl + 100) / 100);
      this.colisionHandling();
      this.despawnItems();
      this.gameloopCounter++;
      //this.gameloopCounter % 60 == 0 ? this.handleEnemyColorSwitch() : null; // 1sek
      this.gameloopCounter % 20 == 0 ? this.handleEnemyGetBigger() : null; // 0.3sek
      this.gameloopCounter % 120 == 0 ? this.spawnItems() : null; // 2sek
      this.gameloopCounter % 1200 == 0 ? (this.difficulty += 0.5) : null; // 20sek
      this.gameloopCounter % (900 + 3 * this.skillTree.skills[3].lvl) == 0
        ? this.createEnemy()
        : null;
    },

    start() {
      this.hardCoreMode?this.startingEnemies=400:this.startingEnemies=10
      clearTimeout(this.growPotionID);
      for (let player of this.players) player.size = 15;
      this.message = "";
      this.gameloopCounter = 0;
      for (let player of this.players) player.score = 0;
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
    const createNormalPlayer = (keys?:[up:string,down:string,left:string,right:string],color?:string,id?:string):type.Player=>{
      return {
          x: 0,
          y: 0,
          score:0,
          speed: 5,
          size: 15,
          id: id??"Player1",
          color:color??"red",
          doesMove(dir, pressedKeys) {
            if (dir == "up") return pressedKeys[keys?.[0]??"ArrowUp"];
            if (dir == "down") return pressedKeys[keys?.[1]??"ArrowDown"];
            if (dir == "left") return pressedKeys[keys?.[2]??"ArrowLeft"];
            if (dir == "right") return pressedKeys[keys?.[3]??"ArrowRight"];
            return false;
          },
        }
    }
    this.deadPlayers=[]
    this.players=[]
    for (let i = 0;i<20;i++)
     this.players.push(createNewAIPlayer())

      for (let player of this.players) {
        player.y = this.borderDown - this.borderUp * 1.5;
        player.x = this.borderRight - this.borderLeft * 2;
      }
    },
    gameOver(player:type.Player,message: string, messageType: string) {
      if (this.deadPlayers.some(p=>p.id==player.id)) return //when the player is already dead, discard, happens when you collide with more than one enemy in one tick

      this.message = player.id+" "+message;
      this.messageType = messageType;
      this.deadPlayers.push(player)
      this.players=this.players.filter(p=>p.id!=player.id)
      if (this.players.length==0){
        this.gameStarted = false;
        player.score > this.highscore ? (this.highscore = player.score) : null;
        this.skillTree.skillPoints = Math.floor(this.highscore / 1000);
        if (player.score){
          this.nextGeneration()
        }
      }else{
        setTimeout(()=>this.message="",2000)
      }
    },
    nextGeneration(){
      this.gameloopCounter = 0;
      this.difficulty = 2;
      this.Enemies = [] as type.Enemy[];
      this.items = [] as type.Item[];
      this.players=getNewGeneration(this.deadPlayers)
      for (let player of this.players) {
        player.y = this.borderDown - this.borderUp * 1.5;
        player.x = this.borderRight - this.borderLeft * 2;
      }
      this.deadPlayers=[]
      this.gameStarted = true;
      for (let i = 0; i < this.startingEnemies; i++) this.createEnemy();
    },
    //colliosion
    colisionHandling() {
      for (let player of this.players) {
        for (let item of this.items) {
          if (this.collisionsCheck(player, item)) {
            switch (item.type) {
              case "coin":
                this.items.splice(
                  this.items.findIndex((i) => i == item),
                  1
                );
                this.collectCoin(player);
                break;
              case "bomb":
                this.explosionBomb(player, item);
                break;
              case "growPotion":
                this.items.splice(
                  this.items.findIndex((i) => i == item),
                  1
                );
                this.collectGrowPotion(player);
                break;
              case "clearField":
                this.items.splice(
                  this.items.findIndex((i) => i == item),
                  1
                );
                this.collectClearField();
                break;
            }
          }
        }
        for (let enemy of this.Enemies) {
          if (this.collisionsCheck(player, enemy)) {
            this.gameOver(player,"got killed by an enemy", "alert alert-danger");
          }
        }
      }
    },
    collisionsCheck(player: type.Player, object: type.Enemy | type.Item, range?: number) {
  return (
        Math.sqrt(
          (object.x + object.size / 2 - (player.x + player.size / 2)) ** 2 +
            (object.y + object.size / 2 - (player.y + player.size / 2)) ** 2
        ) <
        (object.size * (range || 1)) / 2 + 7.5
      );
    },
    //itemEvents
    collectCoin(player:type.Player) {
      player.score += this.difficulty * 300; // 5sek
    },
    collectGrowPotion(player: type.Player) {
      player.size += 15;
      this.growPotionID = setTimeout(() => {
        player.size -= 15;
      }, 5000);
    },
    collectClearField() {
      for (let enemy of [...this.Enemies]) {
        this.respawnEnemy(enemy);
      }
    },
    explosionBomb(player: type.Player, item: type.Item) {
      if (this.collisionsCheck(player, item, 5)) {
        this.gameOver(player,"got exploded", "alert alert-danger");
      }
    },
    despawnItems() {
      for (let item of this.items) {
        item.timer--;
        if (item.timer < 0) {
          item.type == "bomb"
            ? this.players.forEach((player) => this.explosionBomb(player, item))
            : null;
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
      let imgsrc = "";
      switch (this.getRandomInt(4)) {
        case 0:
          type = "coin";
          imgsrc = "/gt/img/items/coin/coin.gif";
          break;
        case 1:
          type = "bomb";
          imgsrc = "blue";
          break;
        case 2:
          type = "growPotion";
          imgsrc = "/gt/img/items/potion/potion.gif";
          break;
        case 3:
          type = "clearField";
          imgsrc = "/gt/img/items/bomb/bomb.gif";
          break;
      }
      x =
        this.getRandomInt(this.borderRight - this.borderLeft - 20) +
        this.borderLeft;
      y =
        this.getRandomInt(this.borderDown - this.borderUp - 20) + this.borderUp;
      this.items.push({
        type: type,
        imgsrc: imgsrc,
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
      let imgsrc = "";
      let moveArray = [] as number[];
      switch (this.getRandomInt(4)) {
        case 0:
          y = this.borderUp - 25;
          moveArray = [(Math.random() - 0.5) * 2, 1];
          break;
        case 1:
          y = this.borderDown ;
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
          imgsrc = "/gt/img/char/enemy_pingu.png";
          break;
        case 1:
          size = 20;
          imgsrc = "/gt/img/char/enemy_cupcake.gif";
          break;
        case 2:
          size = 25;
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
this.hardCoreMode?type="aimbot":null
      this.enemiesType ? (type = this.enemiesType) : null;

      let targetPlayer = this.players[Math.floor(Math.random() * this.players.length)];
      if (type == "aimbot") {
        let deltax = targetPlayer.x - x;
        let deltay = targetPlayer.y - y;
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
        imgsrc: imgsrc,
        moveVektor: moveArray,
        timer: type == "chasebot" ? 300 : null,
        targetPlayerId: targetPlayer.id, //select a random player to chase/aim at
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
          enemy.x +=
            enemy.moveVektor[0] *
            this.difficulty *
            ((100 - this.skillTree.skills[2].lvl) / 100);
          enemy.y +=
            enemy.moveVektor[1] *
            this.difficulty *
            ((100 - this.skillTree.skills[2].lvl) / 100);
        } else {
          let deltax = this.players.find((p) => p.id == enemy.targetPlayerId)?.x ?? 0 - enemy.x;
          let deltay = this.players.find((p) => p.id == enemy.targetPlayerId)?.y ?? 0 - enemy.y;
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

        if (enemy.y < this.borderUp - 25 || enemy.y > this.borderDown) {
          this.respawnEnemy(enemy);
        }
        if (enemy.x < this.borderLeft - 25 || enemy.x > this.borderRight + 2) {
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
        enemy.type == "getbigger" ? (enemy.size += 1) : null;
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

    //rnd
    getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    },

    //playermovement
    handlePlayerMovement(player: type.Player) {
      let multiplicator = 1;
      this.pressedKeys["Control"] && this.skillTree.skills[0].lvl
        ? (multiplicator = 2)
        : null;
      this.pressedKeys["Shift"] && this.skillTree.skills[1].lvl
        ? (multiplicator = 0.5)
        : null;
      const AIInfo:type.AIInfo = {
        enemies: this.Enemies,
        items: this.items,
        border: [this.borderUp,this.borderDown,this.borderLeft,this.borderRight],
        player: player
      }
      if (player.doesMove("down", this.pressedKeys, AIInfo)) {
        this.down(player, multiplicator);
      }
      if (player.doesMove("left", this.pressedKeys, AIInfo)) {
        this.left(player, multiplicator);
      }
      if (player.doesMove("right", this.pressedKeys, AIInfo)) {
        this.right(player, multiplicator);
      }
      if (player.doesMove("up", this.pressedKeys, AIInfo)) {
        this.up(player, multiplicator);
      }
    },
    up(player: type.Player, multiplicator: number) {
      if (player.y > this.borderUp) {
        player.y -= player.speed * multiplicator;
        player.y < this.borderUp + 2 ? (player.y = this.borderUp + 2) : null;
      }
    },
    down(player: type.Player, multiplicator: number) {
      if (player.y < this.borderDown) {
        player.y += player.speed * multiplicator;
        player.y > this.borderDown - 17
          ? (player.y = this.borderDown - 17)
          : null;
      }
    },
    right(player: type.Player, multiplicator: number) {
      if (player.x < this.borderRight) {
        player.x += player.speed * multiplicator;
        player.x > this.borderRight - 15
          ? (player.x = this.borderRight - 15)
          : null;
      }
    },
    left(player: type.Player, multiplicator: number) {
      if (player.x > this.borderLeft) {
        player.x -= player.speed * multiplicator;
        player.x < this.borderLeft + 1
          ? (player.x = this.borderLeft + 1)
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
  height: 30px;
  width: 100vw;
  margin-left: -16.7vw;
  z-index: 1;
  background-color: rgb(255, 255, 255);
  position: relative;
  padding: 0 !important;
}

</style>
