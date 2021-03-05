<template>
  <div class=" WorkerDetails wrapper d-flex flex-column align-center">
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
                :src="'http://beer-control.local:3000/getImage/' + worker.foto"
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
          <v-col cols="4" class="d-flex mt-3 flex-column">
            <span class="xs-bold-subtitles ">Nombre:</span>
            <span class="titles">
              {{ worker.nombre + " " + worker.apellidos }}
            </span>
            <span
              class="caption font-weight-bold"
              :class="worker.onWork ? ' green--text' : ' red--text'"
            >
              {{ worker.onWork ? "EN TURNO" : "DESCANSANDO" }}
            </span>
          </v-col>
          <v-col cols="4" class="d-flex mt-3 flex-column">
            <span class="xs-bold-subtitles ">No. de tarjeta:</span>
            <span class="titles">
              - <u>{{ worker.cardId }}</u>
            </span>
          </v-col>

          <v-col cols="2" class="d-flex justify-end">
            <v-btn class="ma-2" text color="success" :to="{ name: 'workers' }">
              <v-icon left>mdi-chevron-left</v-icon> back
            </v-btn>
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
            <div class="d-flex flex-column">
              <h1 class="ml-5 header-1-alt mt-5 light">
                Ventas <span class="header-6-alt light">(semanal)</span>
              </h1>
              <h1 class="ml-9 header-fg-alt">
                <span class="header-1">$</span> 11,200.
                <span class="header-1">70</span>
              </h1>
              <v-container fluid>
                <v-row>
                  <v-col :cols="7" class="pr-5">
                    <v-card :outlined="true" class="pt-5">
                      <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :items-per-page="5"
                        class="elevation-0"
                      />
                    </v-card>
                  </v-col>
                  <v-col :cols="5">
                    <BarChart :height="320" class="mt-5 mb-5" />
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="historyHeaders"
              :items="sales"
              :items-per-page="12"
              class="elevation-0 d-flex flex-column"
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
                  No hay Historial disponible
                </p>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-container fluid style="height:100%">
              <v-row style="height:100%">
                <v-col cols="9" class="justify-center align-center">
                  <v-calendar
                    v-if="generateDate.length > 0"
                    ref="calendar"
                    :weekdays="weekday"
                    type="week"
                    :events="generateDate"
                    :interval-height="50"
                    interval-minutes="120"
                    :interval-count="12"
                    event-overlap-mode="column"
                    :event-color="getEventColor"
                  />
                  <div
                    v-else
                    class="header-fg-alt light center-text d-flex justify-center align-center"
                    style="height:100%"
                  >
                    No hay horario disponible
                  </div>
                </v-col>
                <v-col cols="3" class="center-text pl-0">
                  <p class="header-2-alt">Opciones</p>
                  <v-btn
                    outlined
                    depressed
                    style="width: 100%"
                    color="primary"
                    class="mt-3"
                    @click.stop="dialog = true"
                  >
                    Editar
                  </v-btn>
                  <v-btn
                    outlined
                    depressed
                    style="width: 100%"
                    color="error"
                    class="mt-3"
                    @click.stop="confirm = true"
                  >
                    Eliminar
                  </v-btn>
                </v-col>
              </v-row>
              <SetSchedule
                :schedule="worker.horario"
                :open="dialog"
                :handleClose="closeModal"
                :workerId="worker._id"
              />
            </v-container>
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
import { BarChart } from "../components/charts";
import { SetSchedule, AddWorker } from "../components/modals";
import Api from "../service/api";
import config from "../config";
export default {
  name: "WorkerDetails",
  components: { BarChart, SetSchedule, AddWorker },
  data() {
    return {
      tab: null,
      dialog: false,
      editWorkerShow: false,
      sales: [],
      confirm: false,
      items: ["Ventas", "Historial", "Horario"],
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
      events: []
    };
  },
  computed: {
    ...mapGetters("Session", ["getWorker"]),
    ...mapGetters("Lines", ["getKeg", "getBeer"]),
    worker() {
      return this.getWorker(this.$route.params.id);
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
    closeModal() {
      this.dialog = false;
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
    let response = await Api().post("/worker_sales", {
      id: this.worker._id
    });
    this.sales = response.data.data;
    console.log(response.data);
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
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
