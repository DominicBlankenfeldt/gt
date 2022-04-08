<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div>
            <div data-title="you get 1 passivpoint per 2000 highscore in totalchaos mode" class="w-25 d-inline">
                Passiv Points:
                <br />
                {{ player.passivTree.passivPoints - usedPassivPoints }}/{{ player.passivTree.passivPoints }}
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <div v-for="passiv of player.shop.passivSlots.lvl" :key="passiv" class="mx-1">
                <div>
                    <div class="mt-2 w-100 btn btn-primary shadow-none rounded-0 rounded-top">passiv:</div>
                    <br />
                    <select
                        class="w-100 btn btn-primary shadow-none rounded-0 rounded-bottom"
                        v-model="player.passivTree.passivType[passiv - 1]"
                        :title="passivDetails[player.passivTree.passivType[passiv - 1]]?.description"
                        @click="buttonSound()"
                    >
                        <option :value="player.passivTree.passivType[passiv - 1]" :title="player.passivTree.passivType[passiv - 1]?.description">
                            {{ passivDetails[player.passivTree.passivType[passiv - 1]].name }}
                        </option>
                        <option
                            @click="buttonSound()"
                            :selected="passivAvaibleType == player.passivTree.passivType[passiv - 1]"
                            :value="passivAvaibleType"
                            v-for="passivAvaibleType of player.passivTree.passivAvaibleTypes.filter(p => !player.passivTree.passivType.includes(p))"
                            :key="passivAvaibleType"
                            :title="passivDetails[passivAvaibleType]?.description"
                        >
                            {{ passivDetails[passivAvaibleType].name }}
                        </option>
                        <option style="color: black" value="" v-if="player.passivTree.passivAvaibleTypes.length < passivAmount" disabled>
                            unlock more by fight the boss
                        </option>
                    </select>
                </div>
                <div v-for="passivUpgrade of player.passivTree.passivUpgrades" :key="passivUpgrade.name">
                    <button
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        @click="lvlPassivUpgrade(passivUpgrade)"
                        @dblclick="lvlPassivUpgradex8(passivUpgrade)"
                        :data-title="passivDetails[passivUpgrade.name].description"
                        :line2="passivUpgrade.name != 'none' ? 'costs: 1' : ''"
                        v-if="passivUpgrade.name == player.passivTree.passivType[passiv - 1]"
                    >
                        {{ passivDetails[passivUpgrade.name].name }}
                        <br />
                        lvl: {{ passivUpgrade.lvl }}/{{ passivDetails[passivUpgrade.name].maxlvl + findHouse(player, 'passiv') * 5 }}
                    </button>
                </div>
            </div>
        </div>
        <div class="mt-2">
            <button class="btn btn-danger align-self-center shadow-none" @click="resetPassivTree()">reset passivtree</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { passivDetails, passivAmount } from '@/global'
import { findHouse } from '@/game/helpers'
import * as type from '@/types'
import * as music from '@/music'

export default defineComponent({
    setup() {
        currentUser
        return {
            findHouse,
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
    computed: {
        usedPassivPoints() {
            let allPassivlvl = 0
            for (let passivUpgrade of this.player.passivTree.passivUpgrades) allPassivlvl += passivUpgrade.lvl
            return allPassivlvl
        },
    },
    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
    },
    methods: {
        async lvlPassivUpgrade(passivUpgrade: type.PassivUpgrade) {
            if (passivUpgrade.lvl < passivDetails[passivUpgrade.name].maxlvl + findHouse(this.player, 'passiv') * 5)
                if (this.player.passivTree.passivPoints - this.usedPassivPoints > 0) {
                    passivUpgrade.lvl++
                    this.buttonSound()
                }
        },
        async lvlPassivUpgradex8(passivUpgrade: type.PassivUpgrade) {
            for (let i = 0; i < 8; i++) {
                if (passivUpgrade.lvl < passivDetails[passivUpgrade.name].maxlvl + findHouse(this.player, 'passiv') * 5)
                    if (this.player.passivTree.passivPoints - this.usedPassivPoints > 0) {
                        passivUpgrade.lvl++
                    }
            }
        },
        async resetPassivTree() {
            this.buttonSound()
            this.player.passivTree.passivPoints -= this.usedPassivPoints
            for (let passivUpgrade of this.player.passivTree.passivUpgrades) {
                this.player.passivTree.passivPoints += passivUpgrade.lvl
                passivUpgrade.lvl = 0
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>

<style scoped lang="scss"></style>
