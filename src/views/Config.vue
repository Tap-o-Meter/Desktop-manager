<template>
  <div class="config d-flex flex-column no-scroll">
    <div
      class="titleWrapper d-flex pl-5 pr-5 align-center justify-space-between"
    >
      <span class="header-1-alt ultra-thin">Configuración</span>
    </div>
    <div class="config-wrapper d-flex flex-column align-center">
      <v-tabs v-model="tab" class="mt-2 px-8" background-color="transparent">
        <v-tab class="header-4-alt thin">
          <v-icon class="mr-2">mdi-cog</v-icon> General
        </v-tab>
        <v-tab class="header-4-alt thin">
          <v-icon class="mr-2">mdi-cast</v-icon> Menú de Taps
        </v-tab>
        <v-tab class="header-4-alt thin">
          <v-icon class="mr-2">mdi-harddisk</v-icon> Almacenamiento
        </v-tab>
      </v-tabs>

      <v-tabs-items
        v-model="tab"
        class="transparent d-flex"
        style="width: 95%; flex: 1"
      >
        <v-tab-item background-color="white">
          <v-card class="mt-1 pr-5 pt-3 pl-5 mt-5" elevation="0">
            <span class="header-2-alt thin pl-3">Información</span>
            <v-container fluid>
              <v-row style="overflow: visible; flex-wrap: nowrap">
                <v-avatar
                  tile
                  size="160"
                  style="overflow: visible"
                  class="mr-5"
                >
                  <v-img v-if="!editInfo" contain :src="image.imageURL" />

                  <image-input v-else v-model="image" class="image-picker">
                    <div slot="activator" class="image-wrapper">
                      <div
                        class="d-flex flex-column"
                        v-if="!image"
                        style="text-align: center"
                      >
                        <v-icon :size="90" color="grey">
                          mdi-image-filter-hdr
                        </v-icon>
                        <span class="pb-2">NO IMAGE</span>
                      </div>
                      <v-avatar size="100%" v-ripple v-else class="mb-0" tile>
                        <v-img :src="image.imageURL" contain alt="image" />
                      </v-avatar>
                      <div
                        class="d-flex justify-center align-center"
                        style="
                          left: 0;
                          right: 0;
                          margin-left: auto;
                          margin-right: auto;
                          position: absolute;
                          bottom: -20px;
                          width: 40px;
                          height: 40px;
                          border-radius: 9px;
                          box-shadow: 0 10px 20px -5px #9794f2;
                          border: solid 1px #9794f2;
                          background-color: #9794f2;
                        "
                      >
                        <v-icon color="white">mdi-camera</v-icon>
                      </div>
                    </div>
                  </image-input>
                </v-avatar>
                <v-scroll-y-transition :hide-on-leave="true">
                  <v-row v-show="!editInfo">
                    <v-col v-if="!editInfo" class="d-flex flex-column" cols="2">
                      <span class="bold-names light">Cervecería</span>
                      <span class="header-4-alt mate">
                        {{ placeInfo.name }}
                      </span>
                    </v-col>

                    <v-col v-if="!editInfo" class="d-flex flex-column" cols="2">
                      <span class="bold-names light">Sucursal</span>
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
                  @click="closeEditInfo()"
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

          <v-container fluid class="pa-0">
            <v-row>
              <v-col md="12" lg="6" xl="6">
                <v-card class="mt-1 pr-5 pl-5 mt-5" elevation="0">
                  <v-container fluid>
                    <span class="header-2-alt thin">Tarjeta de Emergecia</span>
                    <v-row>
                      <!-- <v-img contain :src="BASE_URL + '/placeLogo'" /> -->
                      <img src="../assets/redCard.svg" class="card ml-5" />

                      <v-col class="d-flex flex-column">
                        <span class="bold-names light mt-5">
                          # de Tarjeta de Emergencia
                        </span>
                        <span class="header-4-alt mate ml-3">
                          -{{
                            this.emergencyCard.length > 0
                              ? this.emergencyCard
                              : "No hay Tarjeta de emergencia asignada"
                          }}
                        </span>
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
              </v-col>
              <v-col md="12" lg="6" xl="6">
                <v-card class="mt-1 pr-5 pl-5 mt-5" elevation="0">
                  <v-container fluid style="height: 328px">
                    <span class="header-2-alt thin">Servidor Externo</span>
                    <v-row style="height: 220px">
                      <!-- <v-img contain :src="BASE_URL + '/placeLogo'" /> -->
                      <img src="../assets/servers.svg" class="server ml-5" />
                      <v-col class="d-flex flex-column">
                        <span class="bold-names light mt-5">
                          <v-icon size="18" v-text="'mdi-link-variant'" /> URL
                          del serveidor
                        </span>
                        <span class="header-4-alt mate ml-3">
                          -{{
                            this.emergencyCard.length > 0
                              ? this.emergencyCard
                              : "No hay Tarjeta de emergencia asignada"
                          }}
                        </span>
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
              </v-col>
            </v-row>
          </v-container>
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
                  <span class="bold-names light">
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
                      :value="ip.toLowerCase() + '/#/menu'"
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

          <v-card class="mt-5 pr-5 pl-5" elevation="0">
            <v-container fluid>
              <p class="header-2-alt thin">Opciones</p>
              <v-row>
                <v-col class="d-flex flex-column ml-2" cols="2">
                  <v-btn class="ma-1 opciones" color="grey" outlined small>
                    Agregar Linea virtual
                  </v-btn>
                  <v-btn class="ma-1 opciones" color="grey" outlined small>
                    Eliminar linea virtual
                  </v-btn>
                </v-col>
                <v-col
                  class="d-flex justify-center align-center"
                  cols="4"
                ></v-col>
                <v-col class="d-flex align-end flex-column"></v-col>
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
                      <span class="header-4-alt light">Periodos:</span>
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
import { mapState, mapGetters } from "vuex";
import { parse } from "json2csv";
import Api from "../service/api";
import fs from "fs";
import path from "path";
import config from "../config";
import QrcodeVue from "qrcode.vue";
import ImageInput from "../components/form/ImageInput.vue";
import { DoughnutChart } from "../components/charts";
import { AddEmergencyCard } from "../components/modals";

export default {
  name: "Barrels",
  components: { QrcodeVue, DoughnutChart, AddEmergencyCard, ImageInput },
  data() {
    return {
      search: "",
      tab: null,
      loader: false,
      image: null,
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
        { name: "workers", label: "Trabajadores", value: false },
      ],
      chartData: {
        labels: ["Disponible", "Ocupado"],
        datasets: [{ backgroundColor: ["lightgray", "#2ecc71"], data: [] }],
      },
    };
  },
  computed: {
    ...mapState("Session", ["barrels", "workers", "placeInfo", "BASE_URL"]),
    ...mapState("Lines", ["beers", "kegs", "lines", "emergencyCard"]),
    ...mapState("Stock", ["stock"]),
    ...mapGetters("Lines", ["getKegName"]),
    ...mapGetters("Session", ["getWorker"]),
    config() {
      return config;
    },
    calculateMonths() {
      this.to = this.from + 1;
      return config.months.slice(this.from, 12);
    },
  },
  methods: {
    closeAddEmergencyCard() {
      this.emergencyCardModal = false;
    },
    closeEditInfo() {
      this.editInfo = false;
      this.name = this.placeInfo.name;
      this.branch = this.placeInfo.branch;
      this.facebook = this.placeInfo.facebook;
      this.instagram = this.placeInfo.instagram;
      this.twitter = this.placeInfo.twitter;
      this.image = { imageURL: this.BASE_URL + "/placeLogo" };
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
            if (response.data.data < 1) return;
            const sales = this.fixDate(response.data.data, ["date"]);
            sales.forEach((sale) => {
              const beer_name = this.getKegName(sale.kegId);

              if (sale.workerId.length > 8) {
                const { nombre, apellidos } = this.getWorker(sale.workerId);
                sale.worker = `${nombre} ${apellidos}`;
              } else sale.worker = `N/A`;

              sale.name = beer_name;

              delete sale.__v;
              delete sale._id;
              delete sale.workerId;
            });
            const keys = Object.keys(sales);
            var csv;
            try {
              csv = parse(sales, { keys });
            } catch (e) {
              console.log("ni pedo no hay ventas");
            }
            this.writeData(csv, entity.name);
          } else if ((entity.name = "kegs")) {
            let response = await Api().get("/getKegs/");
            const kegs = this.fixDate(response.data.data, [
              "prepared",
              "released",
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
      fs.writeFile(logpath + fileName, csv, function (err) {
        if (err) console.log(err);
      });
    },
    async editPlaceInfo() {
      const { name, branch, facebook, instagram, twitter, image } = this;
      const formData = new FormData();
      this.loader = true;
      image
        ? image.imageFile
          ? formData.append("file", image.imageFile)
          : null
        : null;
      formData.append("name", name);
      formData.append("branch", branch);
      formData.append("facebook", facebook);
      formData.append("instagram", instagram);
      formData.append("twitter", twitter);
      let response = await Api().post("/editPlaceInfo", formData);
      this.loader = false;
      if (response.data.confirmation) {
        this.$store.dispatch("Session/setPlaceInfo", {
          name,
          branch,
          facebook,
          instagram,
          twitter,
        });
        this.editInfo = false;
      } else {
        console.log(response.data);
        console.log("valiste");
      }
    },
  },
  mounted: async function () {
    this.name = this.placeInfo.name;
    this.branch = this.placeInfo.branch;
    this.facebook = this.placeInfo.facebook;
    this.instagram = this.placeInfo.instagram;
    this.twitter = this.placeInfo.twitter;
    this.image = { imageURL: this.BASE_URL + "/placeLogo" };
    try {
      const address = await config.BASE_URL();
      this.ip = "HTTP://" + address + ":5000";
      console.warn(this.ip.toLowerCase() + "/#/menu");
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
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/colors";
@import "@/assets/styles/texts";
@import "@/assets/styles/components";
.config {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  background: rgb(244, 245, 249);
  padding-top: 0px;
  .image-picker {
    background-color: transparent;
    height: 192px;
    width: 170px;
    overflow: visible;
  }
  .opciones {
    font-weight: 400 !important;
    letter-spacing: 0 !important;
    text-transform: none !important;
  }
  .image-wrapper {
    display: flex;
    overflow: visible;
    width: 160px;
    height: 160px;
    justify-content: center;
    align-items: center;
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
  .config-wrapper {
    width: 100%;
    height: 100%;
  }
  .card {
    height: 200px !important;
    margin-top: 20px;
    margin-right: 10px;
  }
  .server {
    height: 90px !important;
    margin-top: 65px;
    margin-right: 10px;
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
