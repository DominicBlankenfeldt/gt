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
                        @click="lvlSkill(skill)"
                        @dblclick="lvlSkillx8(skill)"
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
                        @click="lvlSkill(skill)"
                        @dblclick="lvlSkillx8(skill)"
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
                        <option style="color: black" value="" v-if="player.weaponTree.weaponAvaibleTypes.length < 6" disabled>
                            unlock more by fight the boss
                        </option>
                    </select>
                </div>
                <div v-for="weaponUpgrade of player.weaponTree.weaponUpgrades" :key="weaponUpgrade.name">
                    <button
                        class="mt-2 w-50 btn btn-primary align-self-center shadow-none"
                        @click="lvlWeaponUpgrade(weaponUpgrade)"
                        @dblclick="lvlWeaponUpgradex8(weaponUpgrade)"
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
                        <option style="color: black" value="" v-if="player.passivTree.passivAvaibleTypes.length < 6" disabled>
                            unlock more by fight the boss
                        </option>
                    </select>
                </div>
                <div v-for="passivUpgrade of player.passivTree.passivUpgrades" :key="passivUpgrade.name">
                    <button
                        class="mt-2 w-50 btn btn-primary align-self-center shadow-none"
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
import * as music from '@/music'
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
        this.player.skillTree.skills
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .sort((a, b) => (skillDetails[a.name].maxlvl < skillDetails[b.name].maxlvl ? -1 : 1))
        if (this.usedSkillPoints > this.player.skillTree.skillPoints) {
            this.resetSkillTree()
        }
        this.buttonSound()
        this.dataLoad = true
    },

    computed: {
        usedSkillPoints() {
            let allSkilllvl = 0
            for (let skill of this.player.skillTree.skills) {
                allSkilllvl += skill.lvl * skillDetails[skill.name].tier
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
        async lvlSkill(skill: type.Skill) {
            if (skill.lvl < skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? this.player.defeatedBossesTotalchaos : 0))
                if (this.player.skillTree.skillPoints - this.usedSkillPoints >= skillDetails[skill.name].tier) {
                    skill.lvl++
                    this.buttonSound()
                }
        },
        async lvlWeaponUpgrade(weaponUpgrade: type.WeaponUpgrade) {
            if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
                if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints > 0) {
                    weaponUpgrade.lvl++
                    this.buttonSound()
                }
        },
        async lvlPassivUpgrade(passivUpgrade: type.PassivUpgrade) {
            if (passivUpgrade.lvl < passivDetails[passivUpgrade.name].maxlvl)
                if (this.player.passivTree.passivPoints - this.usedPassivPoints > 0) {
                    passivUpgrade.lvl++
                    this.buttonSound()
                }
        },
        async lvlSkillx8(skill: type.Skill) {
            for (let i = 0; i < 8; i++) {
                if (skill.lvl < skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? this.player.defeatedBossesTotalchaos : 0))
                    if (this.player.skillTree.skillPoints - this.usedSkillPoints >= skillDetails[skill.name].tier) {
                        skill.lvl++
                    }
            }
        },
        async lvlWeaponUpgradex8(weaponUpgrade: type.WeaponUpgrade) {
            for (let i = 0; i < 8; i++) {
                if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
                    if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints > 0) {
                        weaponUpgrade.lvl++
                    }
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
        async resetSkillTree() {
            this.buttonSound()
            this.player.skillTree.skillPoints -= this.usedSkillPoints
            for (let skill of this.player.skillTree.skills) {
                this.player.skillTree.skillPoints += skill.lvl * skillDetails[skill.name].tier
                skill.lvl = 0
            }
        },
        async resetWeaponTree() {
            this.buttonSound()
            this.player.weaponTree.weaponPoints -= this.usedWeaponPoints
            for (let weaponUpgrade of this.player.weaponTree.weaponUpgrades) {
                this.player.weaponTree.weaponPoints += weaponUpgrade.lvl
                weaponUpgrade.lvl = 0
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
