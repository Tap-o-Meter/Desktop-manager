<template>
  <div class="kegDetails no-scroll">
    <v-container fluid class="pa-0 ">
      <v-col
        class="black-gradient bottom-round elevation-5 pa-0"
        style="min-height:468px"
      >
        <v-row class="pa-0 mx-0" style="max-height:90px">
          <v-col cols="12" class="pb-0">
            <div
              class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
            >
              <span class="header-1-alt ultra-thin">Detalles</span>
              <v-btn class="ma-2" text color="white" :to="{ name: 'barrels' }">
                <v-icon left>mdi-chevron-left</v-icon> back
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row class="pa-0 mx-0" style="flex-wrap:nowrap">
          <v-img
            class="mt-3 ml-10"
            min-width="200"
            max-width="200"
            height="300"
            :src="
              keg.image !== null
                ? BASE_URL + '/getImage/' + keg.image
                : require('@/assets/no-beer.svg')
            "
          />
          <v-row class="pa-0 mx-0">
            <v-col cols="12" class="pl-4 relative mb-0">
              <v-row class="pb-0">
                <v-col cols="4" class="d-flex flex-column align-start  pb-0">
                  <span class="header-1-alt thin white--text pb-0">
                    {{ keg.name }}
                  </span>
                  <p class="header-5-alt thin white--text mb-0">
                    {{ "-" + keg.style }}
                  </p>
                </v-col>
                <v-col cols="8" class="pb-0">
                  <v-row class="pa-0">
                    <v-col class="d-flex flex-column align-start ">
                      <span class="header-5-alt bold white--text">Marca</span>
                      <span class="header-4-alt thin white--text">
                        {{ keg.brand }}
                      </span>
                    </v-col>
                    <v-col class="d-flex flex-column align-start ">
                      <span class="header-5-alt  bold white--text">ABV</span>
                      <span class="header-4-alt thin white--text">
                        {{ keg.abv + "%" }}
                      </span>
                    </v-col>
                    <v-col class="d-flex flex-column align-start ">
                      <span class="header-5-alt bold white--text">IBU</span>
                      <span class="header-4-alt thin white--text">
                        {{ keg.ibu }}
                      </span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row cols="12" class="pb-0">
                <v-col cols="4" class="d-flex flex-column align-start ">
                  <span class="header-5-alt bold white--text">SRM</span>
                  <span class="header-4-alt thin white--text ml-1">
                    {{ keg.srm > 100 ? "NA" : keg.srm }}
                    <v-avatar
                      class="ml-1"
                      size="22"
                      :color="srmList(keg.srm).color"
                    />
                  </span>
                </v-col>
                <v-col cols="8">
                  <v-row>
                    <v-col class="d-flex flex-column align-start ">
                      <span class="bold-names white--text">DISPONIBLES</span>
                      <span class="header-4-alt white--text">
                        {{ kegsCount }}
                        <v-icon class="mb-1" color="white"> mdi-keg </v-icon>
                      </span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-col class="d-flex flex-column pa-0" cols="10">
                <span class="bold-names white--text">DESCRIPCIÓN</span>
                <span class="header-4-alt white--text">
                  {{ keg.description }}
                </span>
              </v-col>
            </v-col>
          </v-row>
        </v-row>
        <v-row class="py-0 mx-0 mr-5" justify="end">
          <v-btn
            outlined
            depressed
            style="width: 200px"
            color="white"
            class="mt-3"
            @click.stop="showBeerModal(true)"
          >
            Editar
          </v-btn>
        </v-row>
      </v-col>
      <v-row class="mt-10 mx-0">
        <v-col cols="6">
          <v-card elevation="0">
            <v-card-title class="d-flex justify-center">
              <v-icon color="#43a047" size="27">$keg</v-icon>
              <span class="header-3-alt thin ml-1"> Stock de Barriles</span>
              <v-spacer />
            </v-card-title>
            <v-data-table
              :headers="kegsHeaders"
              :items="kegs"
              class="elevation-0 pa-3"
              style="height:347px;"
              :items-per-page="5"
            >
              <template v-slot:item.prepared="{ item }">
                <span v-html="formatDate(item.prepared.substr(0, 10))" />
              </template>
              <template v-slot:item.available="{ item }">
                <span v-html="item.available.toFixed(1) + 'L'" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon medium class="mr-2" @click.stop="openDetails(item)">
                  mdi-magnify
                </v-icon>
              </template>
              <template v-slot:no-data>
                <p class="header-3-alt thin black--text mt-10 secundary">
                  <v-icon size="35" class="pb-1">
                    mdi-calendar-remove-outline
                  </v-icon>
                  No hay barriles en inventario
                </p>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card elevation="0">
            <v-card-title class="d-flex justify-center">
              <v-icon color="#43a047" class="mr-1" size="33">$fermenter</v-icon>
              <span class="header-3-alt thin ml-1"> En preparación</span>
              <v-spacer />
            </v-card-title>
            <v-data-table
              :headers="onProcessHeaders"
              :items="dessertss"
              :items-per-page="5"
              class="elevation-0 pa-3"
              style="height:347px;"
            >
              <template v-slot:no-data>
                <p class="header-3-alt thin mt-10 secundary">
                  <v-icon size="35" class="pb-1">
                    mdi-calendar-remove-outline
                  </v-icon>
                  No hay fechas programadas
                </p>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <KegDetails
      :open="detailsModal"
      :handleClose="closeDetails"
      :item="itemToModify"
      :beer="keg"
    />
    <AddBeer
      :open="beerDialog"
      :handleClose="showBeerModal"
      :isEditing="true"
      :beer="keg"
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import config from "../config";
import { KegDetails, AddBeer } from "../components/modals";
export default {
  name: "kegDetails",
  components: { KegDetails, AddBeer },
  data() {
    return {
      detailsModal: false,
      itemToModify: null,
      beerDialog: false,
      onProcessHeaders: [
        { text: "NOMBRE", sortable: false, value: "name" },
        { text: "ELABORADA", value: "protein", align: "end", sortable: false },
        { text: "DISPONIBLE", value: "iron", align: "end", sortable: false }
      ],
      kegsHeaders: [
        //{ text: "#", sortable: false, value: "_id" },
        { text: "ABV", value: "abv", align: "start" },
        { text: "IBU", value: "ibu", align: "start" },
        { text: "CANTIDAD", value: "available", align: "end" },
        { text: "ELABORADA", value: "prepared", align: "end" },
        { text: "DETALLES", value: "actions", align: "end" }
      ]
    };
  },
  computed: {
    ...mapState("Session", ["BASE_URL"]),
    ...mapGetters("Lines", [
      "getBeer",
      "getStatus",
      "getBeerKegs",
      "getKegCount"
    ]),
    kegs() {
      return this.getBeerKegs(this.keg._id);
    },
    keg() {
      return this.getBeer(this.$route.params.id);
    },
    kegsCount() {
      return this.getKegCount(this.$route.params.id);
    }
  },
  methods: {
    srmList(srmIndex) {
      return config.getSrm(srmIndex);
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    showBeerModal(value) {
      this.beerDialog = value;
    },
    closeDetails() {
      this.detailsModal = false;
    },
    openDetails(item) {
      this.itemToModify = item;
      this.detailsModal = true;
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
    @import "@/assets/styles/components";
.kegDetails {
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  .bottom-round {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  .titleWrapper {
    z-index: 1;
    position: sticky;
    width: 100%;
    top: 0;
    background-color: transparent;
    min-height: 60px;
    max-height: 60px;
    * {
      color: white;
    }
  }
  .v-image {
    background-color: lightgray;
    border-radius: 8px;
    border: 0.5px solid gray;
  }
  .available {
    position: absolute;
    bottom: 70px;
    right: 20px;
  }
  .relative {
    position: relative;
  }
}
</style>
<style lang="scss">
.kegDetails {
  .v-data-footer {
    display: none;
  }
  .v-data-table {
    background-color: transparent !important;
    * {
      background-color: transparent !important;
    }
  }
}
</style>
