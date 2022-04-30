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
                            />
                            <label class="placeholder-text"><div class="text">search Fleet</div></label>
                        </div>
                        <button class="btn btn-primary shadow-none mb-3 ms-3" type="submit" @click="searchSpaceFleets()">Search</button>
                    </div>
                </form>
            </div>
            <div v-for="fleet of searchedFleets.filter(f => f.fleetInfo.public)" :key="fleet.id">
                <div class="row g-0 mt-1">
                    <div class="col-2">{{ fleet.fleetInfo.name }}</div>
                    <div class="col-9">{{ fleet.fleetInfo.info }}</div>
                    <button class="col-1 btn btn-outline-success" v-if="fleet.members.length < 5" @click="joinSpaceFleet(fleet)">join</button>
                    <button class="col-1 btn btn-outline-danger" v-else disabled>full</button>
                </div>
            </div>
            <div v-if="!player.spaceFleet" class="card-body">you didnt join a fleet yet</div>
            <div v-else>
                <div class="card-body">
                    <div>
                        <h3 v-if="!edit">{{ fleet?.fleetInfo.name }}</h3>
                        <div v-else class="input-contain mb-3">
                            <input
                                v-model="fleet.fleetInfo.name"
                                :class="{ dirty: fleet.fleetInfo.name }"
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
                                {{ fleet.fleetInfo.public ? 'public' : 'private' }}
                            </div>
                            <div v-else>
                                <label class="form-check-label" for="flexCheckDefault">
                                    <input
                                        class="form-check-input shadow-none"
                                        v-model="fleet.fleetInfo.public"
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
                            <div @click="choosePlayer(fleetFounder)" data-bs-toggle="modal" data-bs-target="#playerCard" class="pointer member">
                                {{ fleetFounder?.username }}
                            </div>
                        </div>
                        <div class="col-4 d-flex flex-column align-items-center">
                            <div class="mb-2">members:</div>
                            <div v-for="member of fleetMembers" :key="JSON.stringify(member)" class="d-flex flex-row align-items-center">
                                <div
                                    @click="choosePlayer(member.player)"
                                    data-bs-toggle="modal"
                                    data-bs-target="#playerCard"
                                    class="pointer p-1 member"
                                >
                                    {{ member.player.username }}
                                </div>
                                <button v-if="edit" class="btn shadow-none p-0" @click="deleteMember(member)">
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
                        <div class="col-3">
                            <i class="bi bi-info-circle"></i>
                            fleetgames: {{ fleetGames }}
                        </div>
                        <div class="col-3">fleetscore: {{ Math.round(fleetScore) }}</div>
                        <div class="col-3">avg score: {{ Math.round(avgFleetScore) }}</div>
                        <div class="col-3">fleetlvl: {{ fleetlvl }}</div>
                    </div>

                    <div v-if="!edit" style="border: solid black 1px" class="mt-4">
                        <div>fleetinfo:</div>
                        <div>{{ fleet?.fleetInfo.info }}</div>
                    </div>
                    <div v-else class="input-contain mt-4">
                        <input
                            v-model="fleet.fleetInfo.info"
                            :class="{ dirty: fleet.fleetInfo.info }"
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
            <div class="card-footer d-flex justify-content-between">
                <div class="col-3" v-if="player.spaceFleet">
                    <button class="btn btn-danger shadow-none" @click="leaveSpaceFleet()" v-if="user?.uid != fleet.fleetInfo.founder">leave</button>
                    <button class="btn btn-danger shadow-none" @click="deleteSpaceFleet()" v-else>delete</button>
                </div>
                <div class="col-3" v-if="player.spaceFleet">
                    <button class="btn btn-primary shadow-none" data-bs-toggle="modal" data-bs-target="#skillModal">skills</button>
                </div>
                <div class="col-3">
                    <button
                        v-if="!player.spaceFleet"
                        class="btn btn-primary shadow-none"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        @click="buttonSound()"
                    >
                        create fleet
                    </button>
                    <button v-if="user?.uid == fleet?.fleetInfo.founder" @click="editSave()" class="btn btn-secondary shadow-none">
                        {{ edit ? 'save' : 'edit' }}
                    </button>
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
            <!-- modal -->
            <div class="modal fade" id="skillModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">skill tree</h5>
                        </div>
                        <div class="modal-body">
                            <div data-title="you receive 1 point per 1.000.000 fleet score">
                                {{ amountPoints() - usedSkillpoints }}/{{ amountPoints() }}
                            </div>
                            <div v-for="skill of fleet.skills" :key="skill.name">
                                <button
                                    class="mt-2 w-100 btn btn-primary align-self-center shadow-none"
                                    @click="lvlSkill(skill)"
                                    :data-title="fleetSkillDetails[skill.name].description"
                                    :line2="`costs: ${fleetSkillDetails[skill.name].tier}`"
                                >
                                    {{ fleetSkillDetails[skill.name].name }}
                                    <br />
                                    lvl: {{ skill.lvl }}/{{ fleetSkillDetails[skill.name].maxlvl }}
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary shadow-none" data-bs-dismiss="modal" @click="buttonSound()">Close</button>
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
import { checkPlayer, fleetSkillDetails } from '@/global'
import * as music from '@/music'
import PlayerCard from '@/components/PlayerCard.vue'
export default defineComponent({
    setup() {
        return {
            fleetSkillDetails,
        }
    },
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
                fleetInfo: {
                    founder: '',
                    img: '',
                    name: '',
                    info: '',
                    public: false,
                },
                skills: [
                    { name: 'bossEnemies', lvl: 0 },
                    { name: 'bossDifficulty', lvl: 0 },
                ],
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
                    this.player = checkPlayer(this.player, this.user!) as type.Player
                    music.changeVolume(this.player.settings.musicVolume)
                    this.buttonSound()
                }
            } catch {
                API.logout()
            }
            this.loadFleet()
        } else {
            this.$router.go(-1)
        }
    },
    computed: {
        fleetGames() {
            let games = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                for (let mode of ['normal', 'hardcore', 'totalchaos'] as type.PlayMode[]) games += member.playedGames[mode]
            }
            return games
        },
        fleetScore() {
            let score = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                for (let mode of ['normal', 'hardcore', 'totalchaos'] as type.PlayMode[]) score += member.highscore[mode]
            }
            return score
        },
        fleetlvl() {
            let lvl = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                for (let mode of ['normal', 'hardcore', 'totalchaos'] as type.PlayMode[]) lvl += member.defeatedBosses[mode]
            }

            return lvl
        },
        avgFleetScore() {
            let score = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                for (let mode of ['normal', 'hardcore', 'totalchaos'] as type.PlayMode[]) score += member.highscore[mode]
            }
            let games = 0
            for (let member of this.fleetMembers.map(m => m.player)) {
                games += 3
            }
            return score / games || 0
        },
        usedSkillpoints() {
            let points = 0
            for (let skill of this.fleet.skills) points += skill.lvl * fleetSkillDetails[skill.name].tier
            return points
        },
    },
    methods: {
        amountPoints() {
            return Math.floor(this.fleetScore / 1000000)
        },
        lvlSkill(skill: type.FleetSkill) {
            if (!this.fleet.id) return
            if (this.user?.uid != this.fleet.fleetInfo.founder) return
            if (this.amountPoints() - this.usedSkillpoints < fleetSkillDetails[skill.name].tier) return
            skill.lvl++
            API.lvlFleetSkill(this.fleet.id, this.fleet.skills)
        },
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
            if (!this.fleet.id) return
            try {
                API.removeFleetMember(this.fleet.id, member.id)
            } catch {
                API.logout()
            }
            this.fleet.members = this.fleet.members.filter(m => m != member.id)
            this.fleetMembers = this.fleetMembers.filter(m => m.id != member.id)
        },
        async editSave() {
            this.buttonSound()
            if (!this.fleet.id) return
            if (this.edit) {
                try {
                    API.updateFleetInfo(this.fleet.id, this.fleet.fleetInfo)
                } catch (e) {
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
                if (!this.fleet.fleetInfo.founder || !this.fleet.members.includes(this.user!.uid)) {
                    this.player.spaceFleet = ''
                    this.fleet = {
                        members: [] as string[],
                        fleetInfo: {
                            founder: '',
                            img: '',
                            name: '',
                            info: '',
                            public: false,
                        },
                        skills: [
                            { name: 'bossEnemies', lvl: 0 },
                            { name: 'bossDifficulty', lvl: 0 },
                        ],
                    } as type.SpaceFleet
                    await API.updatePlayer(this.player)
                    this.$router.go(0)
                    return
                }
            }
            result = (await API.getFleetMembers(this.player.spaceFleet!)) as type.User[]
            let fleetMembers = []
            for (let member of result) fleetMembers.push(member)
            this.fleetMembers = fleetMembers.filter(m => this.fleet.members.includes(m.id))
            this.fleetFounder = this.fleetMembers.find(m => m.id == this.fleet.fleetInfo.founder)!.player
        },
        async createFleet() {
            if (!this.user) return
            this.buttonSound()
            let result = await API.addSpaceFleet({
                fleetInfo: {
                    founder: this.user.uid,
                    img: '',
                    name: this.nameInput,
                    info: this.infoInput,
                    public: this.publicInput,
                },
                members: [this.user.uid] as string[],
                skills: [
                    { name: 'bossEnemies', lvl: 0 },
                    { name: 'bossDifficulty', lvl: 0 },
                ],
            })
            if (result) this.player.spaceFleet = result
            try {
                await API.updatePlayer(this.player)
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
            this.error = ''
            if (!this.user) return
            if (!fleet.id) return
            this.buttonSound()
            try {
                API.addFleetMember(fleet.id, this.user.uid)
                this.searchedFleets = [] as type.SpaceFleet[]
                this.player.spaceFleet = fleet.id
                await API.updatePlayer(this.player)
                this.loadFleet()
            } catch {
                this.error = 'fleet is full'
            }
        },
        async leaveSpaceFleet() {
            if (!this.user) return
            if (this.fleet.fleetInfo.founder == this.user.uid) return
            if (!this.fleet.id) return
            this.buttonSound()
            try {
                API.removeFleetMember(this.fleet.id, this.user.uid)
                this.player.spaceFleet = ''
                await API.updatePlayer(this.player)
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
