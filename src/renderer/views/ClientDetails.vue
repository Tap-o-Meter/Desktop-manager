<template>
  <div class=" WorkerDetails wrapper d-flex flex-column align-center">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Cliente</span>
    </div>
    <div class="content d-flex flex-column">
      <v-container fluid>
        <v-row class="mx-5">
          <v-col cols="3" class="d-flex mt-3 flex-column">
            <span class="s-light-subtitles bold ">Nombre:</span>
            <span class="header-3-alt thin">
              {{ client.name + " " + client.lastName }}
              <v-btn
                fab
                dark
                x-small
                color="primary"
                class="ml-1"
                @click.stop="editWorkerShow = true"
              >
                <v-icon v-text="'mdi-pencil'" />
              </v-btn>
            </span>
            <v-chip
              :color="getColor(client.level)"
              dark
              small
              class="mt-2 pr-3 align-center"
              style="width:fit-content;"
            >
              <v-icon
                v-if="client.level == 4"
                size="16"
                v-text="'mdi-star'"
                class="mr-2"
              />
              <span v-text="getLevel(client.level)" />
            </v-chip>
          </v-col>

          <v-col cols="3" class="d-flex mt-3 flex-column">
            <span class="s-light-subtitles bold ">No. de tarjeta:</span>
            <span class="header-3-alt thin">
              - <u>{{ client.cardId }}</u>
            </span>
          </v-col>
          <v-col cols="3" class="d-flex mt-3 flex-column">
            <span class="s-light-subtitles bold ">Cliente desde:</span>
            <span class="header-3-alt thin">
              {{ this.parseHalfDate(client.clientSince) }}
            </span>
          </v-col>

          <v-col offset="1" cols="2" class="d-flex justify-end">
            <v-btn
              class="ma-2"
              text
              color="success"
              :to="{ name: 'VIPClients' }"
            >
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
            <v-container fluid style="height:100%">
              <v-row style="height:100%">
                <v-col cols="9" class="justify-center align-center">
                  <v-data-table
                    :headers="historyHeaders"
                    :items="history"
                    class="elevation-0 d-flex flex-column pt-2"
                    style="min-height:80vh;"
                    :items-per-page="15"
                    item-key="_id"
                  >
                    <!-- <template v-slot:item.name="{ item }">
                      <span class="header-4-alt ml-3">
                        {{ item.name + " " + item.lastName }}
                      </span>
                      <p
                        class="s-light-subtitles ml-3"
                        v-text="'-' + parseHalfDate(item.clientSince)"
                      />
                    </template>
                    <template v-slot:item.level="{ item }">
                      <v-chip :color="getColor(item.level)" dark>
                        <v-icon
                          v-if="item.level == 4"
                          size="16"
                          v-text="'mdi-star'"
                          class="mr-2"
                        />
                        <span v-text="getLevel(item.level)" />
                      </v-chip>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon
                            size="20"
                            class="mr-2"
                            @click.stop="
                              $router.push({ name: 'client-details', params: item })
                            "
                            v-on="on"
                            color="#00acc1"
                          >
                            mdi-magnify
                          </v-icon>
                        </template>
                        <span>Ver más</span>
                      </v-tooltip>
                    </template> -->
                    <template v-slot:item.date="{ item }">
                      <span v-text="parseDate(item.date)" />
                    </template>
                  </v-data-table>
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
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { BarChart } from "../components/charts";
import { SetSchedule, AddWorker } from "../components/modals";
import Api from "../service/api";
import config from "../config";
export default {
  name: "ClientDetails",
  components: { BarChart, SetSchedule, AddWorker },
  data() {
    return {
      tab: null,
      dialog: false,
      editWorkerShow: false,
      sales: [],
      loader: false,
      confirm: false,
      items: ["Historial", "Horario"],
      history: [],
      historyHeaders: [
        { text: "Cerveza", value: "beerName" },
        { text: "Concepto", value: "concept", align: "end" },
        { text: "Cantidad", value: "qty", align: "end" },
        { text: "Fecha", value: "date", align: "end" }
      ],
      value: ""
    };
  },
  computed: {
    ...mapGetters("Lines", ["getKeg", "getBeer"]),
    client() {
      return this.$route.params;
    }
  },
  beforeMount: async function() {
    this.loader = true;
    let response = await Api().get(
      "/client-purchase/" + this.$route.params._id
    );
    if (response.data.confirmation) {
      this.history = response.data.data;
      this.loader = false;
      console.log(response.data.data);
    }
  },
  methods: {
    closeModal() {
      this.dialog = false;
    },
    parseHalfDate(date) {
      return config.parseHalfDate(date);
    },
    getColor(level) {
      return config.getColorLevel(level);
    },
    getLevel(level) {
      return config.cardLevels[level - 1];
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
