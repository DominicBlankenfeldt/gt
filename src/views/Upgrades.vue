<template>
    <div style="margin-top: 8vh" v-if="dataLoad">
        <div class="btn-group rounded w-50 mt-2" role="group" aria-label="Basic radio toggle button group">
            <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnSkillTree"
                autocomplete="off"
                :checked="choosenTree == 'skillTree'"
                data-bs-target="#carouselUpgrades"
                data-bs-slide-to="0"
            />
            <label
                class="btn btn-outline-primary w-25 shadow-none"
                for="btnSkillTree"
                @click="
                    {
                        ;(choosenTree = 'skillTree'), buttonSound()
                    }
                "
            >
                skill tree
            </label>
            <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnWeapon"
                autocomplete="off"
                :checked="choosenTree == 'weapon'"
                data-bs-target="#carouselUpgrades"
                data-bs-slide-to="1"
            />
            <label
                class="btn btn-outline-primary w-25 shadow-none"
                for="btnWeapon"
                @click="
                    {
                        ;(choosenTree = 'weapon'), buttonSound()
                    }
                "
            >
                weapons
            </label>
            <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnPassiv"
                autocomplete="off"
                :checked="choosenTree == 'passiv'"
                data-bs-target="#carouselUpgrades"
                data-bs-slide-to="2"
            />
            <label
                class="btn btn-outline-primary w-25 shadow-none"
                for="btnPassiv"
                @click="
                    {
                        ;(choosenTree = 'passiv'), buttonSound()
                    }
                "
            >
                passivs
            </label>
            <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnShop"
                autocomplete="off"
                :checked="choosenTree == 'shop'"
                data-bs-target="#carouselUpgrades"
                data-bs-slide-to="3"
            />
            <label
                class="btn btn-outline-primary w-25 shadow-none"
                for="btnShop"
                @click="
                    {
                        ;(choosenTree = 'shop'), buttonSound()
                    }
                "
            >
                shop
            </label>
        </div>
        <div id="carouselUpgrades" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <SkillCard :playerProp="player" style="min-height: 70vh" />
                </div>
                <div class="carousel-item">
                    <WeaponCard :playerProp="player" style="min-height: 70vh" />
                </div>
                <div class="carousel-item">
                    <PassivCard :playerProp="player" style="min-height: 70vh" />
                </div>
                <div class="carousel-item">
                    <ShopCard :playerProp="player" style="min-height: 70vh" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { checkPlayer } from '@/global'
import { currentUser } from '@/router'
import SkillCard from '@/components/SkillCard.vue'
import WeaponCard from '@/components/WeaponCard.vue'
import PassivCard from '@/components/PassivCard.vue'
import ShopCard from '@/components/ShopCard.vue'
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
        ShopCard,
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
