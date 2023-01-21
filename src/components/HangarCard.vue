<template>
  <div v-if="dataLoad" style="margin-top: 6vh; color: white">
    <div class="d-flex justify-content-center">
      <div class="btn-group rounded mt-2" role="group" aria-label="Basic radio toggle button group">
        <div v-for="weapon of player.weaponTree.weaponAvaibleTypes" :key="weapon" class="mx-1">
          <input
            type="radio"
            class="btn-check"
            name="weaponRadio"
            :id="`btn${weapon}`"
            autocomplete="off"
            :checked="player.weaponTree.weaponType == weapon"
          />
          <label
            class="btn btn-outline-primary w-100 shadow-none"
            style="height: 12vh"
            :data-title="weaponDetails[weapon].description"
            :for="`btn${weapon}`"
            @click="
              {
                (player.weaponTree.weaponType = weapon), buttonSound();
              }
            "
          >
            {{ weapon }}
            <br />
            dmg:{{ weaponStats[weapon].dmg }}
            <br />
            reload:{{ weaponStats[weapon].reload }}s
            <br />
            size:{{ weaponStats[weapon].size }}
            <br />
            plasmas:{{ weaponStats[weapon].spheres }}
          </label>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <div class="w-25 d-inline" :data-title="'you get a passiv when' + '\n' + ' you kill the hardcore boss'">
        {{ player.passivTree.passivType.length }}/{{ player.shop.passivSlots.lvl }}
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <div v-for="passiv of player.passivTree.passivAvaibleTypes" :key="passiv" class="mx-1">
        <button
          v-if="player.passivTree.passivAvaibleTypes.length <= 1 || passiv != 'none'"
          @click="selectPassiv(passiv)"
          @dblclick="clearSelect(passiv)"
          style="height: 12vh"
          class="btn shadow-none"
          :class="player.passivTree.passivType.includes(passiv) ? 'btn-primary' : 'btn-outline-primary'"
          :data-title="passivDetails[passiv].description"
        >
          {{ passivDetails[passiv].name }}
        </button>
      </div>
    </div>
    <div style="color: white" class="mt-2">
      <div v-if="player.peculiarities.available == 0">
        <div data-title="you get peculiarities when you defeat the total chaos boss" class="w-25 d-inline">you have no peculiarities</div>
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
                (player.peculiarities.selected = peculiarity), buttonSound();
              }
            "
          >
            {{ peculiarityDetails[peculiarity].name }}
          </label>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <div class="w-25 d-inline" data-title="you can get a spaceship after each round">{{ player.ship.models.length }}/{{ hangarSize }}</div>
    </div>
    <div class="d-flex justify-content-center">
      <div v-for="model of player.ship.models" :key="model.id" class="mx-1">
        <input
          type="radio"
          class="btn-check"
          name="modelRadio"
          :id="`model${model.id}`"
          autocomplete="off"
          :checked="player.ship.selectedModel.id == model.id"
        />
        <label
          class="btn btn-outline-primary w-100 shadow-none rounded-0 rounded-top"
          style="height: 25vh"
          :for="`model${model.id}`"
          @click="
            {
              (player.ship.selectedModel = model), buttonSound();
            }
          "
        >
          <div :style="{ color: modelDetails[model.rarity].color }">
            {{ model.rarity }}
          </div>
          <div class="mt-1">
            <img :src="`/img/char/playership${model.img}.png`" alt="" style="height: 6vh; width: 6vh" />
          </div>
          <br />
          HP:{{ modelDetails[model.rarity].hp }}
          <br />
          size:{{ modelDetails[model.rarity].size }}
          <br />
          speed:{{ modelDetails[model.rarity].speed }}
          <br />
          store:{{ modelDetails[model.rarity].store }}
          <br />
          score:{{ modelDetails[model.rarity].scoreMultiplier }}
        </label>
        <button
          class="btn btn-danger w-100 rounded-0 rounded-bottom shadow-none"
          :disabled="player.ship.selectedModel.id == model.id"
          data-bs-toggle="modal"
          data-bs-target="#sellConfirm"
          @click="
            {
              (selectedSellModel = model), buttonSound();
            }
          "
        >
          sell
        </button>
      </div>
    </div>
    <div class="mt-2">auto sell</div>
    <div class="d-flex justify-content-center">
      <div>
        <input type="radio" class="btn-check" name="rarityRadio" :id="`btnFalse`" autocomplete="off" :checked="player.ship.autoSell == false" />
        <label
          class="btn btn-outline-primary w-100 shadow-none"
          :for="`btnFalse`"
          @click="
            {
              (player.ship.autoSell = false), buttonSound();
            }
          "
        >
          off
        </label>
      </div>
      <div v-for="rarity of ['common', 'uncommon', 'rare', 'epic', 'legendary']" :key="rarity" class="mx-1">
        <input type="radio" class="btn-check" name="rarityRadio" :id="`btn${rarity}`" autocomplete="off" :checked="player.ship.autoSell == rarity" />
        <label
          class="btn btn-outline-primary w-100 shadow-none"
          :for="`btn${rarity}`"
          @click="
            {
              (player.ship.autoSell = rarity), buttonSound();
            }
          "
        >
          {{ rarity }} or lower
        </label>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="sellConfirm" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style="margin-top: 11vh">
    <div class="modal-dialog" @click.stop="">
      <div class="modal-content">
        <div class="modal-body" style="background-color: grey">
          <div>do you really want to sell this spaceship</div>

          <div class="row justify-content-end mt-1">
            <button data-bs-dismiss="modal" class="btn btn-danger mx-2 col-3" @click="buttonSound()">No</button>
            <button class="btn btn-primary col-3" data-bs-dismiss="modal" @click="sellModel()">Yes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { currentUser } from '../router';
import { passivDetails, weaponDetails, passivAmount, weaponStats, modelDetails, hangarSize, peculiarityDetails } from '../global';
import { findHouse, sellModel } from '../game/helpers';
import * as type from '../types';
import * as music from '../music';

export default defineComponent({
  setup() {
    currentUser;
    return {
      findHouse,
      passivDetails,
      weaponDetails,
      modelDetails,
      passivAmount,
      weaponStats,
      hangarSize,
      peculiarityDetails,
    };
  },
  data() {
    return {
      player: {} as type.Player,
      user: currentUser,
      choosenWeapon: '',
      selectedSellModel: {} as type.Model,
      choosenPassivs: [] as type.PassivType[],
      dataLoad: false,
    };
  },
  props: {
    playerProp: {
      type: Object as PropType<type.Player>,
      required: true,
    },
  },
  computed: {},
  mounted() {
    this.player = this.playerProp;
    this.dataLoad = true;
  },
  methods: {
    sellModel() {
      this.buttonSound();
      this.player = sellModel(this.player, this.selectedSellModel);
    },
    selectPassiv(passiv: type.PassivType) {
      this.buttonSound();
      this.player.passivTree.passivType = this.player.passivTree.passivType.filter(p => p != 'none');
      if (this.player.passivTree.passivType.includes(passiv)) {
        this.player.passivTree.passivType = this.player.passivTree.passivType.filter(p => p != passiv);
      } else {
        if (this.player.passivTree.passivType.length < this.player.shop.passivSlots.lvl) this.player.passivTree.passivType.push(passiv);
      }
    },
    clearSelect(passiv: type.PassivType) {
      this.player.passivTree.passivType = [] as type.PassivType[];
      this.player.passivTree.passivType.push(passiv);
    },
    buttonSound() {
      music.ButtonSound(this.player.settings.effectVolume);
    },
  },
});
</script>

<style scoped lang="scss"></style>
