<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div title="you get scrap when enemies die">
            scrap:
            <br />
            {{ player.shop.currency }}
        </div>
        <div class="mt-2">
            <button
                class="w-25 btn btn-primary align-self-center shadow-none rounded-0 rounded-top"
                title="is needed to use abilities"
                @click="buyEnergyCell()"
                @dblclick="buyEnergyCellx8()"
            >
                energy cell
                <br />
                {{ player.shop.energyCell }}/{{ maxEnergyCell }}
            </button>
            <div>
                <label
                    class="form-check-label w-25 bg-primary rounded-bottom"
                    title="buy as many energy cells as possible after one round"
                    for="flexCheckDefault"
                >
                    <input
                        class="form-check-input shadow-none"
                        v-model="player.shop.reBuy.energyCell"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                    />
                    auto rebuy
                </label>
            </div>
            <div v-for="shopItem of ['lessStartEnemies', 'higherDifficultyTimer', 'lowerScoreTimer']" :key="shopItem" class="mt-2">
                <button class="w-25 btn btn-primary align-self-center shadow-none rounded-0 rounded-top" :title="shopDetails[shopItem].description">
                    {{ shopDetails[shopItem].name }}
                    <br />
                    {{ player.shop[shopItem] }}/{{ shopDetails[shopItem].max }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { passivDetails, passivAmount, maxEnergyCell, maxLowerScoreTimer, maxHigherDifficultyTimer, maxLessStartEnemies, shopDetails } from '@/global'
import * as type from '@/types'
import * as music from '@/music'
export default defineComponent({
    setup() {
        currentUser
        return {
            shopDetails,
            passivDetails,
            passivAmount,
            maxEnergyCell,
        }
    },
    data() {
        return {
            player: {} as type.Player,
            user: currentUser,
            dataLoad: false,
        }
    },
    props: {
        playerProp: {
            type: Object as PropType<type.Player>,
            required: true,
        },
    },

    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
        this.buttonSound()
    },
    methods: {
        buyEnergyCell() {
            if (this.player.shop.currency <= 0 || this.player.shop.energyCell >= this.maxEnergyCell) return
            this.buttonSound()
            this.player.shop.currency--
            this.player.shop.energyCell++
        },
        buyEnergyCellx8() {
            for (let i = 0; i < 8; i++) {
                if (this.player.shop.currency <= 0 || this.player.shop.energyCell >= this.maxEnergyCell) return
                this.player.shop.currency--
                this.player.shop.energyCell++
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>

<style scoped lang="scss">
a {
    margin-left: 1vw;
}
#nav {
    padding: 3vh;
    height: 8vh;
    background-color: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    a {
        font-weight: bold;
        color: rgb(255, 255, 255);

        &.router-link-exact-active {
            color: rgb(101, 211, 255);
        }
    }
}
</style>
