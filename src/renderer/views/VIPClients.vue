<template>
  <div class="clientsWrapper d-flex flex-column">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Chikilla VIP</span>
    </div>
    <div class="barrelsList d-flex flex-wrap justify-center"></div>

    <v-card class="ma-5 elevation-0" style="min-height:80%">
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
              placeholder="Ordenar: # Linea"
              item-text="noLinea"
              item-value="_id"
              solo
              flat
            />
          </v-col>
          <v-col cols="2">
            <v-select
              dense
              background-color="#f5f5f5"
              placeholder="Categoría: Todas"
              item-text="noLinea"
              item-value="_id"
              label="Filtrar"
              solo
              flat
            />
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        :headers="headers"
        :items="Clients"
        class="elevation-0 d-flex flex-column pt-2"
        style="min-height:80vh;"
        :items-per-page="15"
        :search="search"
        item-key="_id"
        v-model="selected"
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
        </template>
      </v-data-table>
    </v-card>

    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-fab-transition>
          <v-btn
            v-show="selected.length < 1"
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
        </v-fab-transition>
      </template>
      <span>Nuevo cliente</span>
    </v-tooltip>

    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-fab-transition>
          <v-btn
            v-show="selected.length > 0"
            dark
            class="mx-2"
            fab
            medium
            v-on="on"
            @click.stop="addExtractQty(true)"
            color="#83d640"
          >
            <v-icon dark>mdi-arrow-right-bold-outline</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Extraer inventario</span>
    </v-tooltip>

    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-fab-transition>
          <v-btn
            v-show="selected.length > 0"
            dark
            class="mx-2"
            style="margin-bottom:70px"
            fab
            medium
            v-on="on"
            @click.stop="addExtractQty(false)"
            color="red"
          >
            <v-icon dark>mdi-arrow-left-bold-outline</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Agregar inventario</span>
    </v-tooltip>

    <AddVIPClient :open="dialog" :handleClose="closeModal" />
    <SubtractInventory
      :open="subtract"
      :isExtracting="isExtracting"
      :handleClose="closeSubtract"
      :items="selected"
    />
    <StockDetails
      :open="detailsModal"
      :handleClose="closeDetails"
      :item="itemToModify"
    />

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
      detailsModal: false,
      search: "",
      isExtracting: false,
      itemToDelete: -1,
      itemToModify: null,
      Clients: [],
      selected: [],
      headers: [
        { text: "NOMBRE", align: "start", value: "name" },
        { text: "NIVEL", value: "level", align: "start" },
        {
          text: "CERVEZAS TOMADAS",
          value: "beersDrinked",
          align: "start"
        },
        { text: "OPCIONES", value: "actions", align: "end", sortable: false }
      ]
    };
  },
  computed: { ...mapState("Stock", ["stock"]) },
  methods: {
    addExtractQty(extract) {
      this.isExtracting = extract;
      this.subtract = true;
    },
    closeModal() {
      this.dialog = false;
    },
    getLevel(level) {
      return config.cardLevels[level - 1];
    },
    getColor(level) {
      return config.getColorLevel(level);
    },
    closeSubtract() {
      this.subtract = false;
    },
    closeDetails() {
      this.detailsModal = false;
    },
    parseHalfDate(date) {
      return config.parseHalfDate(date);
    },
    openDetails(item) {
      this.itemToModify = item;
      this.detailsModal = true;
    },
    confirmDelet(item) {
      this.itemToDelete = item._id;
      console.log(this.itemToDelete);
      this.confirm = true;
    },
    async deleteItem() {
      this.loader = true;
      let response = await Api().post("/deletStock", {
        id: this.itemToDelete
      });
      this.loader = false;
      if (response.data.confirmation) {
        this.$store.dispatch("Stock/removeStock", this.itemToDelete);
        this.confirm = false;
        this.closeModal();
      } else {
        console.log(response.data);
        console.log("valiste");
      }
    }
  },
  beforeMount: async function() {
    this.loader = true;
    let response = await Api().get("/getClients");
    if (response.data.confirmation) {
      this.Clients = response.data.data;
      this.loader = false;
    }
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
    position: absolute;
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
