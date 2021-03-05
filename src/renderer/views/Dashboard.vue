<template>
  <div class="dashboard d-flex flex-column">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Dashboard</span>
    </div>

    <div class="content d-flex flex-column pa-5">
      <v-container fluid>
        <v-row>
          <v-col v-for="(card, index) in chips" :key="index" cols="3">
            <ChipStat :data="card" />
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row>
          <v-col cols="8">
            <v-card class="d-flex flex-column" min-height="420" elevation="0">
              <v-card-title class=" d-flex justify-space-between pb-1">
                <span class="header-3-alt ultra-thin">
                  <v-icon size="32" class="pb-2"> $beerTapOutline </v-icon>
                  Lineas
                </span>
                <v-btn
                  text
                  color="#8e44ad"
                  class="header-5-alt"
                  :to="{ name: 'barrels' }"
                >
                  Ver más <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-title>
              <v-container fluid class="pt-0">
                <v-row>
                  <v-col cols="7" class="pa-0">
                    <div
                      class="kegs custom-scroll d-flex flex-column align-center"
                    >
                      <BarrelDashCell
                        v-for="(line, index) in lines"
                        v-if="line.idKeg.length > 0"
                        :key="index"
                        :clickHandler="setSelected"
                        :line="line"
                        :selected="index == indexKeg"
                      />
                    </div>
                  </v-col>
                  <v-col cols="5" class="pt-0">
                    <div class="detail ma-1 pa-1">
                      <span class="header-3-alt mb-5 ml-3">
                        {{ beer(keg).name }}
                      </span>
                      <p class="header-4-alt ml-3 mb-0">
                        {{ "-" + beer(keg).style }}
                      </p>
                      <v-container class="m-2 pt-0" fluid>
                        <v-row class="mt-1">
                          <v-col cols="7" offset="5" class="text-right pt-0">
                            <h3 class="header-3-alt thin">Merma</h3>
                            <p class="header-fg-alt ultra-thin red--text">
                              {{ keg.merma }}
                            </p>
                          </v-col>
                          <v-col
                            cols="5"
                            class="d-flex align-center justify-center pr-2 pt-0 pl-0 pb-0"
                          >
                            <v-progress-circular
                              :rotate="180"
                              :size="120"
                              :width="3"
                              :value="(keg.available / keg.capacity) * 100"
                              :color="
                                (keg.available / keg.capacity) * 100 > 50
                                  ? '#2ecc71'
                                  : '#e74c3c'
                              "
                            >
                              <div
                                class="d-flex justify-center align-center flex-column"
                              >
                                <p
                                  class="header-2-alt ultra-thin mb-1 accented"
                                >
                                  {{ fixIt(keg.available) }}
                                  <span class="header-5-alt light thin">
                                    /{{ fixIt(keg.capacity) }}L
                                  </span>
                                </p>
                                <span class="header-5-alt light bold">
                                  Restantes
                                </span>
                              </div>
                            </v-progress-circular>
                          </v-col>
                          <v-col cols="7" class="left-line pa-1">
                            <v-row>
                              <v-col
                                cols="6"
                                class="d-flex flex-column align-center pa-1"
                              >
                                <span class="header-1-alt ultra-thin">
                                  {{ keg.soldPints }}
                                </span>
                                <span class="header-6-alt light bold">
                                  V. vendidos
                                </span>
                              </v-col>
                              <v-col
                                cols="6"
                                class="d-flex flex-column align-center pa-1"
                              >
                                <span class="header-1-alt ultra-thin">
                                  {{ fixIt(keg.capacity - keg.available) }}
                                </span>
                                <span class="header-6-alt light bold">
                                  L. vendidos
                                </span>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col
                                cols="6"
                                class="d-flex flex-column align-center pa-1"
                              >
                                <span class="header-1-alt ultra-thin">
                                  {{ keg.taster }}
                                </span>
                                <span class="header-6-alt light bold">
                                  Tasters
                                </span>
                              </v-col>
                              <v-col
                                cols="6"
                                class="d-flex flex-column align-center pa-1"
                              >
                                <span class="header-1-alt ultra-thin">
                                  {{ keg.merma.toFixed(1) }}
                                </span>
                                <span class="header-6-alt light bold">
                                  Merma
                                </span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-container>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card
              class="mx-auto"
              min-height="420"
              elevation="0"
              dark
              :img="require('../assets/backgroundCard.svg')"
            >
              <v-card-text>
                <div>Word of the Day</div>
                <p class="display-1 text--white">
                  be•nev•o•lent
                </p>
                <p>adjective</p>
                <div class="text--white">
                  well meaning and kindly.<br />
                  "a benevolent smile"
                  {{ this.getWhereTheFuckIam }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text dark>
                  Learn More
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <div class="workersWrapper flex-column align-start justify-start mt-5">
        <span class="ml-7 header-3-alt ultra-thin">Trabajadores</span>
        <div class=" workersList d-flex pt-1 pb-3 align-end">
          <WorkerCell v-for="worker in workers" :worker="worker" class="mr-5" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { WorkerCell, BarrelDashCell, ChipStat } from "../components/cells";
import { mapState, mapGetters } from "vuex";
import { socket, connectPort } from "../api";
export default {
  name: "Dashboard",
  components: { WorkerCell, BarrelDashCell, ChipStat },
  data() {
    return {
      indexKeg: 0,
      search: "",
      cards: []
    };
  },
  methods: {
    setSelected(key) {
      this.indexKeg = key;
    },
    beer(keg) {
      return this.getBeer(keg.beerId);
    },
    fixIt(n) {
      return n - Math.floor(n) !== 0 ? n.toFixed(1) : n;
    }
  },
  computed: {
    getWhereTheFuckIam() {
      var fs = require("fs");
      var files = fs.readdirSync(__static + "/lottie");
      return files;
    },
    ...mapState("Session", ["workers"]),
    ...mapState("Lines", ["lines"]),
    ...mapGetters("Lines", ["getKeg", "getBeer", "getCriticalKegs"]),
    keg() {
      const { getKeg, lines, indexKeg } = this;
      return getKeg(lines[indexKeg].idKeg);
    },
    chips() {
      const cards = [];
      cards.push({
        icon: "mdi-account-hard-hat",
        color: "cyanGradient",
        type: "EN TURNO",
        data: "12",
        message: "2 aucentes",
        miniIcon: "mdi-account-off",
        href: "workers"
      });
      var criticalKegs = this.getCriticalKegs;
      cards.push({
        icon: "mdi-keg",
        color: "redGradient",
        type: "CRÍTICOS",
        data: criticalKegs.length,
        message:
          criticalKegs.length > 0
            ? this.getBeer(criticalKegs[0].beerId).name
            : "",
        miniIcon: criticalKegs.length > 0 ? "mdi-alert" : "",
        href: "barrels"
      });
      cards.push({
        icon: "mdi-currency-usd",
        color: "yellowgradient",
        type: "GANANCIAS",
        data: "$12,000",
        message: "",
        miniIcon: "",
        href: "sales"
      });
      cards.push({
        icon: "mdi-clipboard-list",
        color: "greenGradient",
        type: "INVENTARIO",
        data: "2",
        message: "Malta Pale Ale Weyermann 5 kg",
        miniIcon: "mdi-alert",
        href: "inventario"
      });
      return cards;
    }
  },
  beforeMount: function() {
    socket.emit("client connected");
    this.$store.dispatch("Session/getWorkers");
    this.$store.dispatch("Stock/getStock");
    connectPort(null, this.$store);
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/components";
@import "@/assets/styles/texts";
.dashboard {
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  .kegs {
    margin: 5px;
    height: 330px;
    overflow: scroll;
  }
  .detail {
    height: 100%;
    border-left: 1px solid rgb(235, 238, 244);
    .fistSection {
      flex: 1;
    }
    .secondSection {
      flex: 1;
      .dataWrapper {
        flex: 1;
      }
    }
    .barrelImage {
      width: 100px;
      height: 100px;
      margin-left: 25px;
      margin-right: 50px;
    }
  }
  .titleWrapper {
    z-index: 1;
    position: sticky;
    width: 100%;
    top: 0;
    background-color: snow;
    min-height: 60px;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.1) !important;
  }

  .content {
    flex: 1;
    width: 100%;
    .selected {
      transform: scale(1.1);
      border: 2px solid transparent;
      background-image: linear-gradient(white, white), $blue-gradient;
      background-origin: border-box;
      background-clip: content-box, border-box;
    }
    .workersWrapper {
      width: 100%;
      flex: 1;
      min-height: 450px;
    }
    .workersList {
      overflow: scroll;
      min-height: 180px;
    }
  }
}
</style>
<style>
.v-progress-circular__overlay {
  stroke-linecap: round;
}
</style>
