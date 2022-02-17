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
      <!-- wird nur angezeigt wenn ein suchergebniss vorhanden ist-->
      <div class="card-body">
        <div><h3>flottenname</h3></div>

        <div class="row">
          <div class="col-4">
            <img src="/gt/img/placeholder_wappen_150.png" alt="placeholder" />
          </div>
          <div class="col-4">founder:</div>
          <div class="col-4">members 10/10</div>
        </div>

        <div class="row">
          <div class="col-4">fleetscore: 1111pts</div>
          <div class="col-4">avg score: 1111pts</div>
          <div class="col-4">fleetgames: 1111</div>
        </div>
        <div style="border: solid black 1px; margin: 1vh">fleetinfo:</div>
      </div>
      <div class="card-footer row">
        <div class="col-6">
          <button v-if="myfleet == null" class="btn btn-warning">
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
      fleetname: "",
      fleetinfo: "",
    };
  },
});
</script>
<style lang="scss" scoped></style>
