<template>
  <div class="Line-details d-flex flex-column align-center no-scroll">
    <v-container fluid class="pt-0 ">
      <v-row
        class="black-gradient bottom-round elevation-5"
        style="height:506px"
      >
        <v-col cols="12" class="pb-0">
          <div
            class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
          >
            <span class="header-1-alt ultra-thin">Detalles</span>
            <v-btn class="ma-2" text color="white" :to="{ name: 'barrels' }">
              <v-icon left>mdi-chevron-left</v-icon> back
            </v-btn>
          </div>
        </v-col>
        <v-col cols="3" class="pl-10">
          <v-row>
            <v-avatar color="lightgray" size="120" tile>
              <v-img
                :lazy-src="require('@/assets/no-beer.svg')"
                :src="
                  beer.image !== null
                    ? BASE_URL + '/getImage/' + beer.image
                    : require('@/assets/no-beer.svg')
                "
              />
            </v-avatar>
            <v-col cols="7">
              <span class="header-4-alt thin white--text">
                LINEA #{{ line.noLinea }}
              </span>
              <router-link
                :to="{ name: 'keg-details', params: { id: beer._id } }"
              >
                <p class="header-3-alt thin white--text two-lines">
                  {{ beer.name }}
                </p>
              </router-link>
              <div class="d-flex justify-space-between px-2">
                <div class="d-flex flex-column align-center ">
                  <span class="xs-subtitles bold white--text">Estilo</span>
                  <span class="header-5-alt thin white--text">
                    {{ beer.style }}
                  </span>
                </div>
                <div class="d-flex flex-column align-center ">
                  <span class="xs-subtitles bold white--text">ABV</span>
                  <span class="header-5-alt thin white--text">
                    {{ keg.abv }}
                  </span>
                </div>
                <div class="d-flex flex-column align-center ">
                  <span class="xs-subtitles bold white--text">IBU</span>
                  <span class="header-5-alt thin white--text">
                    {{ keg.ibu }}
                  </span>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h6 class="header-5-alt white--text">CANTIDAD</h6>
              <div class="d-flex align-center mb-5">
                <v-progress-linear
                  color="cyan darken-2"
                  rounded
                  :value="available"
                />
                <h6 class="header-6-alt white--text ml-2" style="width:35px">
                  {{ this.available.toFixed(1) }}%
                </h6>
              </div>
              <h6 class="header-5-alt white--text">MERMA</h6>
              <div class="d-flex align-center mb-5">
                <v-progress-linear
                  color="light-green darken-2"
                  rounded
                  :value="merma"
                />
                <h6 class="header-6-alt white--text ml-2" style="width:35px">
                  {{ this.merma.toFixed(1) }}%
                </h6>
              </div>
              <h6 class="header-5-alt white--text">CANTIDAD</h6>
              <div class="d-flex align-center mb-5">
                <v-progress-linear
                  color="amber darken-2"
                  rounded
                  :value="available"
                />
                <h6 class="header-6-alt white--text ml-2" style="width:35px">
                  {{ this.available.toFixed(1) }}%
                </h6>
              </div>
              <v-btn
                outlined
                depressed
                style="width: 100%"
                color="error"
                class="mt-3"
                @click="confirmDisconnect()"
              >
                Desconectar línea
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="9" style="height:422px">
          <v-btn-toggle
            v-model="toggle_exclusive"
            dark
            class="transparent border mr-3"
          >
            <v-btn small outlined dark>
              Ventas
            </v-btn>
            <v-btn small outlined dark>
              Datos
            </v-btn>
          </v-btn-toggle>
          <v-slide-x-transition>
            <BarChart
              v-if="toggle_exclusive === 0"
              :labels="labels"
              :data="chartData"
              :suffix="''"
              class="mb-3"
              style="height:90%"
            />
            <div v-else class="white--text">
              más Informacíon
            </div>
          </v-slide-x-transition>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col cols="6" class="historial">
          <v-card elevation="0" class="px-2">
            <v-card-title class="d-flex justify-center">
              <v-icon color="#43a047" size="27">$salesRecord</v-icon>
              <span class="header-3-alt thin ml-1"> Historial de ventas</span>
              <v-spacer />
            </v-card-title>
            <v-data-table
              :headers="salesHeaders"
              :items="sales"
              class="elevation-0 d-flex flex-column"
              style="height:347px;"
              :items-per-page="5"
            >
              <template v-slot:item="{ item }">
                <tr :class="getClass(item.concept, item.workerId)">
                  <td
                    v-for="key in Object.keys(item)"
                    :key="key"
                    :class="key !== 'workerId' ? 'right' : ''"
                    v-if="item.workerId.length > 4"
                  >
                    <v-avatar
                      v-if="key === 'workerId'"
                      size="40"
                      color="grey"
                      class="mr-1"
                    >
                      <v-img
                        :src="
                          BASE_URL + '/getImage/' + worker(item.workerId).image
                        "
                        v-if="worker(item.workerId).image"
                      />
                      <span class="white--text header-6-alt" v-else>
                        {{ worker(item.workerId).nombre.charAt(0) }}
                      </span>
                    </v-avatar>
                    {{
                      key !== "workerId"
                        ? item[key]
                        : worker(item.workerId).nombre +
                          " " +
                          worker(item.workerId).apellidos
                    }}
                  </td>
                  <td v-else>
                    {{ key !== "workerId" ? item[key] : "Cortesía reclamada" }}
                  </td>
                </tr>
              </template>
              <template v-slot:item.image="{ item }">
                <v-avatar size="40" color="grey"> </v-avatar>
              </template>
              <template v-slot:no-data>
                <p class="header-3-alt thin black--text mt-10 secundary">
                  <v-icon size="35" class="pb-1">
                    mdi-calendar-remove-outline
                  </v-icon>
                  No hay ventas que mostrar
                </p>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card elevation="0" height="411">
            <v-card-title class="d-flex justify-center">
              <v-icon color="#43a047" size="27">$keg</v-icon>
              <span class="header-3-alt thin ml-1"> Historial de la línea</span>
              <v-spacer />
            </v-card-title>
            <v-data-table
              :headers="historyHeaders"
              :items="getLineHistory(line.noLinea)"
              class="elevation-0 d-flex flex-column"
              style="height:347px;"
              :items-per-page="5"
            >
              <template v-slot:item.beerId="{ item }">
                <span v-text="getBeer(item.beerId).name" />
              </template>
              <template v-slot:item.style="{ item }">
                <span v-text="getBeer(item.beerId).style" />
              </template>
              <template v-slot:no-data>
                <p class="header-3-alt thin black--text mt-10 secundary">
                  <v-icon size="35" class="pb-1">
                    mdi-calendar-remove-outline
                  </v-icon>
                  No hay barriles en inventario
                </p>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="confirm" max-width="390">
      <v-card class="pt-2 pl-2 pr-2 pb-1">
        <v-card-title>Desconectar línea</v-card-title>
        <v-card-text class="d-flex flex-row align-center">
          ¿Estás seguro que deseas desconectar la línea
          <b> {{ this.line.noLinea }}</b> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="confirm = false">
            Cancelar
          </v-btn>
          <v-btn color="primary darken-1" text @click="disconnectLine()">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { BarChart } from "../components/charts";

import Api from "../service/api";
export default {
  name: "LineDetails",
  components: { BarChart },
  data() {
    return {
      line: null,
      toggle_exclusive: 0,
      loader: false,
      confirm: false,
      sales: [],
      labels: [
        "Taster 2oz",
        "Taster 5oz",
        "Vaso 8oz",
        "Vazo 10oz",
        "Vazo 16oz",
        "Growler 32oz",
        "Growler 64oz",
        "Growler 128oz"
      ],
      chartData: [],
      salesHeaders: [
        {
          text: "TRABAJADOR",
          value: "workerId",
          sortable: false,
          align: "start"
        },
        { text: "VENTA", value: "concept", width: "45", sortable: false },
        { text: "CANTIDAD", value: "carbs", width: "45", sortable: false }
      ],
      historyHeaders: [
        { text: "Nombre", value: "beerId", align: "start", sortable: false },
        { text: "Estilo", value: "style", sortable: false },
        { text: "Fecha", value: "lastLine.date", width: "45" }
      ]
    };
  },
  computed: {
    ...mapGetters("Lines", [
      "getKeg",
      "getStatus",
      "getLine",
      "getBeer",
      "getLineHistory"
    ]),
    ...mapState("Session", ["BASE_URL"]),
    ...mapGetters("Session", ["getWorker"]),
    ...mapGetters("Sales", ["getLineSales"]),
    keg() {
      return this.getKeg(this.line.idKeg);
    },
    status() {
      return this.getStatus(this.line);
    },
    beer() {
      return this.getBeer(this.keg.beerId);
    },
    available() {
      return (this.keg.available / this.keg.capacity) * 100;
    },
    merma() {
      return (this.keg.merma / this.keg.capacity) * 100;
    }
  },
  beforeMount: async function() {
    this.line = this.getLine(this.$route.params.id);
    let response = await Api().post("/keg_sales", { kegId: this.line.idKeg });
    this.sales = JSON.parse(
      JSON.stringify(response.data.data, ["workerId", "concept", "qty"], 4)
    );
    this.chartData = this.getBeerSalesByConcept(this.sales);
  },
  methods: {
    getClass(concept, workerId) {
      if (workerId.length > 4) {
        if (concept == "MERMA") return "merma";
      } else return "claimed";
    },
    worker(workerId) {
      return this.getWorker(workerId);
    },
    getBeerSalesByConcept(sales) {
      const { kegId } = this.line;
      const categorySales = [
        0, //taster2oz
        0, //taster5oz
        0, //pint8oz
        0, //pint10oz
        0, //pint16oz
        0, //growler32oz
        0, //growler64oz
        0 //growler128oz
      ];
      console.log(sales);
      sales.forEach(sale => {
        if (sale.kegId === kegId) {
          switch (sale.concept) {
            case "PINT":
              if (sale.qty === ".236") categorySales[2]++;
              else if (sale.qty === ".296") categorySales[3]++;
              else if (sale.qty === ".473") categorySales[4]++;
              break;
            case "TASTER":
              if (sale.qty === ".06") categorySales[0]++;
              else if (sale.qty === ".142") categorySales[1]++;
              break;
            case "GROWLER":
              if (sale.qty === "1") categorySales[5]++;
              else if (sale.qty === "2") categorySales[6]++;
              else if (sale.qty === "4") categorySales[7]++;
              break;
            default:
          }
        }
      });
      return categorySales;
    },
    confirmDisconnect() {
      this.confirm = true;
    },
    async disconnectLine() {
      this.loader = true;
      let response = await Api().post("/disconnectLine", {
        noLinea: this.line.noLinea
      });
      this.loader = false;
      if (response.data.confirmation) {
        this.$store.dispatch("Lines/disableLine", { ...this.line });
        this.$router.push({ name: "barrels" });
      } else {
        console.log("valiste");
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";
.Line-details {
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  a {
    text-decoration: none;
  }
  .merma {
    background-color: rgba(255, 70, 75, 0.8);
    border-radius: 5px;
  }
  .merma td:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .merma td:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .merma:hover {
    background: rgba(255, 70, 75, 0.6) !important;
  }

  .claimed {
    background-color: green;
    border-radius: 5px;
  }

  .claimed:hover {
    background: GreenYellow !important;
  }

  .titleWrapper {
    z-index: 1;
    position: sticky;
    width: 100%;
    top: 0;
    background-color: transparent;
    min-height: 60px;
    * {
      color: white;
    }
  }
  .bottom-round {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  .border {
    border-radius: 5px;
  }
  .v-item-group {
    float: right;
  }

  .right {
    text-align: right;
    width: 45px;
  }
}
</style>
<style lang="scss">
.Line-details {
  .v-data-table__wrapper {
    flex: 1;
  }
  .v-data-footer {
    height: 59px;
  }
  .v-data-footer__select {
    display: none;
  }
}
</style>
