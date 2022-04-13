<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div class="d-flex justify-content-center">
            <div class="btn-group rounded mt-2" role="group" aria-label="Basic radio toggle button group">
                <div v-for="weapon of player.weaponTree.weaponAvaibleTypes" :key="weapon" class="mx-1">
                    <input
                        type="radio"
                        class="btn-check"
                        name="weaponRadio"
                        :id="`btn${weapon}`"
                        autocomplete="off"
                        :checked="player.weaponTree.weaponType == weapon"
                    />
                    <label
                        class="btn btn-outline-primary w-100 shadow-none"
                        style="height: 12vh"
                        :data-title="weaponDetails[weapon].description"
                        :for="`btn${weapon}`"
                        @click="
                            {
                                ;(player.weaponTree.weaponType = weapon), buttonSound()
                            }
                        "
                    >
                        {{ weapon }}
                        <br />
                        dmg:{{ weaponStats[weapon].dmg }}
                        <br />
                        reload:{{ weaponStats[weapon].reload }}s
                        <br />
                        size:{{ weaponStats[weapon].size }}
                        <br />
                        plasmas:{{ weaponStats[weapon].spheres }}
                    </label>
                </div>
            </div>
        </div>
        <div class="mt-2">{{ player.passivTree.passivType.length }}/{{ player.shop.passivSlots.lvl }}</div>
        <div class="d-flex justify-content-center">
            <div v-for="passiv of player.passivTree.passivAvaibleTypes" :key="passiv" class="mx-1">
                <button
                    v-if="player.passivTree.passivAvaibleTypes.length <= 1 || passiv != 'none'"
                    @click="selectPassiv(passiv)"
                    @dblclick="clearSelect(passiv)"
                    style="height: 12vh"
                    class="btn shadow-none"
                    :class="player.passivTree.passivType.includes(passiv) ? 'btn-primary' : 'btn-outline-primary'"
                    :data-title="passivDetails[passiv].description"
                >
                    {{ passivDetails[passiv].name }}
                </button>
            </div>
        </div>
        <div class="mt-2">{{ player.ship.models.length }}/{{ findHouse(player, 'hangar') }}</div>
        <div class="d-flex justify-content-center">
            <div v-for="model of player.ship.models" :key="model.id" class="mx-1">
                <input
                    type="radio"
                    class="btn-check"
                    name="modelRadio"
                    :id="`model${model.id}`"
                    autocomplete="off"
                    :checked="player.ship.selectedModel.id == model.id"
                />
                <label
                    class="btn btn-outline-primary w-100 shadow-none"
                    style="height: 25vh"
                    :for="`model${model.id}`"
                    @click="
                        {
                            ;(player.ship.selectedModel = model), buttonSound()
                        }
                    "
                >
                    <div :style="{ color: modelDetails[model.rarity].color }">
                        {{ model.rarity }}
                    </div>
                    <div class="mt-1">
                        <img :src="`/gt/img/char/playership${model.img}.png`" alt="" style="height: 6vh; width: 6vh" />
                    </div>
                    <br />
                    HP:{{ modelDetails[model.rarity].hp }}
                    <br />
                    size:{{ modelDetails[model.rarity].size }}
                    <br />
                    speed:{{ modelDetails[model.rarity].speed }}
                    <br />
                    store:{{ modelDetails[model.rarity].store }}
                    <br />
                    scoreMultiplier:{{ modelDetails[model.rarity].scoreMultiplier }}
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { passivDetails, weaponDetails, passivAmount, weaponStats, modelDetails } from '@/global'
import { findHouse } from '@/game/helpers'
import * as type from '@/types'
import * as music from '@/music'

export default defineComponent({
    setup() {
        currentUser
        return {
            findHouse,
            passivDetails,
            weaponDetails,
            modelDetails,
            passivAmount,
            weaponStats,
        }
    },
    data() {
        return {
            player: {} as type.Player,
            user: currentUser,
            choosenWeapon: '',
            choosenPassivs: [] as type.PassivType[],
            dataLoad: false,
        }
    },
    props: {
        playerProp: {
            type: Object as PropType<type.Player>,
            required: true,
        },
    },
    computed: {},
    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
    },
    methods: {
        selectPassiv(passiv: type.PassivType) {
            if (this.player.passivTree.passivType.includes(passiv)) {
                this.player.passivTree.passivType = this.player.passivTree.passivType.filter(p => p != passiv)
            } else {
                if (this.player.passivTree.passivType.length < this.player.shop.passivSlots.lvl) this.player.passivTree.passivType.push(passiv)
            }
        },
        clearSelect(passiv: type.PassivType) {
            this.player.passivTree.passivType = [] as type.PassivType[]
            this.player.passivTree.passivType.push(passiv)
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>

<style scoped lang="scss"></style>
