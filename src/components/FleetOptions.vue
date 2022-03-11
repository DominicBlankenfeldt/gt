<template>
    <div v-if="error" class="alert alert-danger">
        {{ error }}
    </div>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 75%; margin-top: 3rem">
            <div class="card-header">
                <form class="form-inline" v-if="!player.spaceFleet">
                    <div class="d-flex justify-content-center card-body" style="width: 100%">
                        <div class="input-contain mb-3">
                            <input
                                v-model="searchInput"
                                :class="{ dirty: searchInput }"
                                type="text"
                                class="form-control"
                                aria-label="fleetname"
                                aria-describedby="basic-addon1"
                                required
                            />
                            <label class="placeholder-text"><div class="text">search Fleet</div></label>
                        </div>
                        <button class="btn btn-outline-success shadow-none mb-3 ms-3" type="submit" @click="searchSpaceFleets()">Search</button>
                    </div>
                </form>
            </div>
            <div v-for="fleet of searchedFleets.filter(f => f.public)" :key="fleet">
                <div class="row g-0 mt-1">
                    <div class="col-2">{{ fleet.name }}</div>
                    <div class="col-9">{{ fleet.info }}</div>
                    <button class="col-1 btn btn-outline-success" v-if="fleet.members.length < 5" @click="joinSpaceFleet(fleet)">join</button>
                    <button class="col-1 btn btn-outline-danger" v-else disabled>full</button>
                </div>
            </div>
            <div v-if="!player.spaceFleet" class="card-body">you didnt join a fleet yet</div>
            <div v-else>
                <div class="card-body">
                    <div>
                        <h3 v-if="!edit">{{ fleet?.name }}</h3>
                        <div v-else class="input-contain mb-3">
                            <input
                                v-model="fleet.name"
                                :class="{ dirty: fleet.name }"
                                type="text"
                                class="form-control"
                                aria-label="fleetname"
                                aria-describedby="basic-addon1"
                                required
                            />
                            <label class="placeholder-text"><div class="text">fleetname</div></label>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-4">
                            <img src="/gt/img/placeholder_wappen_150.png" alt="placeholder" />
                            <div v-if="!edit">
                                {{ fleet.public ? 'public' : 'private' }}
                            </div>
                            <div v-else>
                                <label class="form-check-label" for="flexCheckDefault">
                                    <input
                                        class="form-check-input shadow-none"
                                        v-model="fleet.public"
                                        type="checkbox"
                                        value=""
                                        id="flexCheckDefault"
                                    />
                                    public
                                </label>
                            </div>
                        </div>
                        <div class="col-4">
                            <div>founder:</div>
                            <div @click="choosePlayer(fleetFounder)" data-bs-toggle="modal" data-bs-target="#playerCard" class="pointer">
                                {{ fleetFounder?.username }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div>members:</div>
                            <div v-for="member of fleetMembers" :key="JSON.stringify(member)" class="d-flex justify-content-between">
                                <div></div>
                                <div @click="choosePlayer(member.player)" data-bs-toggle="modal" data-bs-target="#playerCard" class="pointer">
                                    {{ member.player.username }}
                                </div>
                                <button v-if="edit" class="btn shadow-none" @click="deleteMember(member)">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        class="bi bi-trash"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                        />
                                    </svg>
                                </button>
                                <div v-else></div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3">fleetgames: {{ fleetGames }}</div>
                        <div class="col-3">fleetscore: {{ Math.round(fleetScore) }}</div>
                        <div class="col-3">avg score: {{ Math.round(avgFleetScore) }}</div>
                        <div class="col-3">fleetlvl: {{ fleetlvl }}</div>
                    </div>

                    <div v-if="!edit" style="border: solid black 1px" class="mt-4">
                        <div>fleetinfo:</div>
                        <div>{{ fleet?.info }}</div>
                    </div>
                    <div v-else class="input-contain mt-4">
                        <input
                            v-model="fleet.info"
                            :class="{ dirty: fleet.info }"
                            type="text"
                            class="form-control"
                            aria-label="fleetname"
                            aria-describedby="basic-addon1"
                            required
                        />
                        <label class="placeholder-text"><div class="text">fleet info</div></label>
                    </div>
                </div>
            </div>
            <div class="card-footer d-flex flex-row-reverse">
                <div class="col-3">
                    <button
                        v-if="!player.spaceFleet"
                        class="btn btn-warning shadow-none"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        @click="buttonSound()"
                    >
                        create fleet
                    </button>
                    <button v-if="user?.uid == fleet?.founder" @click="editSave()" class="btn btn-secondary shadow-none">
                        {{ edit ? 'save' : 'edit' }}
                    </button>
                </div>
                <div class="col-6"></div>
                <div class="col-3" v-if="player.spaceFleet">
                    <button class="btn btn-danger shadow-none" @click="leaveSpaceFleet()" v-if="user?.uid != fleet.founder">leave</button>
                    <button class="btn btn-danger shadow-none" @click="deleteSpaceFleet()" v-else>delete</button>
                </div>
            </div>

            <!-- modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">create fleet</h5>
                        </div>
                        <div class="modal-body">
                            <div class="input-contain mb-3">
                                <input
                                    v-model="nameInput"
                                    :class="{ dirty: nameInput }"
                                    type="text"
                                    class="form-control"
                                    aria-label="fleetname"
                                    aria-describedby="basic-addon1"
                                    required
                                />
                                <label class="placeholder-text"><div class="text">fleetname</div></label>
                            </div>

                            <div class="textarea-contain">
                                <textarea
                                    class="form-control"
                                    aria-label="With textarea"
                                    v-model="infoInput"
                                    :class="{ dirty: infoInput }"
                                ></textarea>
                                <label class="placeholder-text">
                                    <div class="text">Info text</div>
                                </label>
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
                            <button type="button" class="btn btn-secondary shadow-none" data-bs-dismiss="modal" @click="buttonSound()">Close</button>
                            <button type="button" class="btn btn-success shadow-none" @click="createFleet()" data-bs-dismiss="modal">
                                create fleet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- modal -->
            <div
                style="margin-top: 15vh"
                class="modal fade"
                id="playerCard"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                @click="closeChoosePlayer()"
            >
                <div class="modal-dialog modal-xl" @click.stop="">
                    <div class="modal-content">
                        <div v-if="choosenPlayerLoad">
                            <PlayerCard :playerProp="choosenPlayer" :editAble="false" />
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
import * as music from '@/music'
import PlayerCard from '@/components/PlayerCard.vue'
export default defineComponent({
    components: {
        PlayerCard,
    },
    data() {
        return {
            error: '',
            edit: false,
            searchedFleets: [] as type.SpaceFleet[],
            user: currentUser,
            player: {} as type.Player,
            choosenPlayer: {} as type.Player,
            choosenPlayerLoad: false,
            searchInput: '',
            nameInput: '',
            infoInput: '',
            publicInput: false,
            fleetFounder: {} as type.Player,
            fleetMembers: [] as type.User[],
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
                    music.changeVolume(this.player.settings.musicVolume)
                    this.buttonSound()
                }
                this.loadFleet()
            } catch {
                API.logout()
            }
        } else {
            this.$router.go(-1)
        }
    },
    computed: {
        fleetGames() {
            let games = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                games += member.playedGames
                games += member.playedHardcore
                games += member.playedTotalchaos
            }
            return games
        },
        fleetScore() {
            let score = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                score += member.highscore
                score += member.highscoreHardcore
                score += member.highscoreTotalchaos
            }
            return score
        },

        fleetlvl() {
            let lvl = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                lvl += member.defeatedBosses
                lvl += member.defeatedBossesHardcore
                lvl += member.defeatedBossesTotalchaos
            }

            return lvl
        },
        avgFleetScore() {
            let score = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                score += member.highscore
                score += member.highscoreHardcore
                score += member.highscoreTotalchaos
            }
            let games = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                games += member.playedGames
                games += member.playedHardcore
                games += member.playedTotalchaos
            }
            return score / games || 0
        },
    },
    methods: {
        closeChoosePlayer() {
            this.choosenPlayerLoad = false
            this.buttonSound()
        },
        choosePlayer(player: type.Player) {
            this.buttonSound()
            this.choosenPlayer = checkPlayer(player) as type.Player
            this.choosenPlayerLoad = true
        },
        deleteMember(member: type.User) {
            this.buttonSound()
            this.fleet.members = this.fleet.members.filter(m => m != member.id)
            this.fleetMembers = this.fleetMembers.filter(m => m.id != member.id)
        },
        async editSave() {
            this.buttonSound()
            if (this.edit) {
                try {
                    await API.updateAPI('spaceFleets', this.fleet.id!, this.fleet)
                } catch {
                    API.logout()
                }
            }
            this.edit = !this.edit
        },
        async loadFleet() {
            this.fleetMembers = []
            let result
            if (this.player.spaceFleet) {
                this.fleet = await API.getPlayerSpaceFleet(this.player.spaceFleet)
                if (!this.fleet || !this.fleet.members.includes(this.user!.uid)) {
                    this.player.spaceFleet = ''
                    this.fleet = {
                        members: [] as string[],
                        founder: '',
                        img: '',
                        name: '',
                        info: '',
                        public: false,
                    } as type.SpaceFleet
                    return
                }
            }
            result = (await API.getFleetMembers(this.player.spaceFleet!)) as type.User[]
            let fleetMembers = []
            for (let member of result) fleetMembers.push(member)
            this.fleetMembers = fleetMembers.filter(m => this.fleet.members.includes(m.id))
            this.fleetFounder = this.fleetMembers.find(m => m.id == this.fleet.founder)!.player
        },
        async createFleet() {
            if (!this.user) return
            this.buttonSound()
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
                this.loadFleet()
            } catch {
                API.logout()
            }
        },
        async searchSpaceFleets() {
            this.buttonSound()
            try {
                let result = await API.searchSpaceFleet(this.searchInput)
                this.searchedFleets = result as type.SpaceFleet[]
            } catch {
                API.logout()
            }
        },
        async joinSpaceFleet(fleet: type.SpaceFleet) {
            if (!this.user) return
            if (!fleet.id) return
            this.buttonSound()
            try {
                fleet = await API.getPlayerSpaceFleet(fleet.id!)
                fleet.members.push(this.user.uid)
                await API.updateAPI('spaceFleets', fleet.id!, fleet)
                this.searchedFleets = [] as type.SpaceFleet[]
                this.player.spaceFleet = fleet.id
                await API.addPlayer(this.player)
                this.loadFleet()
            } catch {
                this.error = 'fleet is full'
            }
        },
        async leaveSpaceFleet() {
            if (this.fleet.founder == this.user?.uid) return
            if (!this.fleet.id) return
            this.buttonSound()
            this.fleet.members = this.fleet.members.filter(m => m != this.user?.uid)
            this.player.spaceFleet = ''
            try {
                await API.addPlayer(this.player)
                await API.updateAPI('spaceFleets', this.fleet.id, this.fleet)
                this.loadFleet()
            } catch {
                API.logout()
            }
        },
        async deleteSpaceFleet() {
            this.buttonSound()
            if (this.player.spaceFleet) {
                try {
                    await API.deleteSpaceFleet(this.player.spaceFleet)
                } catch {
                    API.logout()
                }
            }
            this.player.spaceFleet = ''
            try {
                this.loadFleet()
            } catch {
                API.logout()
            }
        },
        buttonSound() {
            music.ButtonSound(this.player.settings.effectVolume)
        },
    },
})
</script>
<style lang="scss" scoped>
.modal-xl {
    max-width: 65vw !important;
}
</style>
