<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div title="you get 1 passivpoint per 2000 highscore in totalchaos mode">
            Passiv Points:
            <br />
            {{ player.passivTree.passivPoints - usedPassivPoints }}/{{ player.passivTree.passivPoints }}
        </div>
        <div>
            <div class="mt-2 w-25 btn btn-primary align-self-center shadow-none rounded-0 rounded-top">passiv:</div>
            <br />
            <select
                class="w-25 btn btn-primary align-self-center shadow-none rounded-0 rounded-bottom"
                v-model="player.passivTree.passivType"
                :title="passivDetails[player.passivTree.passivType]?.description"
                @click="buttonSound()"
            >
                <option
                    @click="buttonSound()"
                    :selected="passivAvaibleType == player.passivTree.passivType"
                    :value="passivAvaibleType"
                    v-for="passivAvaibleType of player.passivTree.passivAvaibleTypes"
                    :key="passivAvaibleType"
                    :title="passivDetails[passivAvaibleType]?.description"
                >
                    {{ passivAvaibleType }}
                </option>
                <option style="color: black" value="" v-if="player.passivTree.passivAvaibleTypes.length < passivAmount" disabled>
                    unlock more by fight the boss
                </option>
            </select>
        </div>
        <div v-for="passivUpgrade of player.passivTree.passivUpgrades" :key="passivUpgrade.name">
            <button
                class="mt-2 w-25 btn btn-primary align-self-center shadow-none"
                @click="lvlPassivUpgrade(passivUpgrade)"
                @dblclick="lvlPassivUpgradex8(passivUpgrade)"
                :title="passivDetails[passivUpgrade.name].description"
                v-if="passivUpgrade.name == player.passivTree.passivType"
            >
                {{ passivDetails[passivUpgrade.name].name }}
                <br />
                lvl: {{ passivUpgrade.lvl }}/{{ passivDetails[passivUpgrade.name].maxlvl }}
            </button>
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
import * as type from '@/types'
import * as music from '@/music'
export default defineComponent({
    setup() {
        currentUser
        return {
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
            if (passivUpgrade.lvl < passivDetails[passivUpgrade.name].maxlvl)
                if (this.player.passivTree.passivPoints - this.usedPassivPoints > 0) {
                    passivUpgrade.lvl++
                    this.buttonSound()
                }
        },
        async lvlPassivUpgradex8(passivUpgrade: type.PassivUpgrade) {
            for (let i = 0; i < 8; i++) {
                if (passivUpgrade.lvl < passivDetails[passivUpgrade.name].maxlvl)
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
