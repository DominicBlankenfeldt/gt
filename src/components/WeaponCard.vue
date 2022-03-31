<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div>
            <div>
                <div data-title="you get 1 weaponpoint per 500 highscore in hardcore mode" class="w-25 d-inline">
                    Weapon Points:
                    <br />
                    {{ player.weaponTree.weaponPoints - usedWeaponPoints }}/{{ player.weaponTree.weaponPoints }}
                </div>
            </div>
            <div class="mt-2 w-25 btn btn-primary shadow-none rounded-0 rounded-top">weapontype:</div>
            <br />
            <select
                class="w-25 btn btn-primary shadow-none rounded-0 rounded-bottom"
                v-model="player.weaponTree.weaponType"
                :title="weaponDetails[player.weaponTree.weaponType].description"
                @click="buttonSound()"
            >
                <option
                    :selected="weaponAvaibleType == player.weaponTree.weaponType"
                    :value="weaponAvaibleType"
                    v-for="weaponAvaibleType of player.weaponTree.weaponAvaibleTypes"
                    :key="weaponAvaibleType"
                    :title="weaponDetails[weaponAvaibleType].description"
                    @click="buttonSound()"
                >
                    {{ weaponAvaibleType }}
                </option>
                <option style="color: black" value="" v-if="player.weaponTree.weaponAvaibleTypes.length < weaponAmount" disabled>
                    unlock more by fight the boss
                </option>
            </select>
        </div>
        <div v-for="weaponUpgrade of player.weaponTree.weaponUpgrades" :key="weaponUpgrade.name">
            <button
                class="mt-2 w-25 btn btn-primary shadow-none"
                @click="lvlWeaponUpgrade(weaponUpgrade)"
                @dblclick="lvlWeaponUpgradex8(weaponUpgrade)"
                :data-title="weaponDetails[weaponUpgrade.name].description"
                :line2="`costs: ${weaponDetails[weaponUpgrade.name].tier}`"
                :disabled="weaponDetails[weaponUpgrade.name].tier == 10 && usedWeaponPoints < 30"
            >
                {{ weaponDetails[weaponUpgrade.name].name }}
                <br />
                lvl: {{ weaponUpgrade.lvl }}/{{ weaponDetails[weaponUpgrade.name].maxlvl }}
            </button>
        </div>
        <div class="mt-2">
            <button class="btn btn-danger shadow-none" @click="resetWeaponTree()">reset weapontree</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { weaponDetails, weaponAmount } from '@/global'
import * as music from '@/music'
import * as type from '@/types'

export default defineComponent({
    setup() {
        currentUser
        return {
            weaponDetails,
            weaponAmount,
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
        usedWeaponPoints() {
            let allWeaponlvl = 0
            for (let weaponUpgrade of this.player.weaponTree.weaponUpgrades)
                allWeaponlvl += weaponUpgrade.lvl * weaponDetails[weaponUpgrade.name].tier
            return allWeaponlvl
        },
    },
    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
    },
    methods: {
        lvlWeaponUpgrade(weaponUpgrade: type.WeaponUpgrade) {
            if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
                if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints >= weaponDetails[weaponUpgrade.name].tier) {
                    weaponUpgrade.lvl++
                    this.buttonSound()
                }
        },
        lvlWeaponUpgradex8(weaponUpgrade: type.WeaponUpgrade) {
            for (let i = 0; i < 8; i++) {
                if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
                    if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints > 0) {
                        weaponUpgrade.lvl++
                    }
            }
        },
        resetWeaponTree() {
            this.buttonSound()
            this.player.weaponTree.weaponPoints -= this.usedWeaponPoints
            for (let weaponUpgrade of this.player.weaponTree.weaponUpgrades) {
                this.player.weaponTree.weaponPoints += weaponUpgrade.lvl * weaponDetails[weaponUpgrade.name].tier
                weaponUpgrade.lvl = 0
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>

<style scoped lang="scss"></style>
