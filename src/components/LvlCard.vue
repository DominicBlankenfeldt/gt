<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div>
            <div data-title="you can lvl up by make the daily tasks" class="w-25 d-inline">
                lvl:{{ player.lvlTree.lvl }}
                <br />
                used:{{ usedLvl }}/{{ player.lvlTree.lvl - 1 }}
            </div>
        </div>
        <div class="row g-0 mt-2">
            <div class="col-2"></div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="skill of player.lvlTree.lvlSkills" :key="skill.name">
                    <button
                        @click="lvlUpgrade(skill)"
                        :disabled="
                            (skill.name == 'tier2' && findlvlSkill(player, 'tier1') < 5) ||
                            (skill.name == 'tier3' && findlvlSkill(player, 'tier2') < 5)
                        "
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        :data-title="
                            lvlSkillsDetails[skill.name].description +
                            '\n' +
                            (skill.lvl < lvlSkillsDetails[skill.name].maxlvl ? `costs: 1` : 'max lvl')
                        "
                    >
                        {{ lvlSkillsDetails[skill.name].name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{ lvlSkillsDetails[skill.name].maxlvl }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="lvlWeaponUpgrade of player.lvlTree.lvlWeaponUpgrade" :key="lvlWeaponUpgrade.name">
                    <button
                        @click="lvlUpgrade(lvlWeaponUpgrade)"
                        :disabled="lvlWeaponUpgrade.name == 'tier2' && findlvlWeaponUpgrade(player, 'tier1') < 5"
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        :data-title="
                            lvlWeaponUpgradeDetails[lvlWeaponUpgrade.name].description +
                            '\n' +
                            (lvlWeaponUpgrade.lvl < lvlWeaponUpgradeDetails[lvlWeaponUpgrade.name].maxlvl ? `costs: 1` : 'max lvl')
                        "
                    >
                        {{ lvlWeaponUpgradeDetails[lvlWeaponUpgrade.name].name }}
                        <br />
                        lvl: {{ lvlWeaponUpgrade.lvl }}/{{ lvlWeaponUpgradeDetails[lvlWeaponUpgrade.name].maxlvl }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="passiv of player.lvlTree.lvlPassiv" :key="passiv.name">
                    <button
                        @click="lvlUpgrade(passiv)"
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        :data-title="
                            lvlPassivDetails[passiv.name].description +
                            '\n' +
                            (passiv.lvl < lvlPassivDetails[passiv.name].maxlvl ? `costs: 1` : 'max lvl')
                        "
                    >
                        {{ lvlPassivDetails[passiv.name].name }}
                        <br />
                        lvl: {{ passiv.lvl }}/{{ lvlPassivDetails[passiv.name].maxlvl }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="shop of player.lvlTree.lvlShop" :key="shop.name">
                    <button
                        @click="lvlUpgrade(shop)"
                        :disabled="shop.name == 'tier2' && findlvlShop(player, 'tier1') < 5"
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        :data-title="
                            lvlShopDetails[shop.name].description + '\n' + (shop.lvl < lvlShopDetails[shop.name].maxlvl ? `costs: 1` : 'max lvl')
                        "
                    >
                        {{ lvlShopDetails[shop.name].name }}
                        <br />
                        lvl: {{ shop.lvl }}/{{ lvlShopDetails[shop.name].maxlvl }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { lvlSkillsDetails, lvlWeaponUpgradeDetails, lvlPassivDetails, lvlShopDetails } from '@/global'
import { findlvlSkill, findlvlWeaponUpgrade, findlvlPassiv, findlvlShop } from '@/game/helpers'
import * as type from '@/types'
import * as music from '@/music'

export default defineComponent({
    setup() {
        currentUser
        return {
            lvlSkillsDetails,
            lvlWeaponUpgradeDetails,
            lvlPassivDetails,
            lvlShopDetails,
            findlvlSkill,
            findlvlWeaponUpgrade,
            findlvlPassiv,
            findlvlShop,
        }
    },
    data() {
        return {
            player: {} as type.Player,
            user: currentUser,
            dataLoad: false,
            pressedKeys: {} as Record<string, boolean>,
        }
    },
    props: {
        playerProp: {
            type: Object as PropType<type.Player>,
            required: true,
        },
    },
    computed: {
        usedLvl() {
            let allPassivlvl = 0
            for (let lvlSkill of this.player.lvlTree.lvlSkills) allPassivlvl += lvlSkill.lvl
            for (let lvlWeaponUpgrade of this.player.lvlTree.lvlWeaponUpgrade) allPassivlvl += lvlWeaponUpgrade.lvl
            for (let lvlPassiv of this.player.lvlTree.lvlPassiv) allPassivlvl += lvlPassiv.lvl
            for (let lvlShop of this.player.lvlTree.lvlShop) allPassivlvl += lvlShop.lvl
            return allPassivlvl
        },
    },
    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
    },
    methods: {
        lvlUpgrade(upgrade: type.LvlSkill) {
            if (this.usedLvl >= this.player.lvlTree.lvl - 1) return
            upgrade.lvl++
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>

<style scoped lang="scss"></style>
