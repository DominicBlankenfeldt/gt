<template>
    <div class="container" v-if="dataLoad">
        <div class="card" style="margin-top: 8vh">
            <div class="card-header">Movement</div>
            <div class="card-body">
                <p>
                    {{
                        `You can move with "${
                            player.settings.moves['up'] +
                            player.settings.moves['left'] +
                            player.settings.moves['down'] +
                            player.settings.moves['right']
                        }" or with the arrow keys`
                    }}
                </p>
            </div>
        </div>
        <div class="card mt-1">
            <div class="card-header">Abilities</div>
            <div class="card-body">
                <p>
                    {{ `With the key "${player.settings.abilitys[1]}" you can speed up your movement if you unlock the ability in your skilltree` }}
                </p>
                <p>
                    {{ `With the key "${player.settings.abilitys[2]}" you can slow down your movement if you unlock the ability in your skilltree` }}
                </p>
                <p>
                    {{
                        `With the key "${player.settings.abilitys[3]}" you can remote ignition the nearest bomb if you unlock the ability in your skilltree`
                    }}
                </p>
                <p>
                    {{
                        `With the key "${player.settings.abilitys[4]}" you can shoot at enemies (a hit gives you score) if you unlock the ability in your skilltree`
                    }}
                </p>
            </div>
        </div>

        <div class="card mt-1">
            <div class="card-header">Items</div>
            <div class="card-body">
                <div>
                    <img src="/gt/img/items/coin/coin.gif" alt="" />
                    A coin gives you score if you collect it
                </div>
                <div>
                    <img src="/gt/img/items/darkhole/darkhole.png" alt="" />
                    A darkhole sucks in everything nearby
                </div>
                <div>
                    <img src="/gt/img/items/potion/potion.gif" alt="" />
                    A growpotion makes you and enemies bigger if you are grown you get more score
                </div>
                <div>
                    <img src="/gt/img/items/bomb/bomb.gif" alt="" />
                    A bomb resets all enemies
                </div>
                <div>
                    <img src="/gt/img/items/magnet/magnet.png" alt="" />
                    A magnet lets you attract items and repel enemies or enemies attract you
                </div>
                <div>
                    <img src="/gt/img/items/snowflake/snowflake.gif" alt="" />
                    Slow all enemies
                </div>
                <div>
                    <img src="/gt/img/items/clock/clock.png" alt="" />
                    Stops the time
                </div>
            </div>
        </div>
        <div class="card mt-1">
            <div class="card-header">Enemies</div>
            <div class="card-body">
                <div class="row justify-content-center">
                    <div style="height: 2vw; width: 2vw">
                        <img src="/gt/img/char/enemy_pingu.png" alt="" />
                    </div>
                    <div style="height: 2vw; width: 2vw">
                        <img src="/gt/img/char/enemy_cupcake.gif" alt="" />
                    </div>
                    <div style="height: 2vw; width: 2vw">
                        <img src="/gt/img/char/enemy_gasman.gif" alt="" />
                    </div>
                    <div style="height: 2vw; width: 2vw">
                        <img src="/gt/img/char/enemy_komet.gif" alt="" />
                    </div>
                </div>
                <p class="mt-1">They will kill you. wink smiley</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as type from '@/types'
import { checkPlayer } from '@/global'
import { currentUser } from '@/router'
import * as API from '@/API'
import * as music from '@/music'

export default defineComponent({
    data() {
        return {
            dataLoad: false,
            user: currentUser,
            player: {} as type.Player,
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
        this.dataLoad = true
    },
})
</script>