<template>
  <div class="dashboard d-flex flex-column custom-scroll">
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
                  <v-col v-if="indexKeg != null" cols="5" class="pt-0">
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
                                  {{
                                    keg.available > 0 ? fixIt(keg.available) : 0
                                  }}
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
              <v-card-title>
                <v-icon size="32" left v-html="'mdi-star'" />
                <span class="title font-weight-light">Top de trabajadores</span>
              </v-card-title>
              <v-card-text
                v-if="topWorkers[0]"
                class="d-flex flex-column align-center px-0 no-scroll"
                style="overflow: scroll; max-height:355px; overflow-x: hidden;"
              >
                <v-avatar color="blue" size="130" style="min-height: 130px">
                  <v-img
                    :src="BASE_URL + '/getImage/' + topWorkers[0].foto"
                    v-if="topWorkers[0].foto"
                  />
                  <span class="white--text header-fg-alt" v-else>
                    {{
                      topWorkers[0].nombre.charAt(0) +
                        topWorkers[0].apellidos.charAt(0)
                    }}
                  </span>
                </v-avatar>
                <span
                  class="header-4-alt light mt-2 thin"
                  v-html="
                    '<b>1.-</b>' +
                      topWorkers[0].nombre +
                      ' ' +
                      topWorkers[0].apellidos
                  "
                />

                <p class="header-3-alt light">{{ topWorkers[0].qty + " L" }}</p>
                <v-list subheader two-line color="transparent">
                  <v-divider color="gray" class="mx-4" />
                  <v-list-item
                    v-for="(worker, index) in topWorkers"
                    v-if="index > 0"
                    :key="worker._id"
                  >
                    {{ index + 1 + ".-" }}
                    <v-list-item-avatar class="ml-2" color="grey">
                      <v-img
                        :src="BASE_URL + '/getImage/' + worker.foto"
                        v-if="worker.foto"
                      />
                      <span class="white--text header-5-alt" v-else>
                        {{
                          worker.nombre.charAt(0) + worker.apellidos.charAt(0)
                        }}
                      </span>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        v-text="worker.nombre + ' ' + worker.apellidos"
                      />

                      <v-list-item-subtitle
                        v-html="'cant. <b>' + worker.qty + '</b> Lts.'"
                      />
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn
                        icon
                        :to="{
                          name: 'worker-details',
                          params: { worker: worker }
                        }"
                      >
                        <v-icon color="grey lighten-1" v-text="'mdi-magnify'" />
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <div class="workersWrapper flex-column align-start justify-start mt-5">
        <span class="ml-7 header-3-alt ultra-thin">Trabajadores</span>
        <div class=" workersList d-flex pt-1 pb-3 align-end">
          <WorkerCell
            v-for="worker in formatWorkers"
            :worker="worker"
            class="mr-5"
          />
        </div>
      </div>
    </div>

    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import Api from "../service/api";
import { mapState, mapGetters } from "vuex";
import { socket, connectPort } from "../api";
import { WorkerCell, BarrelDashCell, ChipStat } from "../components/cells";
export default {
  name: "Dashboard",
  components: { WorkerCell, BarrelDashCell, ChipStat },
  data: () => ({
    indexKeg: null,
    search: "",
    cards: [],
    topWorkers: [],
    totalSold: 0,
    loader: false
  }),
  methods: {
    setSelected(key) {
      this.indexKeg = key;
    },
    beer(keg) {
      return this.getBeer(keg.beerId);
    },
    fixIt: n => (n - Math.floor(n) !== 0 ? n.toFixed(1) : n)
  },
  computed: {
    ...mapState("Session", ["workers", "BASE_URL"]),
    ...mapState("Lines", ["lines", "kegs"]),
    ...mapState("Sales", ["sales"]),
    ...mapState("CardReader", ["connected"]),
    ...mapGetters("Sales", ["getSalesByWorker"]),
    ...mapGetters("Stock", ["getCriticalStock"]),
    ...mapGetters("Lines", ["getKeg", "getBeer", "getCriticalKegs"]),
    keg() {
      const { getKeg, lines, indexKeg } = this;
      return getKeg(lines[indexKeg].idKeg);
    },
    formatWorkers() {
      if (this.sales !== null) {
        const workersSales = [];
        var totalSold = 0;
        this.getSalesByWorker(this.workers).forEach((item, i) => {
          workersSales.push({ ...this.workers[i], qty: item });
          totalSold += parseFloat(item);
        });
        this.totalSold = totalSold.toFixed(2);
        return workersSales;
      } else return [];
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
      var criticalStock = this.getCriticalStock;
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
        icon: "$beerTap",
        color: "yellowgradient",
        type: "VENTAS",
        data: this.totalSold + "L",
        message: "",
        miniIcon: "",
        href: "sales"
      });
      cards.push({
        icon: "mdi-clipboard-list",
        color: "greenGradient",
        type: "INVENTARIO",
        data: criticalStock.length,
        message: criticalStock.length > 0 ? criticalStock[0].name : "",
        miniIcon: criticalStock.length > 0 ? "mdi-alert" : "",
        href: "inventario"
      });
      return cards;
    }
  },
  beforeMount: async function() {
    this.loader = true;
    try {
      let response = await Api().get("/getSummary");
      if (response.data.confirmation) {
        const { data } = response.data;

        const { kegs, lines, beers, emergencyCard } = data;
        const { stock, workers, placeInfo, sales } = data;

        const linesData = { data: kegs, lines, beers, emergencyCard };
        console.warn(linesData);
        this.$store.dispatch("Lines/setLines", linesData);
        this.$store.dispatch("Session/setWorkers", workers);
        this.$store.dispatch("Sales/setSales", sales);
        this.$store.dispatch("Stock/setStock", stock);
        this.$store.dispatch("Session/setPlaceInfo", placeInfo);
        this.indexKeg = this.lines.findIndex(line => line.idKeg.length > 0);
        this.loader = false;
      }
    } catch (e) {
      // alert("valio madres");
      this.loader = false;
    }
    // console.warn(this.kegs);
    // this.$store.dispatch("Sales/getSales");
    // this.$store.dispatch("Session/getWorkers");
    // this.$store.dispatch("Stock/getStock");

    socket().emit("desk_manager_connected");
    this.connected ? null : connectPort(null, this.$store);
  },

  watch: {
    sales: function(newVal, oldVal) {
      if (newVal !== null) {
        const workersSales = [];
        this.getSalesByWorker(this.workers).forEach((item, i) => {
          workersSales.push({ ...this.workers[i], qty: item });
        });
        workersSales.sort((a, b) => b.qty - a.qty);
        this.topWorkers = workersSales;
      }
    }
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
      overflow-y: hidden;
    }
  }
}
</style>
<style>
.v-progress-circular__overlay {
  stroke-linecap: round;
}
</style>
