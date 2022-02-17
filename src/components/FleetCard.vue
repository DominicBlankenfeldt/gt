<template>
  <div>
    <div>FleetCard</div>
    <div class="d-flex justify-content-center">
      <div class="card d-flex" style="width: 90%">
        <div class="card-header">show/edit</div>
        <div class="card-body"></div>
        <div class="card-footer"></div>
      </div>
    </div>
  </div>
  <div>
    <div>create Fleet</div>
    <div class="d-flex justify-content-center">
      <div class="card" style="width: 90%">
        <div class="card-header">create fleet</div>
        <div class="card-body">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Fleetname:</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Fleetname"
              aria-label="Fleetname"
              aria-describedby="basic-addon1"
            />
          </div>

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Fleetinfo:</span>
            </div>
            <textarea class="form-control" aria-label="Fleetinfo"></textarea>
          </div>
        </div>
        <div class="card-footer">
          <button>create fleet [ xy Skillpoints]</button>
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
});
</script>
