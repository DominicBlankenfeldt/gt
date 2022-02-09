<template>
    <div class="d-flex justify-content-center">
        <!-- <div class="blockUp"></div>
  </div>
  <div class="row" id="row">
    <div class="sideBlockLeft"></div> -->
        <div class="" id="game">
            <game />
        </div>
        <!-- <div class="sideBlockRight"></div>
  </div>
  <div class="d-flex justify-content-center">
    <div class="blockDown"></div> -->
    </div>
</template>

<script lang="ts">
import { currentUser } from '@/router'
import { defineComponent } from 'vue'
import { player } from '@/global'
import * as type from '@/types'
import game from '@/components/SpaceGame.vue'

export default defineComponent({
    setup() {
        player
        return { user: currentUser }
    },
    data() {
        return {
            player: player.value as type.Player,
        }
    },
    components: {
        game,
    },
})
</script>

<style scoped lang="scss">
* {
    color: white;
}
.blockUp {
    width: 75vw;
    height: 60px;
    z-index: 2;
    background-color: rgb(10, 10, 10);
    position: absolute;
    padding: 0 !important;
    top: 13vh;
}
.blockDown {
    width: 75vw;
    height: 60px;
    z-index: 2;
    background-color: rgb(10, 10, 10);
    position: absolute;
    padding: 0 !important;
    top: 86.5vh;
}

.sideBlockLeft {
    height: 80vh;
    width: 60px;
    background-color: rgb(10, 10, 10);
    z-index: 2;
    position: absolute;
    padding: 0 !important;
    left: 12.5vw;
    top: 13vh;
}
.sideBlockRight {
    height: 80vh;
    width: 60px;
    background-color: rgb(10, 10, 10);
    z-index: 2;
    position: absolute;
    padding: 0 !important;
    left: calc(87.5vw - 60px);
    top: 13vh;
}
#game {
    padding: 0 !important;
}
#row {
    margin: 0 !important;
}
</style>
