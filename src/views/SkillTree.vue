<template>
    <div style="margin-top: 8vh">
        <div class="row g-0">
            <div class="col-2"></div>
            <div class="col-4">
                Skill Points:
                {{ player.skillTree.skillPoints - usedSkillPoints }}/{{ player.skillTree.skillPoints }}
            </div>
            <div class="col-2"></div>
            <div class="col-4">
                Weapon Points:
                {{ player.weaponTree.weaponPoints - usedWeaponPoints }}/{{ player.weaponTree.weaponPoints }}
            </div>
        </div>

        <div class="row g-0">
            <div class="d-flex flex-column col-4">
                <div v-for="(skill, index) of player.skillTree.skills" :key="skill.name">
                    <button v-if="index > 3" class="mt-2 w-50 btn btn-primary align-self-center shadow-none" @click="onClickSkill(skill)">
                        {{ skill.name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{ skill.maxlvl }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-4">
                <div v-for="(skill, index) of player.skillTree.skills" :key="skill.name">
                    <button v-if="index < 4" class="mt-2 w-50 btn btn-primary align-self-center shadow-none" @click="onClickSkill(skill)">
                        {{ skill.name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{ skill.maxlvl }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-4">
                <div v-for="weaponUpgrade of player.weaponTree.weaponUpgrades" :key="weaponUpgrade.name">
                    <button class="mt-2 w-50 btn btn-primary align-self-center shadow-none" @click="onClickSkill(skill)">
                        {{ weaponUpgrade.name }}
                        <br />
                        lvl: {{ weaponUpgrade.lvl }}/{{ weaponUpgrade.maxlvl }}
                    </button>
                </div>
            </div>
        </div>
        <div class="row g-0 mt-2">
            <div class="col-2"></div>
            <div class="col-4">
                <button class="btn btn-danger align-self-center shadow-none" @click="resetSkillTree()">reset Skilltree</button>
            </div>
            <div class="col-2"></div>
            <div class="col-4">
                <button class="btn btn-danger align-self-center shadow-none" @click="resetWeaponTree()">reset weapontree</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { checkPlayer, player } from '@/global'
import * as API from '@/API'
import * as type from '@/types'
export default defineComponent({
    setup() {
        player
    },
    async mounted() {
        let result = await API.getPlayer()
        if (result) {
            this.player = result.player
        }
        this.player = checkPlayer(this.player) as type.Player
        this.player.skillTree.skills.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (a.maxlvl < b.maxlvl ? -1 : 1))
    },
    data() {
        return {
            player: player.value as type.Player,
            timer: 0,
            clicks: 0,
        }
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
    },
    methods: {
        async lvlSkill(skill: type.Skill, counter: number) {
            while (counter) {
                if (!(skill.lvl < skill.maxlvl)) return
                if (!(this.player.skillTree.skillPoints - this.usedSkillPoints > 0)) return
                skill.lvl++
                counter--
            }
            await API.addPlayer(this.player)
        },
        async lvlWeaponUpgrade(weaponUpgrade: type.WeaponUpgrade, counter: number) {
            while (counter) {
                if (!(weaponUpgrade.lvl < weaponUpgrade.maxlvl)) return
                if (!(this.player.weaponTree.weaponPoints - this.usedWeaponPoints > 0)) return
                weaponUpgrade.lvl++
                counter--
            }
            await API.addPlayer(this.player)
        },
        async resetSkillTree() {
            this.player.skillTree.skillPoints -= this.usedSkillPoints
            for (let skill of this.player.skillTree.skills) {
                this.player.skillTree.skillPoints += skill.lvl
                skill.lvl = 0
            }
            await API.addPlayer(this.player)
        },
        async resetWeaponTree() {
            this.player.weaponTree.weaponPoints -= this.usedWeaponPoints
            for (let weaponUpgrade of this.player.weaponTree.weaponUpgrades) {
                this.player.weaponTree.weaponPoints += weaponUpgrade.lvl
                weaponUpgrade.lvl = 0
            }
            await API.addPlayer(this.player)
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
    },
})
</script>
