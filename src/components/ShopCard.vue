<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div>
            <div data-title="you get scrap when enemies die" class="w-25 d-inline">
                scrap:
                <br />
                {{ player.shop.currency }}
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <div>
                <div v-for="shopItem of ['energyCell', 'lessStartEnemies', 'higherDifficultyTimer', 'lowerScoreTimer']" :key="shopItem" class="mt-2">
                    <label
                        v-if="shopItem != 'energyCell'"
                        class="form-check-label w-100 rounded-top unselectable pointer"
                        style="height: 3vh"
                        @click="
                            {
                                ;(player.shop[shopItem].use = !player.shop[shopItem].use), buttonSound()
                            }
                        "
                        :style="{ backgroundColor: player.shop[shopItem].use ? 'green' : 'red' }"
                        :data-title="shopDetails[shopItem].description"
                    >
                        use {{ shopDetails[shopItem].name }}
                    </label>
                    <button
                        @click="buyShopItem(shopItem)"
                        class="w-100 btn btn-primary align-self-center shadow-none rounded-0"
                        :class="shopItem == 'energyCell' ? 'rounded-top' : ''"
                        style="height: 6vh"
                        :data-title="shopDetails[shopItem].description"
                        :line2="
                            player.shop[shopItem].amount < modelDetails[player.ship.selectedModel.rarity].store
                                ? `costs: ${shopDetails[shopItem].cost}`
                                : 'full'
                        "
                    >
                        {{ shopDetails[shopItem].name }}
                        <br />
                        {{ player.shop[shopItem].amount }}/{{
                            shopItem == 'energyCell'
                                ? modelDetails[player.ship.selectedModel.rarity].store + findWeaponUpgrade(player, 'munitionsDepot')
                                : shopDetails[buyShopItem.name].max
                        }}
                    </button>
                    <div>
                        <label
                            class="form-check-label w-100 rounded-bottom unselectable py-1 pointer"
                            @click="
                                {
                                    ;(player.shop[shopItem].reBuy = !player.shop[shopItem].reBuy), buttonSound()
                                }
                            "
                            :style="{ backgroundColor: player.shop[shopItem].reBuy ? 'green' : 'red' }"
                            style="height: 3vh"
                        >
                            auto rebuy
                        </label>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-column-reverse">
                <div v-for="shopItem of ['lowerScoreTimer', 'higherDifficultyTimer', 'lessStartEnemies']" :key="shopItem" class="mt-2">
                    <button
                        @click="upgradeShopItem(shopItem)"
                        class="w-100 btn btn-primary align-self-center shadow-none ms-1"
                        style="height: 12vh"
                        :data-title="shopDetails[shopItem].description"
                        :line2="
                            player.shop[shopItem].lvl < shopDetails[shopItem].maxlvl
                                ? `costs: ${player.shop[shopItem].lvl * shopDetails[shopItem].upgradeCost}`
                                : 'max lvl'
                        "
                    >
                        upgrade {{ shopDetails[shopItem].name }}
                        <br />
                        {{ player.shop[shopItem].lvl }}/{{ findHouse(player, 'shop') }}
                    </button>
                </div>
            </div>
            <div class="mt-2">
                <button
                    @click="upgradeShopItem('passivSlots')"
                    class="w-100 btn btn-primary align-self-center shadow-none ms-1"
                    style="height: 9vh"
                    data-title="unlocks additional passive slots"
                    :line2="
                        player.shop['passivSlots'].lvl < shopDetails['passivSlots'].maxlvl
                            ? `costs: ${player.shop['passivSlots'].lvl * shopDetails['passivSlots'].upgradeCost}`
                            : 'max lvl'
                    "
                >
                    {{ shopDetails['passivSlots'].name }}
                    <br />
                    {{ player.shop['passivSlots'].lvl }}/{{ findHouse(player, 'shop') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { passivDetails, passivAmount, shopDetails, modelDetails } from '@/global'
import * as type from '@/types'
import * as music from '@/music'
import { findHouse, findWeaponUpgrade } from '@/game/helpers'
export default defineComponent({
    setup() {
        currentUser
        return {
            shopDetails,
            passivDetails,
            passivAmount,
            modelDetails,
            findHouse,
            findWeaponUpgrade,
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
        upgradeShopItem(shopElement: type.ShopElement) {
            if (
                this.player.shop.currency <= this.player.shop[shopElement].lvl * shopDetails[shopElement].upgradeCost ||
                this.player.shop[shopElement].lvl >= findHouse(this.player, 'shop')
            )
                return
            this.player.shop.currency -= this.player.shop[shopElement].lvl * shopDetails[shopElement].upgradeCost
            this.player.shop[shopElement].lvl++
        },
        buyShopItem(shopElement: type.ShopElement) {
            if (
                this.player.shop.currency <= shopDetails[shopElement].cost ||
                this.player.shop[shopElement].amount >=
                    (shopElement != 'energyCell'
                        ? shopDetails[shopElement].max
                        : modelDetails[this.player.ship.selectedModel.rarity].store + findWeaponUpgrade(this.player, 'munitionsDepot'))
            )
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
