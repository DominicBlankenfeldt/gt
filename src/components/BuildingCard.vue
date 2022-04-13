<template>
    <div style="margin-top: 6vh; color: white" v-if="dataLoad">
        <div data-title="you get a building license when you kill" line2="the totalchaos boss" class="w-25 d-inline">
            {{ `building licenses: ${player.defeatedBosses.totalchaos - usedLicenses} ` }}
        </div>
        <div class="row g-0 mt-2">
            <div class="col-5"></div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="house of player.spaceport.houses" :key="house.name">
                    <button
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        @click="upgradeHouse(house)"
                        :data-title="house.needScore == 0 ? houseDetails[house.name].description : 'in construction'"
                        :line2="
                            house.lvl < houseDetails[house.name].maxlvl
                                ? house.needScore == 0
                                    ? 'costs: 1'
                                    : `you must earn ${house.needScore} score`
                                : 'max lvl'
                        "
                    >
                        {{ houseDetails[house.name].name }}
                        <br />
                        lvl: {{ house.lvl }}/{{ houseDetails[house.name].maxlvl }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { houseDetails } from '@/global'
import { currentUser } from '@/router'
import * as type from '@/types'
import * as music from '@/music'
export default defineComponent({
    setup() {
        currentUser
        return {
            houseDetails,
        }
    },
    computed: {
        usedLicenses() {
            let used = 0
            for (let house of this.player.spaceport.houses) {
                used += house.lvl - houseDetails[house.name].startlvl
                if (house.needScore > 0) used++
            }
            return used
        },
    },
    props: {
        playerProp: {
            type: Object as PropType<type.Player>,
            required: true,
        },
    },
    data() {
        return {
            player: {} as type.Player,
            user: currentUser,
            dataLoad: false,
        }
    },
    async mounted() {
        this.player = this.playerProp
        this.dataLoad = true
    },

    methods: {
        upgradeHouse(house: type.House) {
            if (house.needScore == 0 && this.player.defeatedBosses.totalchaos - this.usedLicenses > 0) {
                house.needScore = (house.lvl + 1) * houseDetails[house.name].upgradeCost
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>
