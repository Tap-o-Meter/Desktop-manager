<template>
  <div class="stockWrapper d-flex flex-column no-scroll">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Inventario</span>
    </div>
    <div class="barrelsList d-flex flex-wrap justify-center"></div>

    <v-card class="ma-10 elevation-0" style="min-height:80%">
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
        </v-row>
      </v-container>
      <v-data-table
        :headers="headers"
        :items="stock"
        class="elevation-0 d-flex flex-column pt-2"
        style="min-height:80vh;"
        :items-per-page="15"
        :search="search"
        show-select
        item-key="_id"
        v-model="selected"
      >
        <template v-slot:item.image="{ item }">
          <v-avatar tile size="100">
            <v-img
              style="object-fit: contain;"
              :src="
                item.image !== null
                  ? BASE_URL + '/getImage/' + item.image
                  : require('@/assets/no-image.svg')
              "
              contain
            />
          </v-avatar>
        </template>
        <template v-slot:item.volume="{ item }">
          <v-chip :color="getColor(item)" dark>
            {{ item.volume + " " + item.unity }}
          </v-chip>
        </template>
        <template v-slot:item.name="{ item }">
          <span>{{ item.name }}</span>
          <p>{{ item.brand }}</p>
        </template>
        <template v-slot:item.lead_time="{ item }">
          {{ item.lead_time + " Días" }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                size="20"
                class="mr-2"
                @click.stop="openDetails(item)"
                v-on="on"
                color="#00acc1"
              >
                mdi-magnify
              </v-icon>
            </template>
            <span>Ver más</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                size="20"
                class="mr-2"
                color="red darken-3"
                @click="confirmDelete(item)"
                v-on="on"
              >
                mdi-trash-can-outline
              </v-icon>
            </template>
            <span>Eliminar</span>
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
      <span>Nuevo articulo</span>
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

    <AddStock :open="dialog" :handleClose="closeModal" />
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
    <v-dialog v-model="confirm" max-width="390">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>Eliminar Articulos</v-card-title>
        <v-card-text class="d-flex flex-row align-center">
          ¿Estás seguro que deseas borrar éste articulo?, al aconfirmar se
          borrará el articulo y la cantidad actual de cada uno.
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
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { BarrelCell } from "../components/cells";
import Api from "../service/api";
import {
  AddStock,
  SubtractInventory,
  StockDetails
} from "../components/modals";
export default {
  name: "Barrels",
  components: { BarrelCell, AddStock, SubtractInventory, StockDetails },
  data() {
    return {
      loader: false,
      dialog: false,
      subtract: false,
      detailsModal: false,
      confirm: false,
      search: "",
      isExtracting: false,
      itemToDelete: -1,
      itemToModify: null,
      selected: [],
      stock: [],
      headers: [
        { text: "", value: "image", align: "start", width: 100 },
        { text: "NOMBRE", align: "start", sortable: false, value: "name" },
        { text: "CANTIDAD", value: "volume", align: "end" },
        { text: "TIEMPO DE ESPERA", value: "lead_time", align: "end" },
        { text: "OPCIONES", value: "actions", align: "end", sortable: false }
      ]
    };
  },
  computed: {
    // ...mapState("Stock", ["stock"]),
    ...mapState("Session", ["BASE_URL"])
  },
  methods: {
    addExtractQty(extract) {
      this.isExtracting = extract;
      this.subtract = true;
    },
    closeModal(should_update) {
      if (should_update) this.getStock();
      this.dialog = false;
    },
    getColor(item) {
      if (item.volume <= item.min_product) return "red";
      else return "green";
    },
    closeSubtract(should_update) {
      if (should_update) this.getStock();
      this.subtract = false;
    },
    closeDetails() {
      this.detailsModal = false;
    },
    openDetails(item) {
      this.itemToModify = item;
      this.detailsModal = true;
    },
    confirmDelete(item) {
      this.itemToDelete = item._id;
      console.log(this.itemToDelete);
      this.confirm = true;
    },
    async deleteItem() {
      this.loader = true;
      try {
        let response = await Api().post("/deletStock", {
          id: this.itemToDelete
        });
        this.loader = false;
        if (response.data.confirmation) {
          this.$store.dispatch("Stock/removeStock", this.itemToDelete);
          this.confirm = false;
          this.getStock();
        } else {
          console.log(response.data);
          console.log("valiste");
        }
      } catch (e) {
        this.confirm = false;
      }
    },

    async getStock() {
      this.loader = true;
      try {
        let response = await Api().get("/getStock");
        if (response.data.confirmation) {
          this.stock = response.data.data;
          this.loader = false;
        }
      } catch (e) {
        this.loader = false;
      }
    }
  },
  beforeMount: function() {
    this.getStock();
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";
.stockWrapper {
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
.stockWrapper {
  .v-data-table td {
    height: 120px !important;
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
