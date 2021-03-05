<template>
  <div class="config d-flex flex-column">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Configuración</span>
    </div>
    <div class="config-wrapper d-flex flex-column align-center">
      <v-tabs v-model="tab" class="mt-2 px-8" background-color="transparent">
        <v-tab class="header-4-alt thin ">
          <v-icon class="mr-2">mdi-cog</v-icon> General
        </v-tab>
        <v-tab class="header-4-alt thin ">
          <v-icon class="mr-2">mdi-cast</v-icon> Menú de Taps
        </v-tab>
        <v-tab class="header-4-alt thin ">
          <v-icon class="mr-2">mdi-harddisk</v-icon> Almacenamiento
        </v-tab>
      </v-tabs>

      <v-tabs-items
        v-model="tab"
        class="transparent d-flex"
        style="width:95%; flex:1"
      >
        <v-tab-item background-color="white">
          <v-card class="mt-1 pr-5 pl-5 mt-5" elevation="0">
            <v-container fluid>
              <span class="header-2-alt thin">Información</span>
              <v-row>
                <v-avatar tile size="160">
                  <v-img
                    contain
                    src="http://beer-control.local:3000/placeLogo"
                  />
                </v-avatar>
                <v-scroll-y-transition :hide-on-leave="true">
                  <v-row v-show="!editInfo">
                    <v-col v-if="!editInfo" class="d-flex flex-column" cols="2">
                      <span class="bold-names light ">Cervecería</span>
                      <span class="header-4-alt mate">{{
                        placeInfo.name
                      }}</span>
                    </v-col>

                    <v-col v-if="!editInfo" class="d-flex flex-column" cols="2">
                      <span class="bold-names light ">Sucursal</span>
                      <span
                        class="header-4-alt mate"
                        v-text="placeInfo.branch"
                      />
                    </v-col>

                    <v-col v-if="!editInfo" cols="4" class="d-flex flex-column">
                      <span class="bold-names light">Redes Sociales</span>
                      <span>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon size="35" v-bind="attrs" v-on="on">
                              mdi-facebook
                            </v-icon>
                          </template>
                          <span>{{ placeInfo.facebook }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon size="35" v-bind="attrs" v-on="on">
                              mdi-instagram
                            </v-icon>
                          </template>
                          <span>{{ placeInfo.instagram }}</span>
                        </v-tooltip>
                      </span>
                    </v-col>
                  </v-row>
                </v-scroll-y-transition>
                <v-scroll-y-transition :hide-on-leave="true">
                  <v-row v-show="editInfo">
                    <v-col class="d-flex flex-column" cols="2">
                      <v-text-field
                        outlined
                        label="Nombre*"
                        required
                        placeholder="Nombre"
                        v-model="name"
                      />
                    </v-col>
                    <v-col class="d-flex flex-column" cols="2">
                      <v-text-field
                        outlined
                        label="Sucursal"
                        placeholder="Sucursal"
                        v-model="branch"
                      />
                    </v-col>
                    <v-col class="d-flex flex-column" cols="2">
                      <v-text-field
                        outlined
                        label="Facebook"
                        placeholder="/your_url"
                        v-model="facebook"
                      />
                    </v-col>
                    <v-col class="d-flex flex-column" cols="2">
                      <v-text-field
                        outlined
                        label="Instagram"
                        placeholder="@your_profile"
                        v-model="instagram"
                      />
                    </v-col>
                    <v-col class="d-flex flex-column" cols="2">
                      <v-text-field
                        outlined
                        label="Twitter"
                        placeholder="@your_profile"
                        v-model="twitter"
                      />
                    </v-col>
                  </v-row>
                </v-scroll-y-transition>
              </v-row>
              <v-row justify="end">
                <v-btn
                  v-if="editInfo"
                  class="ma-2"
                  width="130px"
                  outlined
                  color="error"
                  @click="editInfo = false"
                >
                  <v-icon left v-html="'mdi-close'" />
                  cancelar
                </v-btn>
                <v-btn
                  v-if="!editInfo"
                  class="ma-2"
                  width="130px"
                  outlined
                  @click="editInfo = true"
                >
                  <v-icon left v-html="'mdi-pencil'" />
                  editar
                </v-btn>
                <v-btn
                  v-if="editInfo"
                  class="ma-2"
                  width="130px"
                  outlined
                  @click="editPlaceInfo()"
                >
                  <v-icon left v-html="'mdi-check'" />
                  guardar
                </v-btn>
              </v-row>
            </v-container>
          </v-card>

          <v-card class="mt-1 pr-5 pl-5 mt-5" elevation="0">
            <v-container fluid>
              <span class="header-2-alt thin">Tarjeta de Emergecia</span>
              <v-row>
                <v-col>
                  <img src="../assets/redCard.svg" class="card ml-5" />
                </v-col>
              </v-row>
              <v-row justify="end">
                <v-btn
                  v-if="true"
                  class="ma-2"
                  width="130px"
                  outlined
                  @click.stop="emergencyCardModal = true"
                >
                  <v-icon left v-html="'mdi-pencil'" />
                  editar
                </v-btn>
                <v-btn
                  v-if="false"
                  class="ma-2"
                  width="130px"
                  outlined
                  @click=""
                >
                  <v-icon left v-html="'mdi-check'" />
                  guardar
                </v-btn>
              </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- /////////////////////////////////////// Tap Menú           /////////////////////////////////////// -->
        <v-tab-item>
          <v-alert type="info" class="mt-4">
            Recuerda que para que funcione correctamente el <b>Menú</b> es
            necesario preeviamente haber conectado y configurado tu
            <b>Fire Stick</b>.
          </v-alert>
          <v-card class="mt-1 pr-5 pl-5" elevation="0">
            <v-container fluid>
              <p class="header-2-alt thin">Información</p>
              <v-row>
                <v-col class="d-flex flex-column" cols="4">
                  <span class="bold-names light ">
                    Tu dirección de enlace:
                    <v-icon size="16" class="pb-1 ml-1"
                      >mdi-alert-circle-outline</v-icon
                    >
                  </span>
                  <span class="header-4-alt ml-3 mate">
                    - <u>{{ ip }}</u>
                  </span>
                </v-col>
                <v-col class="d-flex justify-center align-center" cols="4">
                </v-col>
                <v-col class="d-flex align-end flex-column">
                  <div class="d-flex flex-column align-center">
                    <qrcode-vue
                      id="myCanvas"
                      :value="ip.toLowerCase() + '#/menu'"
                      :size="180"
                      level="H"
                    />
                    <a id="download" download="beer-menu-qr.png">
                      <v-btn class="ma-2" outlined @click="download">
                        Descargar
                      </v-btn>
                    </a>
                  </div>

                  <!-- <v-card
                    class="pa-3"
                    max-width="190px"
                    height="220px"
                    background-color="snow"
                  >
                    <p class="header-5-alt light">

                    </p>
                  </v-card> -->
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- /////////////////////////////////////// Tap Almacenamiento /////////////////////////////////////// -->
        <v-tab-item background-color="white">
          <v-card class="mt-1 pr-5 pl-5 mt-5" elevation="0">
            <v-container fluid>
              <span class="header-2-alt thin">Almacenamiento</span>
              <v-row>
                <v-col class="d-flex flex-column align-start" cols="4">
                  <DoughnutChart
                    ref="skills_chart"
                    :chart-data="chartData"
                    :height="250"
                    :width="250"
                  />
                </v-col>
                <v-col class="d-flex justify-center align-center" cols="4">
                </v-col>
                <v-col class="d-flex align-end flex-column"> </v-col>
              </v-row>
            </v-container>
          </v-card>
          <v-card class="mt-1 pr-5 pl-5 mt-5" elevation="0">
            <v-container fluid>
              <span class="header-2-alt thin">Exportar a Excel</span>
              <v-row>
                <v-col cols="12" sm="4" md="3">
                  <span class="header-4-alt light">Tablas:</span>
                  <v-checkbox
                    v-for="entity in entityList"
                    :key="entity.label"
                    v-model="entity.value"
                    :label="entity.label"
                    color="red"
                    :value="entity.name"
                    hide-details
                    class="mt-0 ml-2"
                  />
                </v-col>
                <v-col cols="2">
                  <v-scroll-x-transition>
                    <div v-show="entityList[3].value">
                      <span class="header-4-alt light ">Periodos:</span>
                      <v-select
                        v-model="from"
                        class="mx-1 mt-5"
                        :items="config.months"
                        item-text="name"
                        item-value="value"
                        label="Desde"
                        placeholder="Enero"
                        required
                        outlined
                        dense
                      />
                      <v-select
                        v-model="to"
                        class="mx-1"
                        :items="calculateMonths"
                        item-text="name"
                        item-value="value"
                        label="Desde"
                        placeholder="Enero"
                        required
                        outlined
                        dense
                      />
                    </div>
                  </v-scroll-x-transition>
                </v-col>
                <v-col class="d-flex align-end flex-column">
                  <v-btn class="ma-2" outlined @click="exportData()">
                    Exportar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <v-fade-transition>
        <v-alert
          v-show="showMessage"
          dismissible
          close-icon="mdi-delete"
          color="cyan"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-twitter"
        >
          <span v-html="message" />
        </v-alert>
      </v-fade-transition>
    </div>
    <AddEmergencyCard
      :open="emergencyCardModal"
      :handleClose="closeAddEmergencyCard"
    />
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { parse } from "json2csv";
import Api from "../service/api";
import fs from "fs";
import path from "path";
import config from "../config";
import QrcodeVue from "qrcode.vue";
import { DoughnutChart } from "../components/charts";
import { AddEmergencyCard } from "../components/modals";

export default {
  name: "Barrels",
  components: { QrcodeVue, DoughnutChart, AddEmergencyCard },
  data() {
    return {
      search: "",
      tab: null,
      loader: false,
      ip: "",
      editInfo: false,
      showMessage: false,
      message: "",
      name: "",
      branch: "",
      facebook: "",
      instagram: "",
      twitter: "",
      from: new Date().getMonth(),
      to: null,
      emergencyCardModal: false,
      entityList: [
        { name: "beers", label: "Cervezas", value: false },
        { name: "kegs", label: "Barriles", value: false },
        { name: "lines", label: "Lineas", value: false },
        { name: "sale", label: "Ventas", value: false },
        { name: "stock", label: "Inventario", value: false },
        { name: "workers", label: "Trabajadores", value: false }
      ],
      chartData: {
        labels: ["Disponible", "Ocupado"],
        datasets: [{ backgroundColor: ["lightgray", "#2ecc71"], data: [] }]
      }
    };
  },
  computed: {
    ...mapState("Session", ["barrels", "workers", "placeInfo"]),
    ...mapState("Lines", ["beers", "kegs", "lines"]),
    ...mapState("Stock", ["stock"]),
    config() {
      return config;
    },
    calculateMonths() {
      this.to = this.from + 1;
      return config.months.slice(this.from, 12);
    }
  },
  methods: {
    closeAddEmergencyCard() {
      this.emergencyCardModal = false;
    },
    download() {
      var download = document.getElementById("download");
      var image = document
        .getElementById("myCanvas")
        .childNodes[0].toDataURL("image/png");
      download.setAttribute("href", image);
      //download.setAttribute("download","archive.png");
    },
    exportData() {
      this.loader = true;
      this.entityList.forEach(async (entity, i) => {
        if (entity.value) {
          if (entity.name !== "kegs" && entity.name !== "sale") {
            const keys = Object.keys(this[entity.name][0]);
            const csv = parse(this[entity.name], { keys });
            this.writeData(csv, entity.name);
          } else if (entity.name === "sale") {
            const date = new Date();
            let response = await Api().get(
              "/sales/" + this.from + "/" + this.to
            );
            const sales = this.fixDate(response.data.data, ["date"]);
            const keys = Object.keys(sales);
            const csv = parse(sales, { keys });
            this.writeData(csv, entity.name);
          } else if ((entity.name = "kegs")) {
            let response = await Api().get("/getKegs/");
            const kegs = this.fixDate(response.data.data, [
              "prepared",
              "released"
            ]);
            const keys = Object.keys(kegs);
            const csv = parse(kegs, { keys });
            this.writeData(csv, entity.name);
          }
        }
      });
      this.loader = false;
      this.message =
        "Información guardada con exito en: <u>" +
        require("os").homedir() +
        "/Documents/Beer-control/</u>";
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 5000);
    },
    fixDate(data, fields) {
      data.forEach((item, i) => {
        fields.forEach((field, i) => {
          item[field] = config.parseDate(item[field]);
        });
      });
      return data;
    },
    writeData(csv, name) {
      const home = require("os").homedir();
      const logpath = home + "/Documents/Beer-control/";
      fs.existsSync(logpath) || fs.mkdirSync(logpath);
      const fileName = name + ".csv";
      fs.writeFile(logpath + fileName, csv, function(err) {
        if (err) console.log(err);
      });
    },
    async editPlaceInfo() {
      const { name, branch, facebook, instagram, twitter } = this;

      this.loader = true;
      var dataToSend = { name, branch, facebook, instagram, twitter };
      let response = await Api().post("/editPlaceInfo", dataToSend);
      this.loader = false;
      if (response.data.confirmation) {
        this.$store.dispatch("Session/setPlaceInfo", dataToSend);
        this.editInfo = false;
      } else {
        console.log(response.data);
        console.log("valiste");
      }
    }
  },
  mounted: async function() {
    this.name = this.placeInfo.name;
    this.branch = this.placeInfo.branch;
    this.facebook = this.placeInfo.facebook;
    this.instagram = this.placeInfo.instagram;
    this.twitter = this.placeInfo.twitter;
    console.log(this.name);
    try {
      const address = await config.BASE_URL();
      this.ip = "HTTP://" + address + ":5000";
    } catch (err) {
      this.ip = "DESCONECTADO";
    }
    let response = await Api().get("/getStorage");
    if (response.data.confirmation) {
      let storageString = response.data.data;
      let storage = storageString
        .substring(
          storageString.lastIndexOf("/dev/root") + 9,
          storageString.lastIndexOf("devtmpfs") - 2
        )
        .replace(/\s+/g, "")
        .split("G");
      this.chartData.datasets[0].data.push(storage[2]);
      this.chartData.datasets[0].data.push(storage[1]);
      // this.$refs.skills_chart.update();
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
.config {
  position: relative;
  flex: 1;
  width: 100%;
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
    background-color: snow;
    min-height: 60px;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.1) !important;
    .search {
      width: 300px;
    }
  }
  .config-wrapper {
    width: 100%;
    height: 100%;
  }
  .card {
    width: 130px;
    margin-top: 20px;
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
  .cards {
    height: calc(100% - 100px);
  }
}
</style>
<style lang="scss">
.config {
  .v-window__container {
    flex: 1;
  }
  .v-window-item--active {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}
</style>
