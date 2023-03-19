<template>
  <div class=" WorkerDetails wrapper d-flex flex-column align-center no-scroll">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Detalles</span>
    </div>
    <div class="content d-flex flex-column">
      <v-container fluid>
        <v-row>
          <v-col cols="2" class="d-flex justify-end flex-column align-center">
            <v-avatar color="orange" size="130">
              <v-img
                :src="BASE_URL + '/getImage/' + worker.foto"
                v-if="worker.foto"
              />
              <span class="white--text header-fg-alt" v-else>
                {{ worker.nombre.charAt(0) + worker.apellidos.charAt(0) }}
              </span>
            </v-avatar>
            <v-btn class="mt-3" outlined @click.stop="editWorkerShow = true">
              <v-icon left v-text="'mdi-pencil'" />Editar
            </v-btn>
          </v-col>
          <v-col cols="10">
            <v-row>
              <v-col cols="4" class="d-flex mt-3 flex-column">
                <span class="xs-bold-subtitles ">Nombre:</span>
                <span class="titles bold">
                  {{ worker.nombre + " " + worker.apellidos }}
                </span>
                <span
                  class="caption font-weight-bold"
                  :class="worker.onWork ? ' green--text' : ' red--text'"
                >
                  {{ worker.onWork ? "STAFF" : null }}
                </span>
              </v-col>
              <v-col cols="5" class="d-flex mt-3 flex-column">
                <span class="xs-bold-subtitles ">No. de tarjeta:</span>
                <span class="titles">
                  - <u>{{ worker.cardId }}</u>
                </span>
              </v-col>

              <v-col cols="3" class="d-flex justify-end">
                <v-btn
                  class="ma-2"
                  text
                  color="success"
                  :to="{ name: 'workers' }"
                >
                  <v-icon left>mdi-chevron-left</v-icon> back
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <h1 class=" header-1-alt  cyan--text">
                  Credito
                  <span class="header-6-alt light">(restantes)</span>
                </h1>
                <h1 class="header-fg-alt">
                  {{ this.worker.beers.beers }}
                  <span class="header-1">Vasos</span>
                </h1>
              </v-col>
              <v-col class="d-flex align-end">
                <h1 class="ml-10 header-1-alt">
                  {{ this.worker.beers.tasters }}
                  <span class="header-2-alt">Tasters</span>
                </h1>
              </v-col>
              <v-col class="d-flex align-end">
                <h1 class="ml-10 header-1-alt">
                  {{ this.worker.beers.flight }}
                  <span class="header-2-alt">Flights</span>
                </h1>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <v-card
        class="mx-5 mb-5 d-flex flex-column flex-grow-1"
        elevation="0"
        style="height:100%"
      >
        <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
          <v-tab v-for="item in items" :key="item" class="header-4-alt thin ">
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" style="height:90%">
          <v-tab-item>
            <div class="d-flex flex-column" style="height:100%">
              <v-container fluid class="d-flex flex-column" style="height:100%">
                <v-row class="py-0" style="flex-grow:0">
                  <!-- <v-col cols="3">
                    <h1 class="ml-5 header-1-alt  cyan--text">
                      Credito
                      <span class="header-6-alt light">(restantes)</span>
                    </h1>
                    <h1 class="ml-9 header-fg-alt">
                      {{ this.worker.beers.beers }}
                      <span class="header-1">Vasos</span>
                    </h1>

                    <h1 class="ml-10 header-4-alt">
                      {{ this.worker.beers.tasters }}
                      <span class="header-4-alt">Tasters</span>
                    </h1>
                    <h1 class="ml-10 header-4-alt">
                      {{ this.worker.beers.flight }}
                      <span class="header-4-alt">Flights</span>
                    </h1>
                  </v-col> -->
                  <v-col cols="3">
                    <h1 class="ml-5 header-1-alt  green--text">
                      Consumo <span class="header-6-alt light">(Evento)</span>
                    </h1>
                    <h1 class="ml-9 header-fg-alt">
                      {{ this.worker.qty }}
                      <span class="header-1">lts.</span>
                    </h1>
                  </v-col>
                </v-row>
                <v-row class="pl-7 pt-8" style="height:50px; flex-grow:0">
                  <span class="header-2-alt light">Detalles</span>
                </v-row>
                <v-row class="mt-3 mb-5">
                  <v-col :cols="7">
                    <HorizontalBarChart
                      v-if="salesCounter.length > 0"
                      :data="salesCounter"
                      :labels="barLabels"
                      :onClickCallback="upDateConceptDetails"
                      :height="320"
                    />
                    <v-card
                      outlined
                      v-else
                      style="height:338px; width:100%;"
                      class="d-flex justify-center align-center px-10"
                    >
                      <span class="header-3-alt">
                        <v-icon v-text="'mdi-format-list-bulleted'" /> No hay
                        información que mostrar
                      </span>
                    </v-card>
                  </v-col>
                  <v-col :cols="5" class="pr-5">
                    <v-card :outlined="true" class="pt-5">
                      <div class="detail ma-1 pa-1">
                        <span class="header-3-alt mb-5 ml-3">
                          Desglose
                        </span>
                        <p class="header-4-alt ml-3 mb-0">
                          -{{ this.barLabels[this.desgloseIndex] }}
                        </p>
                        <v-container class="m-2 pt-0" fluid>
                          <v-row class="mt-1">
                            <v-col cols="7" offset="5" class="text-right pt-0">
                              <h3 class="header-3-alt thin">Merma</h3>
                              <p class="header-fg-alt ultra-thin red--text">
                                3
                              </p>
                            </v-col>
                            <v-col
                              cols="5"
                              class="d-flex align-center justify-center pr-2 pt-0 pl-0 pb-0"
                            >
                            </v-col>
                            <v-col cols="7" class="left-line pa-1">
                              <v-row>
                                <v-col
                                  cols="6"
                                  class="d-flex flex-column align-center pa-1"
                                >
                                  <span class="header-1-alt ultra-thin">
                                    3
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
                                    3
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
                                    3
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
                                    3
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
                      <!-- <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :items-per-page="5"
                        class="elevation-0"
                      /> -->
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="d-flex flex-column pt-3 mx-4" style="height:100%">
              <div class="px-4 d-flex mb-7">
                <div class="">
                  <h1>Durante el Evento</h1>
                  <h4>{{ this.history.length }} Consumidas</h4>
                </div>
                <v-spacer />
                <div
                  class="d-flex justify-center align-center"
                  style="width:220px"
                >
                  <!-- <v-select
                    :placeholder="currentMonth"
                    :items="months"
                    item-text="name"
                    item-value="value"
                    flat
                    solo
                    v-on:change="changeRoute"
                    v-model="period"
                    hide-details
                    background-color="#f5f5f5"
                    prefix="Perido: "
                  ></v-select> -->
                </div>
              </div>
              <v-divider></v-divider>
              <v-data-table
                :headers="historyHeaders"
                :items="history"
                :items-per-page="9"
                class="elevation-0 d-flex flex-column mt-1"
                style="height:100%"
              >
                <template v-slot:item.date="{ item }">
                  <span v-text="parseDate(item.date)" />
                </template>
                <template v-slot:item.qty="{ item }">
                  <span v-text="parseQty(item.qty)" />
                </template>
                <template v-slot:no-data>
                  <p
                    class="header-3-alt thin black--text secundary"
                    style="margin-top:120px"
                  >
                    <v-icon size="35" class="pb-1">
                      mdi-calendar-remove-outline
                    </v-icon>
                    No hay Ventas para mostrar
                  </p>
                </template>
              </v-data-table>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
    <AddWorker
      :worker="worker"
      content-class="dialog"
      :open="editWorkerShow"
      :handleClose="editWorkerClose"
    />
    <v-dialog v-model="confirm" max-width="390">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>Eliminar trabajador</v-card-title>
        <v-card-text class="d-flex flex-row align-center">
          ¿Estás seguro que deseas borrar a {{ this.worker.nombre }}?, al
          aconfirmar se borrará a {{ this.worker.nombre }} y también el registro
          de sus ventas.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="confirm = false">
            Cancelar
          </v-btn>
          <v-btn color="primary darken-1" text @click="deleteItem()">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { HorizontalBarChart } from "../components/charts";
import { SetSchedule, AddWorker } from "../components/modals";
import Api from "../service/api";
import config from "../config";
export default {
  name: "WorkerDetails",
  components: { HorizontalBarChart, SetSchedule, AddWorker },
  data() {
    return {
      tab: null,
      dialog: false,
      editWorkerShow: false,
      sales: [],
      confirm: false,
      desgloseIndex: 0,
      items: ["Resumen", "Historial"],
      barLabels: ["Vasos", "Tasters", "Growlers"],
      headers: [
        { text: "Dessert (100g serving)", sortable: false, value: "name" },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" }
      ],
      historyHeaders: [
        { text: "Cerveza", value: "beerName" },
        { text: "Concepto", value: "concept", align: "end" },
        { text: "Cantidad", value: "qty", align: "end" },
        { text: "Fecha", value: "date", align: "end" }
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%"
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%"
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%"
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%"
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        }
      ],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      value: "",
      events: [],
      salesCounter: [],
      period: 0,
      history: []
    };
  },
  computed: {
    ...mapGetters("Session", ["getWorker"]),
    ...mapState("Session", ["BASE_URL"]),
    ...mapGetters("Lines", ["getKeg", "getBeer"]),
    ...mapGetters("Sales", ["getMermaFromWorker"]),
    worker() {
      return this.$route.params.worker;
    },
    currentMonth() {
      return config.currentMonth().name;
    },
    selectedMonth() {
      return config.months[this.period].name;
    },
    months() {
      return config.months.filter(
        month => month.value <= config.currentMonth().value
      );
    },
    getMerma() {
      return this.getMermaFromWorker(this.worker);
    },
    sectionedSales() {
      var sections = { vasos: [], tasters: [], growlers: [] };
      this.sales.forEach((sale, i) => {
        switch (sale.concept) {
          case "PINT":
            sections.vasos.push(sale);
            break;
          case "TASTER":
            sections.tasters.push(sale);
            break;
          case "GROWLER":
            sections.growlers.push(sale);
            break;
        }
      });
      if (
        sections.vasos.length > 0 ||
        sections.tasters.length > 0 ||
        sections.growlers.length > 0
      ) {
        this.salesCounter = [
          sections.vasos.length,
          sections.tasters.length,
          sections.growlers.length
        ];
      }
    },
    generateDate() {
      var days = [];
      this.worker.horario.forEach((horario, i) => {
        const mainDate = new Date();
        mainDate.setDate(mainDate.getDate() - mainDate.getDay());
        const start = horario.from.split(":");
        const end = horario.to.split(":");
        horario.days.forEach((dia, i) => {
          const day = new Date(mainDate);
          const JsonEvent = {};
          day.setDate(day.getDate() + config.days[dia]);
          day.setHours(start[0]);
          day.setMinutes(start[1]);
          JsonEvent["start"] = config.ToString(day);
          day.setHours(end[0]);
          day.setMinutes(end[1]);
          JsonEvent["end"] = config.ToString(day);
          JsonEvent["color"] = "indigo";
          JsonEvent["name"] = this.worker.nombre + " " + this.worker.apellidos;
          days.push(JsonEvent);
        });
      });
      return days;
    }
  },
  methods: {
    getEventColor(event) {
      return event.color;
    },
    upDateConceptDetails(a) {
      console.log(a);
      this.desgloseIndex = a;
    },
    closeModal() {
      this.dialog = false;
    },
    async changeRoute() {
      console.log("esta shit está aquí");
      let response = await Api().post("/worker_sales", {
        id: this.worker._id,
        period: this.period
      });
      if (response.data.confirmation === "success") {
        this.history = response.data.data;
      } else {
        console.log(response);
      }
    },
    editWorkerClose() {
      this.editWorkerShow = false;
    },
    beerName(kegId) {
      const keg = this.getKeg(kegId);
      if (keg) {
        return keg.beerId ? this.getBeer(keg.beerId).name : null;
      } else {
        console.warn(kegId);
      }
    },
    parseQty(qty) {
      var formatedQty;
      if (qty.charAt(0) == "." || qty.charAt(0) == ".") {
        formatedQty = parseInt(qty.slice(qty.indexOf(".") + 1)).toString();
        formatedQty += " mL";
      } else {
        formatedQty = qty + " L";
      }
      return formatedQty;
    },
    parseDate(date) {
      return config.parseDate(date);
    }
  },
  mounted: async function() {
    this.period = config.currentMonth().value;
    let response = await Api().post("/worker_sales", { id: this.worker._id });
    console.log("las ventas 😫");
    console.log(response.data.data);
    this.sales = response.data.data;
    this.history = this.sales;
  },
  watch: {
    sales: function(newVal, oldVal) {
      if (newVal !== null) {
        this.sectionedSales;
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";
.wrapper {
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  .dialog {
    position: absolute;
    z-index: 4000;
  }
  .v-text-field {
    border-radius: 9px;
    font-size: 14px;
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
  .mx-2 {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .content {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .basil {
    background-color: #fffbe6 !important;
  }
  .v-tabs {
    flex-grow: 0;
  }
  .v-tab {
    text-transform: capitalize;
    border-bottom: 1px solid lightgray;
  }
}
</style>
<style lang="scss">
.WorkerDetails {
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
