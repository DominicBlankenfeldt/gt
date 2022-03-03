<template>
    <div class="d-flex" style="margin-top: 15vh"></div>
    <div style="font-size: 6vw"><u>ranking</u></div>
    <div style="font-size: 4vw">
        <u>{{ title }}</u>
    </div>
    <div class="row g-0">
        <div class="col-12 row g-0">
            <div>
                <img src="/gt/img/crowns/gold.png" alt="" style="width: 5vw" class="col-12" />
            </div>
            <div @click="choosePlayer(bestPlayers[0]?.player)" data-bs-toggle="modal" data-bs-target="#playerCard">
                {{ bestPlayers[0]?.player.username }}
            </div>
            <div @click="choosePlayer(bestPlayers[0]?.player)" data-bs-toggle="modal" data-bs-target="#playerCard">
                {{ Math.round(bestPlayers[0]?.player[highscore]) }}
            </div>
        </div>
        <div class="col-12 row g-0 justify-content-between">
            <div class="col-4">
                <div>
                    <img src="/gt/img/crowns/silver.png" alt="" style="width: 5vw" class="col-12" />
                </div>
                <div @click="choosePlayer(bestPlayers[1]?.player)" data-bs-toggle="modal" data-bs-target="#playerCard">
                    {{ bestPlayers[1]?.player.username }}
                </div>
                <div @click="choosePlayer(bestPlayers[1]?.player)" data-bs-toggle="modal" data-bs-target="#playerCard">
                    {{ Math.round(bestPlayers[1]?.player[highscore]) }}
                </div>
            </div>

            <div class="col-4">
                <div>
                    <img src="/gt/img/crowns/bronze.png" alt="" style="width: 5vw" class="col-12" />
                </div>
                <div @click="choosePlayer(bestPlayers[2]?.player)" data-bs-toggle="modal" data-bs-target="#playerCard">
                    {{ bestPlayers[2]?.player.username }}
                </div>
                <div @click="choosePlayer(bestPlayers[2]?.player)" data-bs-toggle="modal" data-bs-target="#playerCard">
                    {{ Math.round(bestPlayers[2]?.player[highscore]) }}
                </div>
            </div>

            <div class="col-12 row g-0" v-for="(bestPlayer, index) in bestPlayers" :key="bestPlayer.id">
                <div v-if="index > 2" @click="choosePlayer(bestPlayer?.player)" data-bs-toggle="modal" data-bs-target="#playerCard">
                    {{ bestPlayer?.player.username }} :
                    {{ Math.round(bestPlayer?.player[highscore]) }}
                </div>
            </div>
        </div>
        <!-- modal -->
        <div
            style="margin-top: 15vh"
            class="modal fade"
            id="playerCard"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            @click="choosenPlayerLoad = false"
        >
            <div class="modal-dialog modal-xl">
                <div v-if="choosenPlayerLoad">
                    <PlayerCard :playerProp="choosenPlayer" :editAble="false" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as type from '@/types'
import PlayerCard from '@/components/PlayerCard.vue'

export default defineComponent({
    components: {
        PlayerCard,
    },
    props: {
        bestPlayers: [],
        title: String,
        highscore: String,
    },
    data() {
        return {
            choosenPlayerLoad: false,
            choosenPlayer: {} as type.Player,
        }
    },
    methods: {
        choosePlayer(player: type.Player) {
            this.choosenPlayer = player
            this.choosenPlayerLoad = true
        },
    },
})
</script>
<style lang="scss" scoped>
* {
    color: white;
    text-shadow: 2px 2px black;
}
.modal-xl {
    max-width: 85vw !important;
}
</style>

