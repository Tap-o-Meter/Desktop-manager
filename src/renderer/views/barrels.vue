<template>
  <div class="barrelsWrapper d-flex flex-column">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Barriles</span>
    </div>

    <v-tabs v-model="tab" class="mt-2 px-8" background-color="transparent">
      <v-tab class="header-4-alt thin ">
        Lineas
      </v-tab>
      <v-tab class="header-4-alt thin ">
        Cervezas
      </v-tab>
      <v-container class="px-10" fluid>
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-if="tab === 0"
              dense
              solo
              flat
              v-model="search"
              placeholder="Buscar"
              background-color="white"
              prepend-inner-icon="mdi-magnify"
            />
            <v-text-field
              v-else
              dense
              solo
              flat
              v-model="searchBeer"
              placeholder="Buscar"
              background-color="white"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>
          <v-col cols="3" class="ml-auto">
            <v-select
              dense
              background-color="white"
              placeholder="Ordenar: # de Linea"
              :items="sortBy"
              item-text="noLinea"
              item-value="_id"
              solo
              flat
            />
          </v-col>
          <v-col cols="3">
            <v-select
              dense
              background-color="white"
              placeholder="Categoría: Todas"
              :items="categorias"
              item-text="noLinea"
              item-value="_id"
              label="Filtrar"
              solo
              flat
            />
          </v-col>
        </v-row>
      </v-container>
    </v-tabs>

    <v-tabs-items v-model="tab" class="transparent">
      <v-tab-item background-color="white">
        <div class="d-flex flex-wrap justify-center">
          <BarrelCell
            v-for="(line, index) in onChange(search)"
            :key="index"
            :line="line"
          />
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="d-flex flex-wrap justify-center">
          <KegCell
            v-for="(beer, index) in onChangeBeer(searchBeer)"
            :keg="beer"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>

    <v-btn
      dark
      class="mx-2"
      fab
      medium
      @click.stop="multiple = true"
      color="#00acc1"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
    <AddBeer :open="beerDialog" :handleClose="showModal" />
    <AddKeg :open="kegDialog" :handleClose="showAddKeg" />
    <ConnectLine :open="lineDialog" :handleClose="showConnectLine" />
    <MultipleOptions
      :open="multiple"
      :handleClose="showOptions"
      :options="options"
    />
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { BarrelCell, KegCell } from "../components/cells";
import {
  AddBarrel,
  MultipleOptions,
  AddBeer,
  AddKeg,
  ConnectLine
} from "../components/modals";
export default {
  name: "Barrels",
  components: {
    BarrelCell,
    AddBarrel,
    MultipleOptions,
    KegCell,
    AddBeer,
    AddKeg,
    ConnectLine
  },
  data() {
    return {
      search: "",
      searchBeer: "",
      tab: null,
      categorias: ["Todas", "Conectados", "Desconectados", "Críticos"],
      sortBy: ["# de Línea", "Menor cantidad", "Mayor cantidad", "Estilos"],
      kegDialog: false,
      beerDialog: false,
      lineDialog: false,
      multiple: false,
      options: [
        {
          icon: "$addBarrel",
          name: "Agregar Barril",
          action: this.showAddKeg,
          color: "cyanGradient"
        },
        {
          icon: "$connectBeer",
          name: "Conectar Linea",
          action: this.showConnectLine,
          color: "yellowgradient"
        },
        {
          icon: "$addBeer",
          name: "Agregar Cerveza",
          action: this.showModal,
          color: "greenGradient"
        }
      ]
    };
  },
  computed: {
    ...mapState("Lines", ["kegs", "connectedLines", "lines", "beers"]),
    ...mapGetters("Lines", ["getKeg", "getBeer"])
  },
  methods: {
    showModal(value) {
      this.beerDialog = value;
    },
    showAddKeg(value) {
      this.kegDialog = value;
    },
    showConnectLine(value) {
      this.lineDialog = value;
    },
    showOptions(value) {
      this.multiple = value;
    },
    onChange(search) {
      if (this.tab === 0) {
        return this.lines.filter(line => {
          if (line.idKeg.length > 1) {
            return this.getBeer(this.getKeg(line.idKeg).beerId)
              .name.toUpperCase()
              .includes(search.toUpperCase());
          }
        });
      }
    },
    onChangeBeer(search) {
      if (this.tab === 1) {
        return this.beers.filter(beer =>
          beer.name.toUpperCase().includes(search.toUpperCase())
        );
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.barrelsWrapper {
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  padding-bottom: 30px;
  .container {
    height: 60px;
    margin-top: -5px;
    padding: 0;
  }
  .v-text-field {
    border-radius: 9px;
    font-size: 14px;
  }
  .row {
    height: 60px;
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
.v-tabs-slider-wrapper {
  padding-left: 12px !important;
  padding-right: 12px !important;
}
</style>
