<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div>
            <div data-title="you get 1 skillpoint per 1000 highscore in normal mode" class="w-25 d-inline">
                Skill Points:
                <br />
                {{ player.skillTree.skillPoints - usedSkillPoints }}/{{ player.skillTree.skillPoints }}
            </div>
        </div>
        <div class="row g-0 mt-2">
            <div class="col-1"></div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="skill of tier1Skills" :key="skill.name">
                    <button
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        @click="lvlSkill(skill)"
                        @dblclick="lvlSkillx8(skill)"
                        :data-title="skillDetails[skill.name].description"
                        :line2="`costs: ${skillDetails[skill.name].tier}`"
                    >
                        {{ skillDetails[skill.name].name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{
                            skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? player.defeatedBossesTotalchaos : 0)
                        }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="skill of tier1Abilitys" :key="skill.name">
                    <button
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        @click="lvlSkill(skill)"
                        @dblclick="lvlSkillx8(skill)"
                        :data-title="skillDetails[skill.name].description"
                        :line2="`costs: ${skillDetails[skill.name].tier}`"
                    >
                        {{ skillDetails[skill.name].name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{
                            skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? player.defeatedBossesTotalchaos : 0)
                        }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="skill of tier2Skills" :key="skill.name">
                    <button
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        @click="lvlSkill(skill)"
                        @dblclick="lvlSkillx8(skill)"
                        :data-title="skillDetails[skill.name].description"
                        :line2="`costs: ${skillDetails[skill.name].tier}`"
                        :disabled="usedSkillPoints < 100"
                    >
                        {{ skillDetails[skill.name].name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{
                            skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? player.defeatedBossesTotalchaos : 0)
                        }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="skill of tier2Abilitys" :key="skill.name">
                    <button
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        @click="lvlSkill(skill)"
                        @dblclick="lvlSkillx8(skill)"
                        :data-title="skillDetails[skill.name].description"
                        :line2="`costs: ${skillDetails[skill.name].tier}`"
                        :disabled="usedSkillPoints < 100"
                    >
                        {{ skillDetails[skill.name].name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{
                            skillDetails[skill.name].maxlvl + (skillDetails[skill.name].maxlvl > 1 ? player.defeatedBossesTotalchaos : 0)
                        }}
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column col-2 mx-1">
                <div v-for="skill of tier3Skills" :key="skill.name">
                    <button
                        class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                        @click="lvlSkill(skill)"
                        @dblclick="lvlSkillx8(skill)"
                        :data-title="skillDetails[skill.name].description"
                        :line2="`costs: ${skillDetails[skill.name].tier}`"
                        :disabled="usedSkillPoints < 200"
                    >
                        {{ skillDetails[skill.name].name }}
                        <br />
                        lvl: {{ skill.lvl }}/{{ skillDetails[skill.name].maxlvl }}
                    </button>
                </div>
            </div>
            <div class="mt-2">
                <button class="btn btn-danger align-self-center shadow-none" @click="resetSkillTree()">reset Skilltree</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { skillDetails } from '@/global'
import * as type from '@/types'
import * as music from '@/music'

export default defineComponent({
    setup() {
        currentUser
        return {
            skillDetails,
        }
    },
    props: {
        playerProp: {
            type: Object as PropType<type.Player>,
            required: true,
        },
    },
    data() {
        return {
            player: {} as type.Player,
            timer: 0,
            user: currentUser,
            dataLoad: false,
        }
    },
    computed: {
        tier1Skills() {
            let tier1 = [] as type.Skill[]
            for (let skill of this.player.skillTree.skills) {
                if (skillDetails[skill.name].tier == 1 && skillDetails[skill.name].maxlvl != 1) {
                    tier1.push(skill)
                }
            }
            tier1.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (skillDetails[a.name].maxlvl < skillDetails[b.name].maxlvl ? -1 : 1))
            return tier1
        },
        tier1Abilitys() {
            let tier1 = [] as type.Skill[]
            for (let skill of this.player.skillTree.skills) {
                if (skillDetails[skill.name].tier == 1 && skillDetails[skill.name].maxlvl == 1) {
                    tier1.push(skill)
                }
            }
            tier1.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (skillDetails[a.name].maxlvl < skillDetails[b.name].maxlvl ? -1 : 1))
            return tier1
        },
        tier2Skills() {
            let tier2 = [] as type.Skill[]
            for (let skill of this.player.skillTree.skills) {
                if (skillDetails[skill.name].tier == 2 && skillDetails[skill.name].maxlvl != 1) {
                    tier2.push(skill)
                }
            }
            tier2.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (skillDetails[a.name].maxlvl < skillDetails[b.name].maxlvl ? -1 : 1))
            return tier2
        },
        tier2Abilitys() {
            let tier2 = [] as type.Skill[]
            for (let skill of this.player.skillTree.skills) {
                if (skillDetails[skill.name].tier == 2 && skillDetails[skill.name].maxlvl == 1) {
                    tier2.push(skill)
                }
            }
            tier2.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (skillDetails[a.name].maxlvl < skillDetails[b.name].maxlvl ? -1 : 1))
            return tier2
        },
        tier3Skills() {
            let tier3 = [] as type.Skill[]
            for (let skill of this.player.skillTree.skills) {
                if (skillDetails[skill.name].tier == 3 && skillDetails[skill.name].maxlvl != 1) {
                    tier3.push(skill)
                }
            }
            tier3.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (skillDetails[a.name].maxlvl < skillDetails[b.name].maxlvl ? -1 : 1))
            return tier3
        },
        usedSkillPoints() {
            let allSkilllvl = 0
            for (let skill of this.player.skillTree.skills) allSkilllvl += skill.lvl * skillDetails[skill.name].tier
            return allSkilllvl
        },
    },
    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
    },
    methods: {
        lvlSkill(skill: type.Skill) {
            if (
                skill.lvl <
                skillDetails[skill.name].maxlvl +
                    (skillDetails[skill.name].maxlvl > 1 && skillDetails[skill.name].tier < 3 ? this.player.defeatedBossesTotalchaos : 0)
            )
                if (this.player.skillTree.skillPoints - this.usedSkillPoints >= skillDetails[skill.name].tier) {
                    skill.lvl++
                    this.buttonSound()
                    if (skillDetails[skill.name].maxlvl == 1) {
                        for (let i = 1 as 1 | 2 | 3 | 4; i < 5; i++) {
                            if (!this.player.settings.abilitys[i].name) {
                                this.player.settings.abilitys[i].name = skill.name as type.AbilityName
                                return
                            }
                        }
                    }
                }
        },
        lvlSkillx8(skill: type.Skill) {
            for (let i = 0; i < 8; i++) {
                if (
                    skill.lvl <
                    skillDetails[skill.name].maxlvl +
                        (skillDetails[skill.name].maxlvl > 1 && skillDetails[skill.name].tier < 3 ? this.player.defeatedBossesTotalchaos : 0)
                )
                    if (this.player.skillTree.skillPoints - this.usedSkillPoints >= skillDetails[skill.name].tier) {
                        skill.lvl++
                    }
            }
        },
        resetSkillTree() {
            this.buttonSound()
            this.player.skillTree.skillPoints -= this.usedSkillPoints
            for (let skill of this.player.skillTree.skills) {
                this.player.skillTree.skillPoints += skill.lvl * skillDetails[skill.name].tier
                skill.lvl = 0
            }
            for (let i = 1 as 1 | 2 | 3 | 4; i < 5; i++) {
                this.player.settings.abilitys[i].name = '' as type.AbilityName
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>

<style scoped lang="scss"></style>
