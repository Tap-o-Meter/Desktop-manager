<template>
  <div class="wrapper salesPage d-flex flex-column align-center no-scroll">
    <v-container fluid class="pt-0 ">
      <v-row class="black-gradient bottom-round elevation-5">
        <v-col cols="12" class="pb-0">
          <div
            class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
          >
            <span class="header-1-alt ultra-thin">Ventas</span>
          </div>
        </v-col>
        <v-col cols="12" class="px-8 py-1 d-flex">
          <div class="">
            <h2 class="white--text">-Mayo</h2>
          </div>
          <v-spacer />
          <div class="d-flex justify-center align-center" style="width:220px">
            <v-select
              :placeholder="currentMonth"
              :items="months"
              item-text="name"
              item-value="value"
              flat
              solo
              dense
              v-on:change="changeRoute"
              v-model="period"
              hide-details
              background-color="#f5f5f5"
              prefix="Perido: "
            ></v-select>
          </div>
        </v-col>
        <v-col cols="2" class="pt-0">
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
        </v-col>

        <v-col cols="10" class="pt-0">
          <LineChart
            :height="330"
            class="mt-5 mb-5"
            :labels="chartLabels"
            :name="chartName"
            :suffix="chartSuffix"
            :data="chartData"
          />
        </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col cols="6">
          <v-card elevation="0">
            <v-card-title>
              <v-icon color="amber accent-3" size="27">mdi-star-outline</v-icon>
              <span class="header-3-alt thin ml-1">Trabajadores</span>
              <v-spacer />
              <v-text-field
                dense
                solo
                flat
                v-model="searchWorker"
                placeholder="Buscar"
                background-color="#f5f5f5"
                prepend-inner-icon="mdi-magnify"
              />
            </v-card-title>
            <v-data-table
              :headers="workerHeaders"
              :items="workers"
              class="elevation-0 d-flex flex-column"
              style="height:347px;"
              :items-per-page="5"
              :search="searchWorker"
              @click:row="gottoWorker"
            >
              <template v-slot:item.nombre="{ item }">
                {{ item.nombre + " " + item.apellidos }}
              </template>
              <template v-slot:item.sales="{ item }">
                <v-chip
                  :color="getColor(sum(getCounter(item._id)))"
                  v-text="sum(getCounter(item._id))"
                  dark
                />
              </template>
              <template v-slot:item.pints="{ item }">
                <span v-text="getCounter(item._id).pints" />
              </template>
              <template v-slot:item.growlers="{ item }">
                <span v-text="getCounter(item._id).growlers" />
              </template>
              <template v-slot:item.tasters="{ item }">
                <span v-text="getCounter(item._id).tasters" />
              </template>
            </v-data-table>
          </v-card>
        </v-col>
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
              style="height:347px;"
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
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { LineChart } from "../components/charts";
import { mapState, mapGetters } from "vuex";
import config from "../config";
import Api from "../service/api";
export default {
  components: { LineChart },
  computed: {
    ...mapState("Session", ["workers"]),
    ...mapState("Lines", ["lines"]),
    ...mapGetters("Lines", ["getLineNames", "getQtyByLine"]),
    ...mapGetters("Session", ["getNames"]),
    ...mapGetters("Sales", [
      "getSalesConter",
      "getCounterByLines",
      "getDumpByLines",
      "getSalesByWorker"
    ]),
    lineSales() {
      return this.getCounterByLines(this.lines);
    },
    selectedMonth() {
      return config.months[this.period].name;
    },
    currentMonth() {
      return config.currentMonth().name;
    },
    months() {
      return config.months.filter(
        month => month.value <= config.currentMonth().value
      );
    }
  },
  watch: {
    item: function(newVal, oldVal) {
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
    }
  },
  data() {
    return {
      searchWorker: "",
      searchBarrel: "",
      sales: [],
      headers: [
        { text: "# LINEA", sortable: false, value: "noLinea" },
        { text: "VENTAS", value: "sales" },
        { text: "VASOS", value: "pints" },
        { text: "GROWLERS", value: "growlers" },
        { text: "TASTERS", value: "tasters" }
      ],
      workerHeaders: [
        { text: "TRABAJADORES", sortable: false, value: "nombre" },
        { text: "VENTAS", value: "sales" },
        { text: "VASOS", value: "pints" },
        { text: "GROWLERS", value: "growlers" },
        { text: "TASTERS", value: "tasters" }
      ],
      item: null,
      items: [
        { text: "Ventas", icon: "mdi-currency-usd" },
        { text: "Mermas", icon: "$beerTap" },
        { text: "Trabajadores", icon: "mdi-account-hard-hat" }
      ],
      chartName: "Cant. vendida",
      chartSuffix: "L",
      chartData: [],
      chartLabels: [],
      charts: [
        { chartName: "Cant. vendida", chartSuffix: "L", chartData: [] },
        { chartName: "Cant. mermada", chartSuffix: "L", chartData: [] },
        { chartName: "Cant. Vendida", chartSuffix: "L", chartData: [] }
      ],
      period: -1
    };
  },
  methods: {
    getColor(sales) {
      if (sales > 200) return "green";
      else if (sales > 100) return "orange";
      else return "red";
    },
    getCounter(workerId) {
      return this.getSalesConter(workerId);
    },
    sum(sales) {
      return sales.growlers + sales.pints;
    },
    gottoWorker(value) {
      this.$router.push({ name: "worker-details", params: { id: value._id } });
    },
    gottoLine(value) {
      console.warn(value);
      this.$router.push({ name: "line-details", params: { id: value.id } });
    }
  },
  mounted: async function() {
    this.period = config.currentMonth().value;
    this.$store.dispatch("Sales/getSales");
    this.item = 0;
    this.charts[0].chartData = this.getQtyByLine;
    this.charts[1].chartData = this.getDumpByLines(this.lines);
    this.charts[2].chartData = this.getSalesByWorker(this.workers);
  }
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

  .titleWrapper {
    z-index: 1;
    position: sticky;
    width: 100%;
    top: 0;
    background-color: transparent;
    min-height: 60px;
    * {
      color: white !important;
    }
  }
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
    height: 59px;
  }
  .v-data-footer__select {
    display: none;
  }
}
</style>
