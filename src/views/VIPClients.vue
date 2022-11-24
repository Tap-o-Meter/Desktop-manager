<template>
  <div class="clientsWrapper d-flex flex-column">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Chikilla VIP</span>
    </div>
    <div class="barrelsList d-flex flex-wrap justify-center"></div>

    <v-card class="ma-5 elevation-0" style="min-height:80% height:100%">
      <v-container fluid class="pa-1" style="position:stiky">
        <v-row class="ma-0">
          <v-col cols="2">
            <v-text-field
              dense
              solo
              flat
              v-model="search"
              placeholder="Buscar"
              background-color="#f5f5f5"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>

          <v-col cols="2" class="ml-auto">
            <v-select
              dense
              background-color="#f5f5f5"
              placeholder="Todas"
              prefix="Categoría: "
              :items="filters"
              v-model="filtro"
              label="Filtrar"
              solo
              flat
            />
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        :headers="headers"
        :items="applyFilter(filtro)"
        class="elevation-0 d-flex flex-column pt-2"
        style="min-height:80vh;"
        :items-per-page="15"
        :search="search"
        item-key="_id"
        @click:row="gottoWorker"
      >
        <template v-slot:item.name="{ item }">
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
      </v-data-table>
    </v-card>

    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
          dark
          class="mx-2"
          fab
          v-on="on"
          medium
          @click.stop="dialog = true"
          color="#00acc1"
        >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Nuevo cliente</span>
    </v-tooltip>

    <AddVIPClient :open="dialog" :handleClose="closeModal" />
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { BarrelCell } from "../components/cells";
import Api from "../service/api";
import config from "../config";
import {
  AddVIPClient,
  SubtractInventory,
  StockDetails
} from "../components/modals";
export default {
  name: "VIPClients",
  components: { BarrelCell, AddVIPClient, SubtractInventory, StockDetails },
  data() {
    return {
      loader: false,
      dialog: false,
      subtract: false,
      search: "",
      filtro: "",
      filters: [
        "Todos",
        "El Chikilla",
        "El Alcohólico",
        "Mi Hobbie",
        "Bebedor Social"
      ],
      Clients: [],
      headers: [
        { text: "NOMBRE", align: "start", value: "name" },
        { text: "NIVEL", value: "level", align: "start" },
        { text: "CERVEZAS TOMADAS", value: "beersDrinked", align: "center" },
        { text: "CERVEZAS GRATIS", value: "benefits.beers", align: "center" }
      ]
    };
  },
  computed: { ...mapState("Stock", ["stock"]) },
  methods: {
    applyFilter(filtro) {
      const levels = [""];
      return this.Clients.filter(client => {
        console.warn(config.cardLevels[client.level - 1] === filtro);
        return filtro === "Todos" || filtro === ""
          ? true
          : config.cardLevels[client.level - 1] === filtro;
      });
    },
    closeModal(should_reset) {
      this.dialog = false;
      if (should_reset) this.loadClients();
    },
    getLevel(level) {
      return config.cardLevels[level - 1];
    },
    getColor(level) {
      return config.getColorLevel(level);
    },
    parseHalfDate(date) {
      return config.parseHalfDate(date);
    },
    gottoWorker(value) {
      this.$router.push({ name: "client-details", params: value });
    },
    async loadClients() {
      this.loader = true;
      try {
        let response = await Api().get("/getClients");
        if (response.data.confirmation) {
          this.Clients = response.data.data;
          this.loader = false;
        }
      } catch (e) {
        this.loader = false;
      }
    }
  },
  beforeMount: async function() {
    this.loadClients();
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.clientsWrapper {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  .container {
    height: 60px;
    margin-top: 10px;
    padding: 0;
    padding-right: 3%;
    padding-left: 3%;
  }
  .v-text-field {
    border-radius: 9px;
    font-size: 14px;
  }
  .row {
    height: 60px;
  }
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
    .search {
      width: 300px;
    }
  }
  .mx-2 {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
}
</style>

<style media="screen" lang="scss">
.clientsWrapper {
  .v-data-table td {
    height: 90px !important;
  }
  .v-data-table__wrapper {
    flex: 1;
  }
  .v-data-footer {
    height: 59px;
    padding-right: 55px;
  }
  .v-data-footer__select {
    display: none;
  }
}
</style>
