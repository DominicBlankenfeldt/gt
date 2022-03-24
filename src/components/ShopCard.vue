<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div title="you get scrap when enemies die">
            scrap:
            <br />
            {{ player.shop.currency }}
        </div>
        <div v-for="shopItem of ['energyCell', 'lessStartEnemies', 'higherDifficultyTimer', 'lowerScoreTimer']" :key="shopItem" class="mt-2">
            <button
                @click="buyShopItem(shopItem)"
                class="w-25 btn btn-primary align-self-center shadow-none rounded-0 rounded-top"
                :title="shopDetails[shopItem].description"
            >
                {{ shopDetails[shopItem].name }}
                <br />
                {{ player.shop[shopItem].amount }}/{{ shopDetails[shopItem].max }}
            </button>
            <div>
                <label
                    class="form-check-label w-25 rounded-bottom unselectable py-1 pointer"
                    @click="
                        {
                            ;(player.shop[shopItem].reBuy = !player.shop[shopItem].reBuy), buttonSound()
                        }
                    "
                    :style="{ backgroundColor: player.shop[shopItem].reBuy ? 'green' : 'red' }"
                >
                    auto rebuy
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { passivDetails, passivAmount, shopDetails } from '@/global'
import * as type from '@/types'
import * as music from '@/music'
export default defineComponent({
    setup() {
        currentUser
        return {
            shopDetails,
            passivDetails,
            passivAmount,
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
    },
    methods: {
        buyShopItem(shopElement: type.ShopElement) {
            if (this.player.shop.currency <= shopDetails[shopElement].cost || this.player.shop[shopElement].amount >= shopDetails[shopElement].max)
                return
            this.buttonSound()
            this.player.shop.currency -= shopDetails[shopElement].cost
            this.player.shop[shopElement].amount++
        },
        buyShopItemx8(shopElement: type.ShopElement) {
            for (let i = 0; i < 8; i++) {
                if (
                    this.player.shop.currency <= shopDetails[shopElement].cost ||
                    this.player.shop[shopElement].amount >= shopDetails[shopElement].max
                )
                    return
                this.player.shop.currency -= shopDetails[shopElement].cost
                this.player.shop[shopElement].amount++
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
