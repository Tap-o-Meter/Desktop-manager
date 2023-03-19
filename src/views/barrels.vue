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
              v-if="tab === 0"
              v-model="orden"
              background-color="white"
              placeholder="# de Linea"
              :items="sortBy"
              prefix="Ordenar: "
              solo
              flat
            />
            <v-select
              dense
              v-else
              v-model="ordenBeer"
              background-color="white"
              placeholder="A-Z"
              :items="sortByBeer"
              prefix="Ordenar: "
              solo
              flat
            />
          </v-col>
          <v-col cols="3">
            <v-select
              dense
              v-if="tab === 0"
              v-model="filtro"
              background-color="white"
              placeholder="Todas"
              :items="filters"
              label="Filtrar"
              prefix="Categoría: "
              solo
              flat
            />
            <v-select
              dense
              v-else
              v-model="filtroBeer"
              background-color="white"
              placeholder="Todas"
              :items="filtersBeer"
              label="Filtrar"
              prefix="Categoría: "
              solo
              flat
            />
          </v-col>
        </v-row>
      </v-container>
    </v-tabs>

    <v-tabs-items
      v-model="tab"
      class="transparent"
      style="overflow:visible !important; "
    >
      <v-tab-item
        background-color="white"
        style=" overflow-x: hidden; overflow-y: hidden;"
      >
        <v-container fluid style="height:100%;">
          <v-layout row wrap style="height:auto">
            <v-flex
              xs12
              sm12
              md6
              lg4
              xl3
              class="align-center justify-center d-flex"
              v-for="(line, index) in onChange(search, orden, filtro)"
              :key="index"
            >
              <BarrelCell :line="line" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-tab-item>
      <v-tab-item
        background-color="white"
        style=" overflow-x: hidden; overflow-y: hidden;"
      >
        <v-container fluid style="height:100%;">
          <v-layout row wrap style="height:auto">
            <v-flex
              xs12
              sm12
              md6
              lg4
              xl3
              class="align-center justify-center d-flex"
              v-for="(beer, index) in onChangeBeer(
                searchBeer,
                ordenBeer,
                filtroBeer
              )"
              :key="index"
            >
              <KegCell :keg="beer" />
            </v-flex>
          </v-layout>
        </v-container>
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
    <AddKeg :open="kegDialog" :handleClose="showAddKeg" :preBeer="preBeer" />
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
      preBeer: null,
      kegDialog: false,
      beerDialog: false,
      lineDialog: false,
      multiple: false,
      filtro: "",
      orden: "",
      filters: [
        "Todos",
        "Críticos",
        "Conectados",
        "Desconectados",
        "De la casa",
        "Invitadas"
      ],
      sortBy: [
        "# de línea",
        "A-Z",
        "Por Estilo",
        "+ ABV",
        "- ABV",
        "Color",
        "Menor Cant.",
        "Mayor Cant."
      ],
      filtroBeer: "",
      ordenBeer: "",
      filtersBeer: [
        "Todos",
        "No Disponibles",
        "Disponibles",
        "Con Etiqueta",
        "De la casa",
        "Invitadas"
      ],
      sortByBeer: ["A-Z", "Por Estilo", "+ ABV", "Color", "Mayor Inventario"],
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
    ...mapGetters("Lines", ["getKeg", "getBeer", "getStatus", "getKegCount"])
  },
  methods: {
    showModal(value, beer) {
      this.beerDialog = value;
      if (beer) this.showAddKeg(true, beer);
    },
    showAddKeg(value, beer) {
      if (beer) this.preBeer = beer;
      else this.preBeer = null;
      this.kegDialog = value;
    },
    showConnectLine(value) {
      this.lineDialog = value;
    },
    showOptions(value) {
      this.multiple = value;
    },
    onChange(search, orden, filtro) {
      const { getBeer, getKeg, getStatus } = this;
      if (this.tab === 0) {
        const filteredByName = this.lines.filter(line => {
          if (line.idKeg.length > 1) {
            return this.getBeer(this.getKeg(line.idKeg).beerId)
              .name.toUpperCase()
              .includes(search.toUpperCase());
          }
        });
        const sortBy = filteredByName.sort(function(a, b) {
          switch (orden) {
            case "# de Línea":
              return a.noLinea - b.noLinea;
              break;
            case "A-Z":
              if (a.idKeg.length > 1 && b.idKeg.length > 1) {
                const Abeer = getBeer(getKeg(a.idKeg).beerId);
                const Bbeer = getBeer(getKeg(b.idKeg).beerId);
                let x = Abeer.name.toUpperCase(),
                  y = Bbeer.name.toUpperCase();
                return x == y ? 0 : x > y ? 1 : -1;
              }
              break;
            case "Por Estilo":
              if (a.idKeg.length > 1 && b.idKeg.length > 1) {
                const Abeer = getBeer(getKeg(a.idKeg).beerId);
                const Bbeer = getBeer(getKeg(b.idKeg).beerId);
                let x = Abeer.style.toUpperCase(),
                  y = Bbeer.style.toUpperCase();
                return x == y ? 0 : x > y ? 1 : -1;
              }
              break;
            case "+ ABV":
              if (a.idKeg.length > 1 && b.idKeg.length > 1) {
                const Abeer = getBeer(getKeg(a.idKeg).beerId);
                const Bbeer = getBeer(getKeg(b.idKeg).beerId);
                let x = Abeer.abv,
                  y = Bbeer.abv;
                return y - x;
              }
              break;
            case "- ABV":
              if (a.idKeg.length > 1 && b.idKeg.length > 1) {
                const Abeer = getBeer(getKeg(a.idKeg).beerId);
                const Bbeer = getBeer(getKeg(b.idKeg).beerId);
                let x = Abeer.abv,
                  y = Bbeer.abv;
                return x - y;
              }
              break;
            case "Color":
              if (a.idKeg.length > 1 && b.idKeg.length > 1) {
                const Abeer = getBeer(getKeg(a.idKeg).beerId);
                const Bbeer = getBeer(getKeg(b.idKeg).beerId);
                let x = Abeer.srm,
                  y = Bbeer.srm;
                return x - y;
              }
              break;
            case "Menor Cant.":
              if (a.idKeg.length > 1 && b.idKeg.length > 1) {
                const Abeer = getKeg(a.idKeg).available;
                const Bbeer = getKeg(b.idKeg).available;
                return Abeer - Bbeer;
              }
              break;
            case "Mayor Cant.":
              if (a.idKeg.length > 1 && b.idKeg.length > 1) {
                const Abeer = getKeg(a.idKeg).available;
                const Bbeer = getKeg(b.idKeg).available;
                return Bbeer - Abeer;
              }
              break;
            default:
              return a.noLinea - b.noLinea;
          }
        });
        const applyedFilter = sortBy.filter(line => {
          switch (filtro) {
            case "Criticos":
              if (line.idKeg.length) {
                const keg = getKeg(line.idKeg);
                return keg.available <= 4;
              }
              break;
            case "Conectados":
              return getStatus(line);
              break;
            case "Desconectados":
              return !getStatus(line);
              break;
            case "De la casa":
              if (line.idKeg.length) {
                const beer = getBeer(getKeg(line.idKeg).beerId);
                return beer.brand === "Local";
              }
              break;
            case "Invitadas":
              if (line.idKeg.length) {
                const beer = getBeer(getKeg(line.idKeg).beerId);
                return beer.brand !== "Local";
              }
              break;
            default:
              return true;
          }
        });
        return applyedFilter;
      }
    },
    onChangeBeer(search, orden, filtro) {
      if (this.tab === 1) {
        const { getKegCount } = this;
        const filteredByName = this.beers.filter(beer =>
          beer.name.toUpperCase().includes(search.toUpperCase())
        );
        const sortBy = filteredByName.sort((a, b) => {
          switch (orden) {
            case "A-Z":
              let aName = a.name.toUpperCase(),
                bName = b.name.toUpperCase();
              return aName == bName ? 0 : aName > bName ? 1 : -1;
              break;
            case "Por Estilo":
              let aStyle = a.style.toUpperCase(),
                bStyle = b.style.toUpperCase();
              return aStyle == bStyle ? 0 : aStyle > bStyle ? 1 : -1;
              break;
            case "+ ABV":
              return b.abv - a.abv;
              break;
            case "Color":
              return a.srm - b.srm;
              break;
            case "Mayor Inventario":
              const Abeer = getKegCount(a._id);
              const Bbeer = getKegCount(b._id);
              return Bbeer - Abeer;
              break;
            default:
              let x = a.name.toUpperCase(),
                y = b.name.toUpperCase();
              return x == y ? 0 : x > y ? 1 : -1;
          }
        });
        const applyedFilter = sortBy.filter(beer => {
          switch (filtro) {
            case "No Disponibles":
              return getKegCount(beer._id) == 0;
              break;
            case "Disponibles":
              return getKegCount(beer._id) > 0;
              break;
            case "Con Etiqueta":
              return beer.image;
              break;
            case "De la casa":
              return beer.brand === "Local";
              break;
            case "Invitadas":
              return beer.brand !== "Local";
              break;
            default:
              return true;
          }
        });
        return applyedFilter;
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";
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
    padding: 0;
    .row{
      margin: 0 !important;
      .col{
        display: flex;
        align-items: flex-end;
        padding-top: 2px;
        padding-bottom: 12px;
      }
    }
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