<template>
  <div v-if="dataLoad" style="margin-top: 6vh; color: white">
    <div>
      <div>
        <div data-title="you get 1 weaponpoint per 500 highscore in hardcore mode" class="w-25 d-inline">
          Weapon Points:
          <br />
          {{ player.weaponTree.weaponPoints - usedWeaponPoints }}/{{ player.weaponTree.weaponPoints }}
        </div>
      </div>
    </div>
    <div class="row g-0 mt-2">
      <div class="col-3"></div>
      <div class="d-flex flex-column col-2 mx-1">
        <div v-for="weaponUpgrade of tier1Upgrades" :key="weaponUpgrade.name">
          <Tooltip
            :tooltip="
              weaponDetails[weaponUpgrade.name].description +
              '\n' +
              (weaponUpgrade.lvl <
              weaponDetails[weaponUpgrade.name].maxlvl + (findHouse(player, 'weapon') + findlvlWeaponUpgrade(player, 'tier1')) * 2
                ? `costs: ${weaponDetails[weaponUpgrade.name].tier}`
                : 'max lvl')
            "
          >
            <Button
              class="mt-2 w-100 btn btn-primary shadow-none"
              @click="lvlWeaponUpgrade(weaponUpgrade)"
              @dblclick="lvlWeaponUpgradex8(weaponUpgrade)"
            >
              {{ weaponDetails[weaponUpgrade.name].name }}
              <br />
              lvl: {{ weaponUpgrade.lvl }}/{{
                weaponDetails[weaponUpgrade.name].maxlvl + (findHouse(player, 'weapon') + findlvlWeaponUpgrade(player, 'tier1')) * 2
              }}
            </Button>
          </Tooltip>
        </div>
      </div>
      <div class="d-flex flex-column col-2 mx-1">
        <div v-for="weaponUpgrade of tier2Upgrades" :key="weaponUpgrade.name">
          <Tooltip
            :tooltip="
              weaponDetails[weaponUpgrade.name].description +
              '\n' +
              (weaponUpgrade.lvl <
              weaponDetails[weaponUpgrade.name].maxlvl + (findHouse(player, 'weapon') + findlvlWeaponUpgrade(player, 'tier2')) * 2
                ? `costs: ${weaponDetails[weaponUpgrade.name].tier}`
                : 'max lvl')
            "
          >
            <Button
              class="mt-2 w-100 btn btn-primary shadow-none"
              @click="lvlWeaponUpgrade(weaponUpgrade)"
              @dblclick="lvlWeaponUpgradex8(weaponUpgrade)"
              :disabled="usedWeaponPoints < 40"
            >
              {{ weaponDetails[weaponUpgrade.name].name }}
              <br />
              lvl: {{ weaponUpgrade.lvl }}/{{
                weaponDetails[weaponUpgrade.name].maxlvl + (findHouse(player, 'weapon') + findlvlWeaponUpgrade(player, 'tier2')) * 2
              }}
            </Button>
          </Tooltip>
        </div>
      </div>
      <div class="d-flex flex-column col-2 mx-1">
        <div v-for="weaponUpgrade of tier10Upgrades" :key="weaponUpgrade.name">
          <Tooltip
            :tooltip="
              weaponDetails[weaponUpgrade.name].description +
              '\n' +
              (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl ? `costs: ${weaponDetails[weaponUpgrade.name].tier}` : 'max lvl')
            "
          >
            <Button
              class="mt-2 w-100 btn btn-primary shadow-none"
              @click="lvlWeaponUpgrade(weaponUpgrade)"
              @dblclick="lvlWeaponUpgradex8(weaponUpgrade)"
              :disabled="usedWeaponPoints < 70"
            >
              {{ weaponDetails[weaponUpgrade.name].name }}
              <br />
              lvl: {{ weaponUpgrade.lvl }}/{{ weaponDetails[weaponUpgrade.name].maxlvl }}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <Button class="btn btn-danger shadow-none" @click="resetWeaponTree()">reset weapontree</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { currentUser } from '../router';
import { weaponDetails, weaponAmount } from '../global';
import { findHouse, findlvlWeaponUpgrade } from '../game/helpers';
import * as music from '../music';
import * as type from '../types';
import { Button, Tooltip } from 'custom-mbd-components';

export default defineComponent({
  components: {
    Button,
    Tooltip,
  },
  setup() {
    currentUser;
    return {
      weaponDetails,
      weaponAmount,
      findHouse,
      findlvlWeaponUpgrade,
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
    usedWeaponPoints() {
      let allWeaponlvl = 0;
      for (let weaponUpgrade of this.player.weaponTree.weaponUpgrades) allWeaponlvl += weaponUpgrade.lvl * weaponDetails[weaponUpgrade.name].tier;
      return allWeaponlvl;
    },
    tier1Upgrades() {
      let tier1 = [] as type.WeaponUpgrade[];
      for (let upgrade of this.player.weaponTree.weaponUpgrades) {
        if (weaponDetails[upgrade.name].tier == 1 && weaponDetails[upgrade.name].maxlvl != 1) {
          tier1.push(upgrade);
        }
      }
      tier1.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (weaponDetails[a.name].maxlvl < weaponDetails[b.name].maxlvl ? -1 : 1));
      return tier1;
    },
    tier2Upgrades() {
      let tier2 = [] as type.WeaponUpgrade[];
      for (let upgrade of this.player.weaponTree.weaponUpgrades) {
        if (weaponDetails[upgrade.name].tier == 2 && weaponDetails[upgrade.name].maxlvl != 1) {
          tier2.push(upgrade);
        }
      }
      tier2.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (weaponDetails[a.name].maxlvl < weaponDetails[b.name].maxlvl ? -1 : 1));
      return tier2;
    },
    tier10Upgrades() {
      let tier10 = [] as type.WeaponUpgrade[];
      for (let upgrade of this.player.weaponTree.weaponUpgrades) {
        if (weaponDetails[upgrade.name].tier == 10 && weaponDetails[upgrade.name].maxlvl != 1) {
          tier10.push(upgrade);
        }
      }
      tier10.sort((a, b) => (a.name < b.name ? -1 : 1)).sort((a, b) => (weaponDetails[a.name].maxlvl < weaponDetails[b.name].maxlvl ? -1 : 1));
      return tier10;
    },
  },
  mounted() {
    this.player = this.playerProp;
    this.dataLoad = true;
  },
  methods: {
    lvlWeaponUpgrade(weaponUpgrade: type.WeaponUpgrade) {
      let counter = 1;
      if (weaponDetails[weaponUpgrade.name].tier < 10) {
        if (this.pressedKeys['Shift'])
          counter =
            weaponDetails[weaponUpgrade.name].maxlvl +
            (findHouse(this.player, 'weapon') +
              findlvlWeaponUpgrade(this.player, ('tier' + weaponDetails[weaponUpgrade.name].tier) as type.LvlWeaponUpgradeName)) *
              2;
        for (let i = 0; i < counter; i++) {
          if (
            weaponUpgrade.lvl <
            weaponDetails[weaponUpgrade.name].maxlvl +
              (findHouse(this.player, 'weapon') +
                findlvlWeaponUpgrade(this.player, ('tier' + weaponDetails[weaponUpgrade.name].tier) as type.LvlWeaponUpgradeName)) *
                2
          )
            if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints >= weaponDetails[weaponUpgrade.name].tier) {
              weaponUpgrade.lvl++;
              if (i == 0) this.buttonSound();
            }
        }
      } else {
        if (this.pressedKeys['Shift']) counter = weaponDetails[weaponUpgrade.name].maxlvl;
        for (let i = 0; i < counter; i++) {
          if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
            if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints >= weaponDetails[weaponUpgrade.name].tier) {
              weaponUpgrade.lvl++;
              if (i == 0) this.buttonSound();
            }
        }
      }
    },
    lvlWeaponUpgradex8(weaponUpgrade: type.WeaponUpgrade) {
      for (let i = 0; i < 8; i++) {
        if (weaponDetails[weaponUpgrade.name].tier < 10) {
          if (
            weaponUpgrade.lvl <
            weaponDetails[weaponUpgrade.name].maxlvl +
              (findHouse(this.player, 'weapon') +
                findlvlWeaponUpgrade(this.player, ('tier' + weaponDetails[weaponUpgrade.name].tier) as type.LvlWeaponUpgradeName)) *
                2
          )
            if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints >= weaponDetails[weaponUpgrade.name].tier) {
              weaponUpgrade.lvl++;
            }
        } else {
          if (weaponUpgrade.lvl < weaponDetails[weaponUpgrade.name].maxlvl)
            if (this.player.weaponTree.weaponPoints - this.usedWeaponPoints >= weaponDetails[weaponUpgrade.name].tier) {
              weaponUpgrade.lvl++;
            }
        }
      }
    },
    resetWeaponTree() {
      this.buttonSound();
      this.player.weaponTree.weaponPoints -= this.usedWeaponPoints;
      for (let weaponUpgrade of this.player.weaponTree.weaponUpgrades) {
        this.player.weaponTree.weaponPoints += weaponUpgrade.lvl * weaponDetails[weaponUpgrade.name].tier;
        weaponUpgrade.lvl = 0;
      }
    },
    buttonSound() {
      music.ButtonSound(this.player.settings.effectVolume);
    },
  },
});
</script>

<style scoped lang="scss"></style>
