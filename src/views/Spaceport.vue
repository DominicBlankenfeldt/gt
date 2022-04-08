<template>
    <div style="margin-top: 7.2vh" v-if="dataLoad">
        <div data-title="you get scrap when enemies die" class="w-25 d-inline">
            building licenses:
            <br />
            {{ player.defeatedBosses.totalchaos - usedLicenses }}/{{ player.defeatedBosses.totalchaos }}
        </div>
        <div class="row g-0" style="margin-top: 6vh">
            <div class="col-5"></div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="house of player.spaceport.houses" :key="house.name">
                    <button
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        @click="upgradeHouse(house)"
                        :data-title="house.needScore == 0 ? houseDetails[house.name].description : 'in construction'"
                        :line2="house.needScore == 0 ? 'costs: 1' : `you must earn ${house.needScore} score`"
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
import { defineComponent } from 'vue'
import { checkPlayer, houseDetails } from '@/global'
import { currentUser } from '@/router'
import * as API from '@/API'
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
                used += house.lvl
                if (house.needScore > 0) used++
            }
            return used
        },
    },
    data() {
        return {
            player: {} as type.Player,
            user: currentUser,
            dataLoad: false,
        }
    },
    async unmounted() {
        try {
            await API.addPlayer(this.player)
        } catch {
            API.logout()
        }
    },
    async mounted() {
        if (this.user) {
            try {
                let result = await API.getPlayer()
                if (result) {
                    this.player = result.player
                }
            } catch {
                API.logout()
            }
        }
        this.player = checkPlayer(this.player) as type.Player
        music.changeVolume(this.player.settings.musicVolume)
        this.buttonSound()
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
