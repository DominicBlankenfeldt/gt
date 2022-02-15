<template>
    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <ScoreCard :bestPlayers="bestPlayersNormal" title="normal" highscore="highscore" />
            </div>
            <div class="carousel-item">
                <ScoreCard :bestPlayers="bestPlayersHardcore" title="hardcore" highscore="highscoreHardcore" />
            </div>
            <div class="carousel-item">
                <ScoreCard :bestPlayers="bestPlayersTotalchaos" title="totalchaos" highscore="highscoreTotalchaos" />
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as API from '@/API'
import * as type from '@/types'
import ScoreCard from '@/components/ScoreCard.vue'
export default defineComponent({
    data() {
        return {
            view: 'hardcore',
            bestPlayersNormal: [] as type.User[],
            bestPlayersHardcore: [] as type.User[],
            bestPlayersTotalchaos: [] as type.User[],
        }
    },
    async mounted() {
        let result = await API.getBestPlayers('player.highscore')
        if (result) {
            this.bestPlayersNormal = result.reverse() as type.User[]
        }
        result = await API.getBestPlayers('player.highscoreHardcore')
        if (result) {
            this.bestPlayersHardcore = result.reverse() as type.User[]
        }
        result = await API.getBestPlayers('player.highscoreTotalchaos')
        if (result) {
            this.bestPlayersTotalchaos = result.reverse() as type.User[]
        }
    },
    methods: {},
    components: {
        ScoreCard,
    },
})
</script>
