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
            <div v-for="passivUpgrade of player.passivTree.passivUpgrades" :key="passivUpgrade.name">
                <div class="mx-1" v-if="player.passivTree.passivType.includes(passivUpgrade.name)">
                    <button
                        class="mt-2 w-100 btn btn-primary shadow-none"
                        @click="lvlPassivUpgrade(passivUpgrade)"
                        @dblclick="lvlPassivUpgradex8(passivUpgrade)"
                        :data-title="passivDetails[passivUpgrade.name].description"
                        :line2="passivUpgrade.name != 'none' ? 'costs: 1' : ''"
                    >
                        {{ passivDetails[passivUpgrade.name].name }}
                        <br />
                        lvl: {{ passivUpgrade.lvl }}/{{
                            passivDetails[passivUpgrade.name].maxlvl + (passivUpgrade.name != 'none' ? findHouse(player, 'passiv') * 5 : 0)
                        }}
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
            if (passivUpgrade.name == 'none') return
            if (passivUpgrade.lvl < passivDetails[passivUpgrade.name].maxlvl + findHouse(this.player, 'passiv') * 5)
                if (this.player.passivTree.passivPoints - this.usedPassivPoints > 0) {
                    passivUpgrade.lvl++
                    this.buttonSound()
                }
        },
        async lvlPassivUpgradex8(passivUpgrade: type.PassivUpgrade) {
            if (passivUpgrade.name == 'none') return
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
