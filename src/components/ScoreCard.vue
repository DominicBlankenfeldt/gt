<template>
    <div class="d-flex" style="margin-top: 15vh"></div>
    <div><u style="font-size: 6vw">ranking</u></div>
    <div>
        <u style="font-size: 4vw">{{ title }}</u>
    </div>
    <div class="row g-0">
        <div class="col-12 row g-0 pointer">
            <div @click="choosePlayer(bestPlayers[0]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                <img src="/gt/img/crowns/gold.png" alt="" style="width: 5vw" class="col-12" />
            </div>
            <div @click="choosePlayer(bestPlayers[0]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                {{ bestPlayers[0]?.player.username }}
            </div>
            <div @click="choosePlayer(bestPlayers[0]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                {{ Math.round(bestPlayers[0]?.player.highscore[highscore]) }}
            </div>
        </div>
        <div class="col-12 row g-0 justify-content-between">
            <div class="col-4 pointer">
                <div @click="choosePlayer(bestPlayers[1]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                    <img src="/gt/img/crowns/silver.png" alt="" style="width: 5vw" class="col-12" />
                </div>
                <div @click="choosePlayer(bestPlayers[1]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                    {{ bestPlayers[1]?.player.username }}
                </div>
                <div @click="choosePlayer(bestPlayers[1]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                    {{ Math.round(bestPlayers[1]?.player.highscore[highscore]) }}
                </div>
            </div>

            <div class="col-4 pointer">
                <div @click="choosePlayer(bestPlayers[2]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                    <img src="/gt/img/crowns/bronze.png" alt="" style="width: 5vw" class="col-12" />
                </div>
                <div @click="choosePlayer(bestPlayers[2]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                    {{ bestPlayers[2]?.player.username }}
                </div>
                <div @click="choosePlayer(bestPlayers[2]?.player)" data-bs-toggle="modal" :data-bs-target="`#playerCard${title}`">
                    {{ Math.round(bestPlayers[2]?.player.highscore[highscore]) }}
                </div>
            </div>

            <div class="col-12 row g-0 pointer" v-for="(bestPlayer, index) in bestPlayers" :key="bestPlayer.id">
                <div
                    v-if="index > 2"
                    @click="choosePlayer(bestPlayer?.player)"
                    data-bs-toggle="modal"
                    :data-bs-target="`#playerCard${title}`"
                    class="mt-2"
                >
                    {{ bestPlayer?.player.username }} :
                    {{ Math.round(bestPlayer?.player.highscore[highscore]) }}
                </div>
            </div>
        </div>
        <!-- modal -->
        <div
            style="margin-top: 15vh"
            class="modal fade"
            :id="`playerCard${title}`"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            @click="closeChoosePlayer()"
        >
            <div class="modal-dialog modal-xl" @click.stop="">
                <div class="modal-content">
                    <div v-if="choosenPlayerLoad">
                        <PlayerCard :playerProp="choosenPlayer" :editAble="false" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as type from '@/types'
import PlayerCard from '@/components/PlayerCard.vue'
import { checkPlayer } from '@/global'
import * as music from '@/music'
export default defineComponent({
    components: {
        PlayerCard,
    },
    props: {
        player: {
            type: Object as PropType<type.Player>,
            required: true,
        },
        bestPlayers: {
            type: [] as PropType<type.User[]>,
            required: true,
        },
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
        closeChoosePlayer() {
            this.choosenPlayerLoad = false
            this.buttonSound()
        },
        choosePlayer(player: type.Player) {
            this.buttonSound()
            this.choosenPlayer = checkPlayer(player) as type.Player
            this.choosenPlayerLoad = true
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
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
