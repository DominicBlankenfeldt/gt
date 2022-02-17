<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 75%">
            <div class="card-header">
                <form class="form-inline">
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
            <div v-if="myfleet" class="card-body">you didnt joined a fleet until yet</div>
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
                        <div>{{ fleet.founder.player?.username }}</div>
                    </div>
                    <div class="col-4">
                        <div>members:</div>
                        <div v-for="member of fleet.members" :key="member">{{ member.player?.username || '' }}</div>
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
                    <div>{{ fleetInfo }}</div>
                </div>
            </div>
            <div class="card-footer row">
                <div class="col-6">
                    <button v-if="myfleet == null" class="btn btn-warning shadow-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        create fleet
                    </button>
                    <button v-else-if="fleet == myfleet && founder == username" class="btn btn-secondary shadow-none">edit fleet</button>
                    <button v-else class="btn btn-secondary shadow-none">it does nothing</button>
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
                                        type="text"
                                        class="form-control"
                                        placeholder="name of fleet"
                                        aria-label="fleetname"
                                        aria-describedby="basic-addon1"
                                        required
                                    />
                                </div>
                                <div class="input-group">
                                    <span class="input-group-text">With textarea</span>
                                    <textarea class="form-control" aria-label="With textarea"></textarea>
                                </div>
                                <div class="form-check" style="margin-top: 1rem">
                                    <label class="form-check-label" for="flexCheckDefault">
                                        <input class="form-check-input shadow-none" type="checkbox" value="" id="flexCheckDefault" />
                                        make fleet public
                                    </label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary shadow-none" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-success shadow-none" @submit="createFleet()">create fleet</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 row">
                    <div class="col-6">
                        <button class="btn btn-success shadow-none">join fleet</button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-primary shadow-none">send request</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as type from '@/types'

export default defineComponent({
    data() {
        return {
            fleetScore: 0,
            avgFleetScore: 0,
            fleetGames: 0,
            fleet: {
                members: [] as type.User[],
                founder: {} as type.User,
                img: '',
                name: '',
                info: '',
                public: false,
            } as type.SpaceFleet,
        }
    },
    computed: {
        fleetlvl() {
            let lvl = 0
            for (let member of this.fleet.members) {
                lvl += member.player.defeatedBosses
                lvl += member.player.defeatedBossesHardcore
                lvl += member.player.defeatedBossesTotalchaos
            }
            return lvl
        },
    },
    async mounted() {
        return true
    },
})
</script>
<style lang="scss" scoped>
.card {
    margin-top: 3rem;
}
</style>
