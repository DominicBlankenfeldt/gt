<template>
    <div v-if="dataLoad" style="margin-top: 6vh; color: white">
        <div v-if="player.peculiarities.available == 0" data-tile="you get peculiarities when you defeat the total chaos boss">
            you have no peculiarities
        </div>
        <div class="btn-group rounded mt-2" role="group" aria-label="Basic radio toggle button group" v-else>
            <div v-for="peculiarity of player.peculiarities.available" :key="peculiarity" class="mx-1">
                <input
                    type="radio"
                    class="btn-check"
                    name="peculiarityRadio"
                    :id="`btn${peculiarity}`"
                    autocomplete="off"
                    :checked="player.peculiarities.selected == peculiarity"
                />
                <label
                    class="btn btn-outline-primary w-100 shadow-none"
                    :data-title="peculiarityDetails[peculiarity].description"
                    :for="`btn${peculiarity}`"
                    @click="
                        {
                            ;(player.peculiarities.selected = peculiarity), buttonSound()
                        }
                    "
                >
                    {{ peculiarityDetails[peculiarity].name }}
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { currentUser } from '@/router'
import { peculiarityDetails } from '@/global'
import * as type from '@/types'
import * as music from '@/music'
export default defineComponent({
    setup() {
        currentUser
        return {
            peculiarityDetails,
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

    mounted() {
        this.player = this.playerProp
        this.dataLoad = true
    },
    methods: {
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>

<style scoped lang="scss">
a {
    margin-left: 1vw;
}
#nav {
    padding: 3vh;
    height: 8vh;
    background-color: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    a {
        font-weight: bold;
        color: rgb(255, 255, 255);

        &.router-link-exact-active {
            color: rgb(101, 211, 255);
        }
    }
}
</style>
