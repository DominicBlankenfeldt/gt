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
        <div class="row g-0 mt-2">
            <div class="col-3"></div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="weaponUpgrade of tier1Upgrades" :key="weaponUpgrade.name">
                    <button
                        class="mt-2 w-100 btn btn-primary shadow-none"
                        @click="lvlWeaponUpgrade(weaponUpgrade)"
                        @dblclick="lvlWeaponUpgradex8(weaponUpgrade)"
                        :data-title="weaponDetails[weaponUpgrade.name].description"
                        :line2="`costs: ${weaponDetails[weaponUpgrade.name].tier}`"
                    >
                        {{ weaponDetails[weaponUpgrade.name].name }}
                        <br />
                        lvl: {{ weaponUpgrade.lvl }}/{{ weaponDetails[weaponUpgrade.name].maxlvl + findHouse(player, 'weapon') * 3 }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="weaponUpgrade of tier2Upgrades" :key="weaponUpgrade.name">
                    <button
                        class="mt-2 w-100 btn btn-primary shadow-none"
                        @click="lvlWeaponUpgrade(weaponUpgrade)"
                        @dblclick="lvlWeaponUpgradex8(weaponUpgrade)"
                        :data-title="weaponDetails[weaponUpgrade.name].description"
                        :line2="`costs: ${weaponDetails[weaponUpgrade.name].tier}`"
                        :disabled="usedWeaponPoints < 40"
                    >
                        {{ weaponDetails[weaponUpgrade.name].name }}
                        <br />
                        lvl: {{ weaponUpgrade.lvl }}/{{ weaponDetails[weaponUpgrade.name].maxlvl + findHouse(player, 'weapon') * 2 }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="weaponUpgrade of tier10Upgrades" :key="weaponUpgrade.name">
                    <button
                        class="mt-2 w-100 btn btn-primary shadow-none"
                        @click="lvlWeaponUpgrade(weaponUpgrade)"
                        @dblclick="lvlWeaponUpgradex8(weaponUpgrade)"
                        :data-title="weaponDetails[weaponUpgrade.name].description"
                        :line2="`costs: ${weaponDetails[weaponUpgrade.name].tier}`"
                        :disabled="usedWeaponPoints < 70"
                    >
                        {{ weaponDetails[weaponUpgrade.name].name }}
                        <br />
                        lvl: {{ weaponUpgrade.lvl }}/{{ weaponDetails[weaponUpgrade.name].maxlvl }}
                    </button>
                </div>
            </div>
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
import { findHouse } from '@/game/helpers'
import * as music from '@/music'
import * as type from '@/types'

export default defineComponent({
    setup() {
        currentUser
        return {
            weaponDetails,
            weaponAmount,
            findHouse,
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
        tier1Upgrades() {
            let tier1 = [] as type.WeaponUpgrade[]
            for (let upgrade of this.player.weaponTree.weaponUpgrades) {
                if (weaponDetails[upgrade.name].tier == 1 && weaponDetails[upgrade.name].maxlvl != 1) {
                    tier1.push(upgrade)
                }
            }
            tier1.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (weaponDetails[a.name].maxlvl < weaponDetails[b.name].maxlvl ? -1 : 1))
            return tier1
        },
        tier2Upgrades() {
            let tier2 = [] as type.WeaponUpgrade[]
            for (let upgrade of this.player.weaponTree.weaponUpgrades) {
                if (weaponDetails[upgrade.name].tier == 2 && weaponDetails[upgrade.name].maxlvl != 1) {
                    tier2.push(upgrade)
                }
            }
            tier2.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (weaponDetails[a.name].maxlvl < weaponDetails[b.name].maxlvl ? -1 : 1))
            return tier2
        },
        tier10Upgrades() {
            let tier10 = [] as type.WeaponUpgrade[]
            for (let upgrade of this.player.weaponTree.weaponUpgrades) {
                if (weaponDetails[upgrade.name].tier == 10 && weaponDetails[upgrade.name].maxlvl != 1) {
                    tier10.push(upgrade)
                }
            }
            tier10.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (weaponDetails[a.name].maxlvl < weaponDetails[b.name].maxlvl ? -1 : 1))
            return tier10
        },
    },
    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
    },
    methods: {
        lvlWeaponUpgrade(weaponUpgrade: type.WeaponUpgrade) {
            if (weaponDetails[weaponUpgrade.name].tier < 10) {
                if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl + findHouse(this.player, 'weapon') * 2)
                    if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints >= weaponDetails[weaponUpgrade.name].tier) {
                        weaponUpgrade.lvl++
                        this.buttonSound()
                    }
            } else {
                if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
                    if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints >= weaponDetails[weaponUpgrade.name].tier) {
                        weaponUpgrade.lvl++
                        this.buttonSound()
                    }
            }
        },
        lvlWeaponUpgradex8(weaponUpgrade: type.WeaponUpgrade) {
            for (let i = 0; i < 8; i++) {
                if (weaponDetails[weaponUpgrade.name].tier < 10) {
                    if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl + findHouse(this.player, 'weapon') * 2)
                        if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints > 0) {
                            weaponUpgrade.lvl++
                        }
                } else {
                    if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
                        if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints >= weaponDetails[weaponUpgrade.name].tier) {
                            weaponUpgrade.lvl++
                            this.buttonSound()
                        }
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
