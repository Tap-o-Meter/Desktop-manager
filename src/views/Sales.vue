<template>
  <div class="wrapper salesPage d-flex flex-column align-center no-scroll">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-5">
        Ventas <br />
        <h3 class="">{{ months[period].name }}</h3>
      </span>
      <div class="d-flex justify-center align-center" style="width: 220px">
        <v-select
          :placeholder="currentMonth"
          :items="months"
          item-text="name"
          item-value="value"
          solo
          dense
          v-on:change="changeRoute"
          v-model="period"
          hide-details
          background-color="#f5f5f5"
          prefix="Perido: "
        ></v-select>
      </div>
    </div>

    <v-container fluid class="pt-0">
      <v-row class="mt-5 mb-4">
        <v-col v-for="(card, index) in chips" :key="index" cols="3">
          <ChipStat2 :data="card" />
        </v-col>
      </v-row>
      <v-row>
        <!-- <v-col cols="2" class="pt-0">
          <v-list flat dark height="100%" class="transparent pt-0">
            <v-subheader>REPORTES</v-subheader>
            <v-list-item-group v-model="item" class="list-color">
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col> -->

        <v-col cols="7" class="pt-0">
          <v-card class="black-gradient">
            <h3 class="header-3 white--text ml-10 pt-5">Ventas por taps</h3>
            <LineChart
              :height="330"
              class="pl-8 pr-10 pb-3 pt-8"
              :labels="chartLabels"
              :name="chartName"
              :suffix="chartSuffix"
              :data="chartData"
            />
          </v-card>
        </v-col>

        <v-col cols="5" class="pt-0">
          <v-card height="100%">
            <v-card-title>
              <span class="body-4 normal-weight grey--text ml-1">
                Desglose de ventas
              </span>
              <v-spacer />
              <v-btn-toggle
                v-model="toggle_sales_summary"
                class="transparent border mr-3"
              >
                <v-btn x-small outlined>Vasos</v-btn>
                <v-btn x-small outlined>Tasters</v-btn>
                <v-btn x-small outlined>Growlers</v-btn>
                <v-btn x-small outlined color="red">Merma</v-btn>
              </v-btn-toggle>
            </v-card-title>

            <v-data-table
              :headers="sales_by_concept_headers[toggle_sales_summary]"
              :items="lineSales"
              v-if="lineSales.length > 0"
              class="elevation-0 d-flex flex-column"
              style="height: 347px"
              :items-per-page="5"
              :search="searchWorker"
              @click:row="gottoWorker"
            >
              <template v-slot:item.noLinea="{ item }">
                <span
                  v-text="`#${item.noLinea} - ${getLineByName(item.noLinea)}`"
                />
              </template>
              <template v-slot:item.1st="{ item }">
                <span v-text="fullSales(item, 0)" />
              </template>
              <template v-slot:item.2nd="{ item }">
                <span v-text="fullSales(item, 1)" />
              </template>
              <template v-slot:item.3th="{ item }">
                <span v-text="fullSales(item, 2)" />
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="3" class="pt-0">
          <v-card height="100%">
            <v-card-title class="pb-1">
              <span class="body-4 normal-weight grey--text ml-1">
                Ventas por concepto
              </span>
            </v-card-title>
            <v-list>
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="(item, i) in sales_concepts_headers"
                  :key="i"
                >
                  <v-list-item-content class="concepts-cells">
                    <v-list-item-title class="d-flex flex-column">
                      <div class="body-4 grey--text">
                        <v-icon v-text="item.icon"></v-icon>
                        <span v-text="item.text" />
                      </div>
                      <div
                        class="mx-6 my-2 d-flex justify-space-between align-end"
                      >
                        <div
                          v-for="(type, index) in item.types"
                          class="green--text"
                        >
                          <span
                            v-html="getCounterAllSales[item.value][index]"
                          />
                          <span
                            class="ml-2 xs-subtitles bold black--text"
                            v-text="type"
                          />
                        </div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="6" class="pt-0">
          <v-card elevation="0">
            <v-card-title>
              <v-icon color="amber accent-3" size="27">mdi-star-outline</v-icon>
              <span class="header-3-alt thin ml-1">Personal</span>
              <v-spacer />
              <v-btn-toggle
                v-model="toggle_total_sales"
                class="transparent border mr-3"
              >
                <v-btn x-small outlined>Vasos</v-btn>
                <v-btn x-small outlined>Tasters</v-btn>
                <v-btn x-small outlined>Growlers</v-btn>
                <v-btn x-small outlined color="red">Merma</v-btn>
              </v-btn-toggle>
            </v-card-title>
            <v-data-table
              :headers="workerHeaders[toggle_total_sales]"
              :items="workers"
              class="elevation-0 d-flex flex-column"
              style="height: 300px"
              :items-per-page="4"
              :search="searchWorker"
              @click:row="gottoWorker"
            >
              <template v-slot:item.nombre="{ item }">
                {{ item.nombre + " " + item.apellidos }}
              </template>

              <template v-slot:item.1st="{ item }">
                <span v-text="getCounter(item._id, 0)" />
              </template>
              <template v-slot:item.2nd="{ item }">
                <span v-text="getCounter(item._id, 1)" />
              </template>
              <template v-slot:item.3th="{ item }">
                <span v-text="getCounter(item._id, 2)" />
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="3" class="pt-0">
          <v-card height="100%">
            <v-card-title class="pb-1 px-6">
              <span class="body-4 normal-weight grey--text ml-1">
                Cerveza más vendida
              </span>
            </v-card-title>
            <div class="px-8 py-3">
              <div class="d-flex">
                <v-avatar tile color="blue" size="95">
                  <v-icon dark> mdi-alarm </v-icon>
                </v-avatar>
                <div style="flex: 1" class="px-3 d-flex flex-column pt-4">
                  <p class="body-5 bold mb-0 light">
                    {{ chartLabels[maxMinLines.max] }}
                  </p>
                  <div class="s-light-subtitles">hola</div>
                  <div style="flex: 1" class="d-flex flex-row-reverse">
                    <div class="d-flex flex-column">
                      <div>
                        <b class="green--text">{{
                          getQtyByLine[maxMinLines.max]
                        }}</b>
                        <span class="xs-subtitles">lts</span>
                      </div>
                      <div style="margin-top: -5px" class="xs-subtitles bold">
                        vendidos.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="body-3 normal-weight grey--text ml-1 mt-7">
                Cerveza menos vendida
              </div>
              <div class="d-flex flex-row-reverse">
                <v-avatar tile color="blue" size="95">
                  <v-icon dark> mdi-alarm </v-icon>
                </v-avatar>
                <div style="flex: 1" class="px-3 d-flex flex-column pt-4">
                  <p class="body-5 bold mb-0 light text-right">
                    {{ chartLabels[maxMinLines.min] }}
                  </p>
                  <div class="s-light-subtitles text-right">hola</div>
                  <div style="flex: 1" class="d-flex">
                    <div class="d-flex flex-column">
                      <div>
                        <b class="green--text">
                          {{ getQtyByLine[maxMinLines.min] }}
                        </b>
                        <span class="xs-subtitles">lts</span>
                      </div>
                      <div style="margin-top: -5px" class="xs-subtitles bold">
                        vendidos.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <v-row class="mt-2">
                <v-col class="px-1">
                  <div>
                    <v-avatar tile size="20" color="rgba(0,0,0,.2)">
                      <v-icon
                        size="15"
                        color="black"
                        v-text="'mdi-credit-card'"
                      />
                    </v-avatar>
                    ventas
                  </div>
                  <p class="header-3-alt bold">22</p>
                  <v-progress-linear
                    color="deep-purple accent-4"
                    rounded
                    height="8"
                  />
                </v-col>
                <v-col class="px-1">
                  <div>
                    <v-avatar tile size="20" color="rgba(0,0,0,.2)">
                      <v-icon
                        size="15"
                        color="black"
                        v-text="'mdi-water-alert'"
                      />
                    </v-avatar>
                    merma
                  </div>
                  <p class="header-3-alt bold">22</p>
                  <v-progress-linear
                    color="deep-purple accent-4"
                    rounded
                    height="8"
                  />
                </v-col>
                <v-col class="px-1">
                  <div>
                    <v-avatar tile size="20" color="rgba(0,0,0,.2)">
                      <v-icon
                        size="15"
                        color="black"
                        v-text="'mdi-check-bold'"
                      />
                    </v-avatar>
                    disp.
                  </div>
                  <p class="header-3-alt bold">22</p>
                  <v-progress-linear
                    color="deep-purple accent-4"
                    rounded
                    height="8"
                  />
                </v-col>
              </v-row> -->
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- <v-row class="mt-5">
        <v-col cols="6">
          <v-card elevation="0">
            <v-card-title class="d-flex justify-center">
              <v-icon color="#43a047" size="27">$beerTapOutline</v-icon>
              <span class="header-3-alt thin ml-1"> Líneas</span>
              <v-spacer />
              <v-text-field
                dense
                solo
                flat
                v-model="searchBarrel"
                placeholder="Buscar"
                background-color="#f5f5f5"
                prepend-inner-icon="mdi-magnify"
              />
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="lineSales"
              class="elevation-0 d-flex flex-column"
              style="height: 347px"
              :items-per-page="5"
              :search="searchBarrel"
              @click:row="gottoLine"
            >
              <template v-slot:item.sales="{ item }">
                <v-chip
                  :color="getColor(sum(item.count))"
                  dark
                  v-text="sum(item.count)"
                />
              </template>
              <template v-slot:item.pints="{ item }">
                <span v-text="item.count.pints" />
              </template>
              <template v-slot:item.growlers="{ item }">
                <span v-text="item.count.growlers" />
              </template>
              <template v-slot:item.tasters="{ item }">
                <span v-text="item.count.tasters" />
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row> -->
    </v-container>
  </div>
</template>
<script>
import config from "../config";
import Api from "../service/api";
import { mapState, mapGetters } from "vuex";
import { ChipStat2 } from "../components/cells";
import { LineChart } from "../components/charts";

export default {
  components: { LineChart, ChipStat2 },
  watch: {
    item: function (newVal, oldVal) {
      const chart = this.charts[newVal];
      this.chartName = chart.chartName;
      this.chartSuffix = chart.chartSuffix;
      this.chartData = chart.chartData;
      this.chartLabels =
        newVal == 0
          ? this.getLineNames
          : newVal == 1
          ? this.getLineNames
          : this.getNames;
    },
  },
  data: () => ({
    toggle_total_sales: 0,
    toggle_sales_summary: 0,
    searchWorker: "",
    searchBarrel: "",
    sales: [],
    sales_by_concept_headers: [
      [
        { text: "# LINEA", sortable: false, value: "noLinea" },
        { text: "8 Oz", value: "1st", align: "center", width: "105" },
        { text: "10 Oz", value: "2nd", align: "center", width: "105" },
        { text: "16 Oz", value: "3th", align: "center", width: "105" },
      ],
      [
        { text: "# LINEA", sortable: false, value: "noLinea" },
        { text: "2 Oz", value: "1st", align: "center", width: "105" },
        { text: "5 Oz", value: "2nd", align: "center", width: "105" },
      ],
      [
        { text: "# LINEA", sortable: false, value: "noLinea" },
        { text: "32 Oz", value: "1st", align: "center", width: "105" },
        { text: "64 Oz", value: "2nd", align: "center", width: "105" },
        { text: "128 Oz", value: "3th", align: "center", width: "105" },
      ],
      [
        { text: "# LINEA", sortable: false, value: "noLinea" },
        { text: "Merma", value: "1st", align: "center", width: "105" },
      ],
    ],
    sales_concepts_headers: [
      {
        text: "Vasos",
        icon: "mdi-beer",
        value: "pints",
        types: ["8 Oz", "10 Oz", "16 Oz"],
      },

      {
        text: "Growlers",
        value: "growlers",
        icon: "mdi-bottle-tonic",
        types: ["32 Oz", "64 Oz", "128 Oz"],
      },
      {
        text: "Tasters",
        icon: "mdi-glass-pint-outline",
        value: "tasters",
        types: ["2 Oz", "5 Oz"],
      },
    ],
    headers: [
      { text: "# LINEA", sortable: false, value: "noLinea" },
      { text: "VENTAS", value: "sales" },
      { text: "VASOS", value: "pints" },
      { text: "GROWLERS", value: "growlers" },
      { text: "TASTERS", value: "tasters" },
    ],
    workerHeaders: [
      [
        { text: "TRABAJADORES", sortable: false, value: "nombre" },
        { text: "8 Oz", value: "1st", align: "center", width: "105" },
        { text: "10 Oz", value: "2nd", align: "center", width: "105" },
        { text: "16 Oz", value: "3th", align: "center", width: "105" },
      ],
      [
        { text: "TRABAJADORES", sortable: false, value: "nombre" },
        { text: "2 Oz", value: "1st", align: "center", width: "105" },
        { text: "5 Oz", value: "2nd", align: "center", width: "105" },
      ],
      [
        { text: "TRABAJADORES", sortable: false, value: "nombre" },
        { text: "32 Oz", value: "1st", align: "center", width: "105" },
        { text: "64 Oz", value: "2nd", align: "center", width: "105" },
        { text: "128 Oz", value: "3th", align: "center", width: "105" },
      ],
      [
        { text: "TRABAJADORES", sortable: false, value: "nombre" },
        { text: "Merma", value: "1st", align: "center", width: "105" },
      ],
    ],
    sales_concept: {},
    item: null,
    items: [
      { text: "Ventas", icon: "mdi-currency-usd" },
      { text: "Mermas", icon: "$beerTap" },
      { text: "Trabajadores", icon: "mdi-account-hard-hat" },
    ],
    chartName: "Cant. vendida",
    chartSuffix: "L",
    chartData: [],
    chartLabels: [],
    charts: [
      { chartName: "Cant. vendida", chartSuffix: "L", chartData: [] },
      { chartName: "Cant. mermada", chartSuffix: "L", chartData: [] },
      { chartName: "Cant. Vendida", chartSuffix: "L", chartData: [] },
    ],
    period: -1,
  }),
  computed: {
    ...mapState("Lines", ["lines"]),
    ...mapState("Session", ["workers"]),
    ...mapGetters("Session", ["getNames"]),
    ...mapGetters("Lines", ["getLineNames", "getQtyByLine", "getLineByName"]),
    ...mapGetters("Sales", [
      "getSalesConter",
      "getCounterByLines",
      "getDumpByLines",
      "getSalesByWorker",
      "getFullCounterByLine",
      "getCounterAllSales",
      "getTotalMerma",
      "getTotaSales",
    ]),
    lineSales() {
      return this.getCounterByLines(this.connected_lines);
    },
    selectedMonth() {
      return config.months[this.period].name;
    },
    currentMonth() {
      return config.currentMonth().name;
    },
    maxMinLines() {
      var min_val_index = 0;
      var max_val_index = 0;
      var min_val = 0;
      var max_val = 0;
      this.getQtyByLine.forEach((qty_line, index) => {
        if (parseFloat(qty_line) >= max_val) {
          max_val = qty_line;
          max_val_index = index;
        }
        if (parseFloat(qty_line) <= min_val) {
          min_val = qty_line;
          min_val_index = index;
        }
      });
      return { min: min_val_index, max: max_val_index };
    },
    months() {
      return config.months.filter(
        (month) => month.value <= config.currentMonth().value
      );
    },
    chips() {
      const cards = [];
      cards.push({
        icon: "mdi-star",
        color: "cyanGradient",
        type: "Lts. vendidos",
        data: `${this.getTotaSales}Lts.`,
        message: "2 aucentes",
        miniIcon: "mdi-account-off",
        href: "workers",
      });
      cards.push({
        icon: "mdi-alert",
        color: "redGradient",
        type: "Merma en Lts.",
        data: `${this.getTotalMerma}Lts.`,
        message: "",
        miniIcon: "",
        href: "barrels",
      });
      cards.push({
        icon: "mdi-account-star",
        color: "yellowgradient",
        type: "Barriles terminados",
        data: "4",
        message: "",
        miniIcon: "",
        href: "sales",
      });
      cards.push({
        icon: "mdi-account-alert",
        color: "greenGradient",
        type: "Cantidad no contable",
        data: "10lts.",
        message: "",
        miniIcon: "",
        href: "inventario",
      });
      return cards;
    },
    connected_lines() {
      return this.lines.filter((line) => line.idKeg.length > 0);
    },
  },
  methods: {
    getColor(sales) {
      if (sales > 200) return "green";
      else if (sales > 100) return "orange";
      else return "red";
    },
    fullSales(line, index) {
      const { getFullCounterByLine, toggle_sales_summary } = this;
      return getFullCounterByLine(line).count[toggle_sales_summary][index];
    },
    getCounter(workerId, index) {
      const { getSalesConter, toggle_total_sales } = this;
      return Object.values(getSalesConter(workerId))[toggle_total_sales][index];
    },
    sum(sales) {
      return sales.growlers + sales.pints;
    },
    gottoWorker(value) {
      this.$router.push({ name: "worker-details", params: { worker: value } });
    },
    gottoLine(value) {
      console.warn(value);
      this.$router.push({ name: "line-details", params: { id: value.id } });
    },
    async changeRoute() {
      let response = await Api().get("/sales/" + this.period);
      if (response.data.confirmation === "success") {
        this.history = response.data.data;
      } else {
        console.log(response);
      }
    },
  },
  mounted: async function () {
    this.period = config.currentMonth().value;
    this.$store.dispatch("Sales/getSales");
    this.item = 0;
    this.charts[0].chartData = this.getQtyByLine;
    this.charts[1].chartData = this.getDumpByLines(this.lines);
    this.charts[2].chartData = this.getSalesByWorker(this.workers);
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";

.wrapper {
  flex: 1;
  min-width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  .concepts-cells {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .titleWrapper {
    z-index: 1;
    position: sticky;
    width: 100%;
    top: 0;
    background-color: snow;
    min-height: 70px;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.1) !important;
    .search {
      width: 300px;
    }
  }

  // .titleWrapper {
  //   z-index: 1;
  //   position: sticky;
  //   width: 100%;
  //   top: 0;
  //   background-color: transparent;
  //   min-height: 60px;
  //   * {
  //     color: white !important;
  //   }
  // }
  .list-color {
    color: $light-blue;
  }
  .bottom-round {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  .v-text-field {
    border-radius: 9px;
    font-size: 14px;
    max-width: 280px;
    max-height: 40px;
  }
  .barrelImage {
    width: 28px;
    height: 28px;
    margin-right: 5px;
    fill: red;
  }
}
</style>
<style lang="scss">
.salesPage {
  .v-data-table__wrapper {
    flex: 1;
  }
  .v-data-footer {
    height: 50px;
  }
  .v-data-footer__select {
    display: none;
  }
}
</style>
