<template>
    <div style="margin-top: 8vh" v-if="dataLoad">
        <div class="btn-group rounded w-50 mt-2" role="group" aria-label="Basic radio toggle button group">
            <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnSkillTree"
                autocomplete="off"
                @change="choosenTree = 'skillTree'"
                :checked="choosenTree == 'skillTree'"
            />
            <label class="btn btn-outline-primary w-25 shadow-none" for="btnSkillTree">skill tree</label>
            <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnWeapon"
                autocomplete="off"
                @change="choosenTree = 'weapon'"
                :checked="choosenTree == 'weapon'"
            />
            <label class="btn btn-outline-primary w-25 shadow-none" for="btnWeapon">weapons</label>
            <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnPassiv"
                autocomplete="off"
                @change="choosenTree = 'passiv'"
                :checked="choosenTree == 'passiv'"
            />
            <label class="btn btn-outline-primary w-25 shadow-none" for="btnPassiv">passivs</label>
        </div>
        <SkillCard v-if="choosenTree == 'skillTree'" :playerProp="player" />
        <WeaponCard v-if="choosenTree == 'weapon'" :playerProp="player" />
        <PassivCard v-if="choosenTree == 'passiv'" :playerProp="player" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { checkPlayer } from '@/global'
import { currentUser } from '@/router'
import SkillCard from '@/components/SkillCard.vue'
import WeaponCard from '@/components/WeaponCard.vue'
import PassivCard from '@/components/PassivCard.vue'
import * as API from '@/API'
import * as type from '@/types'
import * as music from '@/music'
export default defineComponent({
    setup() {
        currentUser
    },
    components: {
        SkillCard,
        WeaponCard,
        PassivCard,
    },
    data() {
        return {
            player: {} as type.Player,
            timer: 0,
            user: currentUser,
            dataLoad: false,
            choosenTree: 'skillTree',
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
        this.buttonSound()
        this.dataLoad = true
    },

    methods: {
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>
