<template>
  <div class="d-flex justify-content-center">
    <div class="card" style="width: 75%">
      <div class="card-header">
        <form class="form-inline">
          <div
            class="d-flex justify-content-center card-body"
            style="width: 100%"
          >
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search Fleet"
              aria-label="Search"
            />
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
      <div v-if="myfleet" class="card-body">
        you didnt joined a fleet until yet
      </div>
      <div class="card-body">
        <div>
          <h3>{{ this.fleetName }}</h3>
        </div>

        <div class="row">
          <div class="col-4">
            <img src="/gt/img/placeholder_wappen_150.png" alt="placeholder" />
          </div>
          <div class="col-4">
            <div>founder:</div>
            <div>blabla</div>
          </div>
          <div class="col-4">
            <div>members:</div>
            <div>for each</div>
          </div>
        </div>

        <div class="row">
          <div class="col-4">fleetgames: {{ this.fleetGames }}</div>
          <div class="col-4">fleetscore: {{ this.fleetScore }}pts</div>
          <div class="col-4">avg score: {{ this.avgFleetScore }}pts</div>
        </div>
        <div style="border: solid black 1px; margin: 1vh">
          fleetinfo:
          <div>{{ this.fleetinfo }}</div>
        </div>
      </div>
      <div class="card-footer row">
        <div class="col-6">
          <button
            v-if="myfleet == null"
            class="btn btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            create fleet
          </button>
          <button
            v-else-if="fleet == myfleet && founder == username"
            class="btn btn-secondary"
          >
            edit fleet
          </button>
          <button v-else class="btn btn-secondary">it does nothing</button>
        </div>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">create fleet</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1"
                    >fleetname</span
                  >
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
                  <textarea
                    class="form-control"
                    aria-label="With textarea"
                  ></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-success"
                  @submit="createFleet()"
                >
                  create fleet
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 row">
          <div class="col-6">
            <button class="btn btn-success">join fleet</button>
          </div>
          <div class="col-6">
            <button class="btn btn-primary">send request</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return;
  },
  data() {
    return {
      fleetName: "",
      fleetInfo: "",
      founder: "",
      members: [],
      fleetScore: 0,
      avgFleetScore: 0,
      fleetGames: 0,
      fleetImg: "",
    };
  },
});
</script>
<style lang="scss" scoped>
.card {
  margin-top: 3rem;
}
</style>
