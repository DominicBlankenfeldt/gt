<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 75%; margin-top: 3rem">
            <div class="card-header">
                <form class="form-inline" v-if="!player.spaceFleet">
                    <div class="d-flex justify-content-center card-body" style="width: 100%">
                        <input
                            class="form-control shadow-none mr-sm-2 rounded-0 rounded-start"
                            type="search"
                            placeholder="Search Fleet"
                            aria-label="Search"
                        />
                        <button class="btn btn-outline-success shadow-none my-2 my-sm-0 rounded-0 rounded-end" type="submit">Search</button>
                    </div>
                </form>
            </div>
            <div v-if="!player.spaceFleet" class="card-body">you didnt joined a fleet until yet</div>
            <div v-else>
                <div class="card-body">
                    <div>
                        <h3>{{ fleet.name }}</h3>
                    </div>

                    <div class="row">
                        <div class="col-4">
                            <img src="/gt/img/placeholder_wappen_150.png" alt="placeholder" />
                        </div>
                        <div class="col-4">
                            <div>founder:</div>
                            <div>{{ fleetFounder?.username }}</div>
                        </div>
                        <div class="col-4">
                            <div>members:</div>
                            <div v-for="member of fleetMembers" :key="member">{{ member.username }}</div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3">fleetgames: {{ fleetGames }}</div>
                        <div class="col-3">fleetscore: {{ fleetScore }}pts</div>
                        <div class="col-3">avg score: {{ avgFleetScore }}pts</div>
                        <div class="col-3">fleetlvl: {{ fleetlvl }}</div>
                    </div>
                    <div style="border: solid black 1px; margin: 1vh">
                        fleetinfo:
                        <div>{{ fleet.info }}</div>
                    </div>
                </div>
                <div class="card-footer row">
                    <div class="col-6">
                        <button v-if="!player.spaceFleet" class="btn btn-warning shadow-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            create fleet
                        </button>
                        <button v-if="user.uid == fleet.founder" class="btn btn-secondary shadow-none">edit</button>
                    </div>
                </div>
            </div>
            <!-- modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">create fleet</h5>
                            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">fleetname</span>
                                <input
                                    v-model="nameInput"
                                    type="text"
                                    class="form-control"
                                    placeholder="name of fleet"
                                    aria-label="fleetname"
                                    aria-describedby="basic-addon1"
                                    required
                                />
                            </div>
                            <div class="input-group">
                                <span class="input-group-text">Info text</span>
                                <textarea class="form-control" aria-label="With textarea" v-model="infoInput"></textarea>
                            </div>
                            <div class="form-check" style="margin-top: 1rem">
                                <label class="form-check-label" for="flexCheckDefault">
                                    <input
                                        class="form-check-input shadow-none"
                                        v-model="publicInput"
                                        type="checkbox"
                                        value=""
                                        id="flexCheckDefault"
                                    />
                                    make fleet public
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary shadow-none" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success shadow-none" @click="createFleet()" data-bs-dismiss="modal">
                                create fleet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as type from '@/types'
import * as API from '@/API'
import { currentUser } from '@/router'
import { checkPlayer } from '@/global'
export default defineComponent({
    data() {
        return {
            user: currentUser,
            player: {} as type.Player,
            nameInput: '',
            infoInput: '',
            publicInput: false,
            fleetScore: 0,
            avgFleetScore: 0,
            fleetGames: 0,
            fleetFounder: {} as type.Player,
            fleetMembers: [] as type.Player[],
            fleet: {
                members: [] as string[],
                founder: '',
                img: '',
                name: '',
                info: '',
                public: false,
            } as type.SpaceFleet,
        }
    },
    async mounted() {
        let result
        if (this.user) {
            try {
                result = await API.getPlayer()
                if (result) {
                    this.player = result.player
                    this.player = checkPlayer(this.player) as type.Player
                }
                if (this.player.spaceFleet) {
                    this.fleet = await API.getPlayerSpaceFleet(this.player.spaceFleet)
                    result = await API.getFleetPlayer(this.fleet.founder)
                    this.fleetFounder = result.player
                }
                for (let member of this.fleet.members) {
                    result = await API.getFleetPlayer(member)
                    this.fleetMembers.push(result.player)
                }
            } catch {
                API.logout()
            }
        } else {
            this.$router.go(-1)
        }
    },
    computed: {
        fleetlvl() {
            let lvl = 0
            for (let member of this.fleetMembers) {
                lvl += member.defeatedBosses
                lvl += member.defeatedBossesHardcore
                lvl += member.defeatedBossesTotalchaos
            }
            return lvl
        },
    },
    methods: {
        async createFleet() {
            if (!this.user) return
            let result = await API.addSpaceFleet({
                founder: this.user.uid,
                members: [this.user.uid] as string[],
                img: '',
                name: this.nameInput,
                info: this.infoInput,
                public: this.publicInput,
            })
            if (result) this.player.spaceFleet = result
            try {
                await API.addPlayer(this.player)
            } catch {
                API.logout()
            }
        },
    },
})
</script>
<style lang="scss" scoped>
</style>
