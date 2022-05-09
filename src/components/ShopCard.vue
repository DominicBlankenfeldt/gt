<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div>
            <div data-title="you get scrap when enemies die" class="w-25 d-inline">
                Scrap:
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
                        :data-title="
                            shopDetails[shopItem].description +
                            '\n' +
                            (player.shop[shopItem].amount < (shopItem == 'energyCell' ? maxEnergyCell : shopDetails[shopItem].max)
                                ? `costs: ${shopDetails[shopItem].cost}`
                                : 'full')
                        "
                    >
                        {{ shopDetails[shopItem].name }}
                        <br />
                        {{ player.shop[shopItem].amount }}/{{ shopItem == 'energyCell' ? maxEnergyCell : shopDetails[shopItem].max }}
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
                <div v-for="shopElement of ['lowerScoreTimer', 'higherDifficultyTimer', 'lessStartEnemies']" :key="shopElement" class="mt-2">
                    <button
                        @click="upgradeShopElement(shopElement)"
                        class="w-100 btn btn-primary align-self-center shadow-none ms-1"
                        style="height: 12vh"
                        :data-title="
                            shopDetails[shopElement].description +
                            '\n' +
                            (player.shop[shopElement].lvl < findHouse(player, 'shop') ? `costs: ${upgradeCosts(shopElement)}` : 'max lvl')
                        "
                    >
                        upgrade {{ shopDetails[shopElement].name }}
                        <br />
                        {{ player.shop[shopElement].lvl }}/{{ findHouse(player, 'shop') }}
                    </button>
                </div>
            </div>
            <div class="mt-2">
                <button
                    @click="upgradeShopElement('passivSlots')"
                    class="w-100 btn btn-primary align-self-center shadow-none ms-1"
                    style="height: 9vh"
                    :data-title="
                        'unlocks additional passive slots' +
                        '\n' +
                        (player.shop['passivSlots'].lvl < findHouse(player, 'shop') ? `costs: ${upgradeCosts('passivSlots')}` : 'max lvl')
                    "
                >
                    {{ shopDetails['passivSlots'].name }}
                    <br />
                    {{ player.shop['passivSlots'].lvl }}/{{ findHouse(player, 'shop') }}
                </button>
            </div>
            <div class="mt-2 ms-1">
                <button
                    @click="buyBuildingLicenses()"
                    class="w-100 btn btn-primary align-self-center shadow-none ms-1"
                    style="height: 9vh"
                    :data-title="'buy a Building License' + '\n' + `costs: ${licenseCost} scrap`"
                >
                    building
                    <br />
                    license
                </button>
                <button
                    @click="buyModel()"
                    class="w-100 btn btn-primary align-self-center shadow-none ms-1 mt-1"
                    style="height: 9vh"
                    :data-title="'buy a random spaceship' + '\n' + `costs: ${modelCost} scrap`"
                    :data-bs-toggle="player.shop.currency >= modelCost ? 'modal' : null"
                    data-bs-target="#modelModal"
                >
                    random
                    <br />
                    spaceship
                </button>
                <button
                    @click="buyTasks()"
                    class="w-100 btn btn-primary align-self-center shadow-none ms-1 mt-1"
                    style="height: 9vh"
                    :data-title="'buy a new tasks' + '\n' + `costs: ${tasksCost} scrap`"
                >
                    new
                    <br />
                    tasks
                </button>
            </div>
        </div>
    </div>
    <!-- modal -->
    <div class="modal fade" id="modelModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel"></h5>
                </div>
                <div class="modal-body">
                    {{ receiveMessage }}
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary shadow-none"
                        data-bs-dismiss="modal"
                        @click="
                            {
                                ;(receiveMessage = ''), buttonSound()
                            }
                        "
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- modal -->
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { passivDetails, passivAmount, shopDetails, modelDetails } from '@/global'
import * as type from '@/types'
import * as music from '@/music'
import {
    findHouse,
    findWeaponUpgrade,
    findPassivUpgrade,
    percent,
    buyModel,
    payCurrency,
    handleGainXp,
    findlvlShop,
    getRandomInt,
} from '@/game/helpers'
import { tasks } from '@/game/dailyTasks'
export default defineComponent({
    setup() {
        currentUser
        return {
            shopDetails,
            passivDetails,
            passivAmount,
            modelDetails,
            percent,
            findPassivUpgrade,
            findHouse,
            findWeaponUpgrade,
        }
    },
    data() {
        return {
            player: {} as type.Player,
            user: currentUser,
            receiveMessage: '',
            maxEnergyCell: 0,
            dataLoad: false,
            modelCost: 500,
            licenseCost: 2500,
            tasksCost: 500,
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
        this.maxEnergyCell = Math.round(
            modelDetails[this.player.ship.selectedModel.rarity].store +
                findWeaponUpgrade(this.player, 'munitionsDepot') * percent(findPassivUpgrade(this.player, 'shipStats') / 5, 'in')
        )
        this.modelCost *= percent(findlvlShop(this.player, 'tier2') * 10, 'de')
        this.licenseCost *= percent(findlvlShop(this.player, 'tier2') * 10, 'de')
        this.tasksCost *= percent(findlvlShop(this.player, 'tier2') * 10, 'de')
        this.dataLoad = true
    },
    methods: {
        upgradeCosts(shopElement: type.ShopElement) {
            return this.player.shop[shopElement].lvl * shopDetails[shopElement].upgradeCost * percent(findlvlShop(this.player, 'tier2') * 10, 'de')
        },
        buyTasks() {
            if (this.player.shop.currency < this.tasksCost) return
            this.player = payCurrency(this.player, this.tasksCost)
            this.player.daily.tasksDone = 0
            let avaibleTasks = Object.values(tasks) as type.Task[]
            this.player.daily.tasks = []
            for (let i = 0; i < 3; i++) {
                this.player.daily.tasks.push(avaibleTasks.splice(getRandomInt(avaibleTasks.length - 1), 1)[0])
                if (this.player.lvlTree.lvl > 5) {
                    this.player.daily.tasks[i].need *= 5
                } else {
                    this.player.daily.tasks[i].need *= this.player.lvlTree.lvl
                }
            }
        },
        buyModel() {
            if (this.player.shop.currency < this.modelCost) return
            this.player = payCurrency(this.player, this.modelCost)
            let result = buyModel(this.player, 4, 1)
            this.player = result.player
            for (let task of this.player.daily.tasks) {
                if (task.type == 'getSpaceShips') {
                    if (task.need > 0) {
                        task.need--
                        if (task.need <= 0) {
                            this.player.daily.tasksDone++
                            this.player = handleGainXp(this.player, 100)
                        }
                    }
                }
            }
            this.receiveMessage = result.receiveMessage
        },
        buyBuildingLicenses() {
            if (this.player.shop.currency < this.licenseCost) return
            this.buttonSound()
            this.player = payCurrency(this.player, this.licenseCost)
            this.player.spaceport.buildingLicenses++
        },
        upgradeShopElement(shopElement: type.ShopElement) {
            if (this.player.shop.currency <= this.upgradeCosts(shopElement) || this.player.shop[shopElement].lvl >= findHouse(this.player, 'shop'))
                return
            this.player = payCurrency(this.player, this.upgradeCosts(shopElement))
            this.player.shop[shopElement].lvl++
        },
        buyShopItem(shopElement: type.ShopElement) {
            if (
                this.player.shop.currency <= shopDetails[shopElement].cost ||
                this.player.shop[shopElement].amount >= (shopElement != 'energyCell' ? shopDetails[shopElement].max : this.maxEnergyCell)
            )
                return
            this.buttonSound()
            this.player = payCurrency(this.player, shopDetails[shopElement].cost)
            this.player.shop[shopElement].amount++
        },
        buyShopItemx8(shopElement: type.ShopElement) {
            for (let i = 0; i < 8; i++) {
                if (
                    this.player.shop.currency <= shopDetails[shopElement].cost ||
                    this.player.shop[shopElement].amount >= shopDetails[shopElement].max
                )
                    return
                this.player = payCurrency(this.player, shopDetails[shopElement].cost)
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
