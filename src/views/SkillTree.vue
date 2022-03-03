<template>
    <div style="margin-top: 8vh" v-if="dataLoad">
        <div class="row g-0">
            <div style="width: 12.5%"></div>
            <div class="col-3" title="you get 1 skillpoint per 1000 highscore in normal mode">
                Skill Points:
                {{ player.skillTree.skillPoints - usedSkillPoints }}/{{ player.skillTree.skillPoints }}
            </div>
            <div style="width: 12.5%"></div>
            <div class="col-3" title="you get 1 weaponpoint per 500 highscore in hardcore mode">
                Weapon Points:
                {{ player.weaponTree.weaponPoints - usedWeaponPoints }}/{{ player.weaponTree.weaponPoints }}
            </div>

            <div class="col-3" title="you get 1 passivpoint per 2000 highscore in totalchaos mode">
                Passiv Points:
                {{ player.passivTree.passivPoints - usedPassivPoints }}/{{ player.passivTree.passivPoints }}
            </div>
        </div>

        <div class="row g-0">
            <div class="d-flex flex-column col-3">
                <div v-for="(skill, index) of player.skillTree.skills" :key="skill.name">
                    <button
                        v-if="index > 3"
                        class="mt-2 w-50 btn btn-primary align-self-center shadow-none"
                        @click="onClickSkill(skill)"
                        :title="skillDetails[skill.name].description"
                    >
                        {{ skillDetails[skill.name].name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{
                            skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? player.defeatedBossesTotalchaos : 0)
                        }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-3">
                <div v-for="(skill, index) of player.skillTree.skills" :key="skill.name">
                    <button
                        v-if="index < 4"
                        class="mt-2 w-50 btn btn-primary align-self-center shadow-none"
                        @click="onClickSkill(skill)"
                        :title="skillDetails[skill.name].description"
                    >
                        {{ skillDetails[skill.name].name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{
                            skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? player.defeatedBossesTotalchaos : 0)
                        }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-3">
                <div>
                    <div class="mt-2 w-50 btn btn-primary align-self-center shadow-none rounded-0 rounded-top">weapontype:</div>
                    <br />
                    <select
                        class="w-50 btn btn-primary align-self-center shadow-none rounded-0 rounded-bottom"
                        v-model="player.weaponTree.weaponType"
                        :title="weaponDetails[player.weaponTree.weaponType].description"
                    >
                        <option
                            :selected="weaponAvaibleType == player.weaponTree.weaponType"
                            :value="weaponAvaibleType"
                            v-for="weaponAvaibleType of player.weaponTree.weaponAvaibleTypes"
                            :key="weaponAvaibleType"
                            :title="weaponDetails[weaponAvaibleType].description"
                        >
                            {{ weaponAvaibleType }}
                        </option>
                        <option style="color: black" value="" v-if="player.weaponTree.weaponAvaibleTypes.length < 6" disabled>
                            unlock more by fight the boss
                        </option>
                    </select>
                </div>
                <div v-for="weaponUpgrade of player.weaponTree.weaponUpgrades" :key="weaponUpgrade.name">
                    <button
                        class="mt-2 w-50 btn btn-primary align-self-center shadow-none"
                        @click="onClickWeaponUgrade(weaponUpgrade)"
                        :title="weaponDetails[weaponUpgrade.name].description"
                    >
                        {{ weaponDetails[weaponUpgrade.name].name }}
                        <br />
                        lvl: {{ weaponUpgrade.lvl }}/{{ weaponDetails[weaponUpgrade.name].maxlvl }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-3">
                <div>
                    <div class="mt-2 w-50 btn btn-primary align-self-center shadow-none rounded-0 rounded-top">passiv:</div>
                    <br />
                    <select
                        class="w-50 btn btn-primary align-self-center shadow-none rounded-0 rounded-bottom"
                        v-model="player.passivTree.passivType"
                        :title="passivDetails[player.passivTree.passivType]?.description"
                    >
                        <option
                            :selected="passivAvaibleType == player.passivTree.passivType"
                            :value="passivAvaibleType"
                            v-for="passivAvaibleType of player.passivTree.passivAvaibleTypes"
                            :key="passivAvaibleType"
                            :title="passivDetails[passivAvaibleType]?.description"
                        >
                            {{ passivAvaibleType }}
                        </option>
                        <option style="color: black" value="" v-if="player.passivTree.passivAvaibleTypes.length < 5" disabled>
                            unlock more by fight the boss
                        </option>
                    </select>
                </div>
                <div v-for="passivUpgrade of player.passivTree.passivUpgrades" :key="passivUpgrade.name">
                    <button
                        class="mt-2 w-50 btn btn-primary align-self-center shadow-none"
                        @click="onClickPassivUgrade(passivUpgrade)"
                        :title="passivDetails[passivUpgrade.name].description"
                        v-if="passivUpgrade.name == player.passivTree.passivType"
                    >
                        {{ passivDetails[passivUpgrade.name].name }}
                        <br />
                        lvl: {{ passivUpgrade.lvl }}/{{ passivDetails[passivUpgrade.name].maxlvl }}
                    </button>
                </div>
            </div>
        </div>
        <div class="row g-0 mt-2">
            <div style="width: 12.5%"></div>
            <div class="col-3">
                <button class="btn btn-danger align-self-center shadow-none" @click="resetSkillTree()">reset Skilltree</button>
            </div>
            <div style="width: 12.5%"></div>
            <div class="col-3">
                <button class="btn btn-danger align-self-center shadow-none" @click="resetWeaponTree()">reset weapontree</button>
            </div>
            <div class="col-3">
                <button class="btn btn-danger align-self-center shadow-none" @click="resetPassivTree()">reset passivtree</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { checkPlayer, skillDetails, weaponDetails, passivDetails } from '@/global'
import { currentUser } from '@/router'
import * as API from '@/API'
import * as type from '@/types'
export default defineComponent({
    setup() {
        currentUser
        return {
            skillDetails,
            weaponDetails,
            passivDetails,
        }
    },
    data() {
        return {
            player: {} as type.Player,
            timer: 0,
            clicks: 0,
            user: currentUser,
            dataLoad: false,
            counter: 0,
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
        this.player.skillTree.skills
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .sort((a, b) => (skillDetails[a.name].maxlvl < skillDetails[b.name].maxlvl ? -1 : 1))
        if (this.usedSkillPoints > this.player.skillTree.skillPoints) {
            this.resetSkillTree()
        }
        this.dataLoad = true
    },

    computed: {
        usedSkillPoints() {
            let allSkilllvl = 0
            for (let skill of this.player.skillTree.skills) {
                allSkilllvl += skill.lvl
            }
            return allSkilllvl
        },
        usedWeaponPoints() {
            let allWeaponlvl = 0
            for (let weaponUpgrade of this.player.weaponTree.weaponUpgrades) {
                allWeaponlvl += weaponUpgrade.lvl
            }
            return allWeaponlvl
        },
        usedPassivPoints() {
            let allPassivlvl = 0
            for (let passivUpgrade of this.player.passivTree.passivUpgrades) {
                allPassivlvl += passivUpgrade.lvl
            }
            return allPassivlvl
        },
    },
    methods: {
        async lvlSkill(skill: type.Skill, counter: number) {
            while (counter) {
                if (skill.lvl < skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? this.player.defeatedBossesTotalchaos : 0))
                    if (this.player.skillTree.skillPoints - this.usedSkillPoints > 0) {
                        skill.lvl++
                    }
                counter--
            }
        },
        async lvlWeaponUpgrade(weaponUpgrade: type.WeaponUpgrade, counter: number) {
            while (counter) {
                if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
                    if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints > 0) {
                        weaponUpgrade.lvl++
                    }
                counter--
            }
        },
        async lvlPassivUpgrade(passivUpgrade: type.PassivUpgrade, counter: number) {
            while (counter) {
                if (passivUpgrade.lvl < passivDetails[passivUpgrade.name].maxlvl)
                    if (this.player.passivTree.passivPoints - this.usedPassivPoints > 0) {
                        passivUpgrade.lvl++
                    }
                counter--
            }
        },
        async resetSkillTree() {
            this.player.skillTree.skillPoints -= this.usedSkillPoints
            for (let skill of this.player.skillTree.skills) {
                this.player.skillTree.skillPoints += skill.lvl
                skill.lvl = 0
            }
        },
        async resetWeaponTree() {
            this.player.weaponTree.weaponPoints -= this.usedWeaponPoints
            for (let weaponUpgrade of this.player.weaponTree.weaponUpgrades) {
                this.player.weaponTree.weaponPoints += weaponUpgrade.lvl
                weaponUpgrade.lvl = 0
            }
        },
        async resetPassivTree() {
            this.player.passivTree.passivPoints -= this.usedPassivPoints
            for (let passivUpgrade of this.player.passivTree.passivUpgrades) {
                this.player.passivTree.passivPoints += passivUpgrade.lvl
                passivUpgrade.lvl = 0
            }
        },

        onClickSkill(skill: type.Skill) {
            this.clicks++
            if (this.clicks === 1) {
                this.timer = setTimeout(() => {
                    this.lvlSkill(skill, 1)
                    this.clicks = 0
                }, 200)
            } else {
                clearTimeout(this.timer)
                this.lvlSkill(skill, 10)
                this.clicks = 0
            }
        },
        onClickWeaponUgrade(weaponUpgrade: type.WeaponUpgrade) {
            this.clicks++
            if (this.clicks === 1) {
                this.timer = setTimeout(() => {
                    this.lvlWeaponUpgrade(weaponUpgrade, 1)
                    this.clicks = 0
                }, 200)
            } else {
                clearTimeout(this.timer)
                this.lvlWeaponUpgrade(weaponUpgrade, 10)
                this.clicks = 0
            }
        },
        onClickPassivUgrade(passivUpgrade: type.PassivUpgrade) {
            this.clicks++
            if (this.clicks === 1) {
                this.timer = setTimeout(() => {
                    this.lvlPassivUpgrade(passivUpgrade, 1)
                    this.clicks = 0
                }, 200)
            } else {
                clearTimeout(this.timer)
                this.lvlPassivUpgrade(passivUpgrade, 10)
                this.clicks = 0
            }
        },
    },
})
</script>
