<template>
  <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <ScoreCard :bestPlayers="bestPlayersNormal" :player="player" title="normal" highscore="normal" />
      </div>
      <div class="carousel-item">
        <ScoreCard :bestPlayers="bestPlayersHardcore" :player="player" title="hardcore" highscore="hardcore" />
      </div>
      <div class="carousel-item">
        <ScoreCard :bestPlayers="bestPlayersTotalchaos" :player="player" title="totalchaos" highscore="totalchaos" />
      </div>
      <!-- <div class="carousel-item">
                <ScoreCard :bestPlayers="bestPlayersPlayTime" :player="player" title="played-time" highscore="playedTime" />
            </div> -->
    </div>
    <button
      @click="buttonSound()"
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleControls"
      data-bs-slide="prev"
      style="margin-top: 15vh"
    >
      <span aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
          <path
            d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
          />
        </svg>
      </span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      @click="buttonSound()"
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleControls"
      data-bs-slide="next"
      style="margin-top: 15vh"
    >
      <span aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
          <path
            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
          />
        </svg>
      </span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import * as API from '../API';
import * as type from '../types';
import { currentUser } from '../router';
import ScoreCard from '../components/ScoreCard.vue';
import { checkPlayer } from '../global';
import * as music from '../music';
export default defineComponent({
  data() {
    return {
      user: currentUser,
      player: {} as type.Player,
      view: 'hardcore',
      bestPlayersNormal: [] as type.User[],
      bestPlayersHardcore: [] as type.User[],
      bestPlayersTotalchaos: [] as type.User[],
      // bestPlayersPlayTime: [] as type.User[],
    };
  },
  async mounted() {
    let result = await API.getBestPlayers('player.highscore.normal');
    if (result) {
      this.bestPlayersNormal = result.reverse() as type.User[];
    }
    result = await API.getBestPlayers('player.highscore.hardcore');
    if (result) {
      this.bestPlayersHardcore = result.reverse() as type.User[];
    }
    result = await API.getBestPlayers('player.highscore.totalchaos');
    if (result) {
      this.bestPlayersTotalchaos = result.reverse() as type.User[];
    }
    // result = await API.getBestPlayers('player.playedTime')
    // if (result) {
    //     this.bestPlayersPlayTime = result.reverse() as type.User[]
    // }
    if (this.user) {
      try {
        let result = await API.getPlayer();
        if (result) {
          this.player = result.player;
        }
      } catch {
        API.logout();
      }
    }
    this.player = checkPlayer(this.player, this.user!) as type.Player;
    this.buttonSound();
  },
  methods: {
    buttonSound() {
      music.ButtonSound(this.player.settings.effectVolume);
    },
  },
  components: {
    ScoreCard,
  },
});
</script>
