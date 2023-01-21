<template>
  <div v-if="dataLoad" style="margin-top: 6vh; color: white">
    <div>
      <div data-title="you get 1 passivpoint per 2000 highscore in totalchaos mode" class="w-25 d-inline">
        Atom Points:
        <br />
        {{ player.passivTree.passivPoints - usedPassivPoints }}/{{ player.passivTree.passivPoints }}
      </div>
    </div>
    <div class="d-flex j...stify-content-center">
      <div v-for="passivUpgrade of player.passivTree.passivUpgrades" :key="passivUpgrade.name">
        <div class="mx-1" v-if="player.passivTree.passivType.includes(passivUpgrade.name)">
          <button
            class="mt-2 w-100 btn btn-primary shadow-none rounded-0 rounded-top"
            @click="lvlPassivUpgrade(passivUpgrade)"
            @dblclick="lvlPassivUpgradex8(passivUpgrade)"
            :data-title="
              passivDetails[passivUpgrade.name].description +
              '\n' +
              (passivUpgrade.lvl <
              passivDetails[passivUpgrade.name].maxlvl +
                (passivUpgrade.name != 'none' ? (findHouse(player, 'passiv') + findlvlPassiv(player, 'tier1')) * 5 : 0)
                ? passivUpgrade.name != 'none'
                  ? 'costs: 1'
                  : ''
                : 'max lvl')
            "
          >
            {{ passivDetails[passivUpgrade.name].name }}
            <br />
            lvl: {{ passivUpgrade.lvl }}/{{
              passivDetails[passivUpgrade.name].maxlvl +
              (passivUpgrade.name != 'none' ? findHouse(player, 'passiv' + findlvlPassiv(player, 'tier1')) * 5 : 0)
            }}
          </button>
          <button class="w-100 btn btn-danger shadow-none rounded-0 rounded-bottom" @click="resetPassiv(passivUpgrade)">reset</button>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <button class="btn btn-danger align-self-center shadow-none" @click="resetPassivTree()">reset passivtree</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { currentUser } from '../router';
import { passivDetails, passivAmount } from '../global';
import { findHouse, findlvlPassiv } from '../game/helpers';
import * as type from '../types';
import * as music from '../music';

export default defineComponent({
  setup() {
    currentUser;
    return {
      findHouse,
      findlvlPassiv,
      passivDetails,
      passivAmount,
    };
  },
  data() {
    return {
      player: {} as type.Player,
      user: currentUser,
      dataLoad: false,
    };
  },
  props: {
    playerProp: {
      type: Object as PropType<type.Player>,
      required: true,
    },
    pressedKeys: {
      type: Object as PropType<Record<string, boolean>>,
      required: true,
    },
  },
  computed: {
    usedPassivPoints() {
      let allPassivlvl = 0;
      for (let passivUpgrade of this.player.passivTree.passivUpgrades) allPassivlvl += passivUpgrade.lvl;
      return allPassivlvl;
    },
  },
  mounted() {
    this.player = this.playerProp;
    this.dataLoad = true;
  },
  methods: {
    lvlPassivUpgrade(passivUpgrade: type.PassivUpgrade) {
      let counter = 1;
      if (passivUpgrade.name == 'none') return;
      if (this.pressedKeys['Shift'])
        counter = passivDetails[passivUpgrade.name].maxlvl + (findHouse(this.player, 'passiv') + findlvlPassiv(this.player, 'tier1')) * 5;
      for (let i = 0; i < counter; i++) {
        if (
          passivUpgrade.lvl <
          passivDetails[passivUpgrade.name].maxlvl + (findHouse(this.player, 'passiv') + findlvlPassiv(this.player, 'tier1')) * 5
        )
          if (this.player.passivTree.passivPoints - this.usedPassivPoints > 0) {
            passivUpgrade.lvl++;
            if (i == 0) this.buttonSound();
          }
      }
    },
    lvlPassivUpgradex8(passivUpgrade: type.PassivUpgrade) {
      if (passivUpgrade.name == 'none') return;
      for (let i = 0; i < 8; i++) {
        if (
          passivUpgrade.lvl <
          passivDetails[passivUpgrade.name].maxlvl + (findHouse(this.player, 'passiv') + findlvlPassiv(this.player, 'tier1')) * 5
        )
          if (this.player.passivTree.passivPoints - this.usedPassivPoints > 0) {
            passivUpgrade.lvl++;
          }
      }
    },
    resetPassivTree() {
      this.buttonSound();
      for (let passivUpgrade of this.player.passivTree.passivUpgrades) {
        passivUpgrade.lvl = 0;
      }
    },
    resetPassiv(passiv: type.PassivUpgrade) {
      this.buttonSound();
      passiv.lvl = 0;
    },
    buttonSound() {
      music.ButtonSound(this.player.settings.effectVolume);
    },
  },
});
</script>

<style scoped lang="scss"></style>
