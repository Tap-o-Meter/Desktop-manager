<template>
  <div>
    <v-dialog v-model="open" persistent width="820px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">Información</span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-3" />
        <v-card-text>
          <v-container fluid class="pa-2">
            <v-row>
              <v-col cols="12" md="4" class="pt-0">
                <v-row class="ma-0 pa-0">
                  <v-avatar size="200px" v-ripple class="mb-0 image-picker">
                    <v-img
                      cover
                      :src="
                        beer.image !== null
                          ? BASE_URL + '/getImage/' + beer.image
                          : require('@/assets/no-beer.svg')
                      "
                      alt="image"
                    />
                  </v-avatar>
                </v-row>
                <v-row class="ma-0 pa-0">
                  <v-col>
                    <span class="header-5-alt center-text">
                      ESTADO DEL BARRIL:
                      <u
                        v-text="status"
                        class="header-6-alt ml-1"
                        :class="
                          status === 'FULL'
                            ? 'light-green--text'
                            : status === 'DISCONNECTED'
                            ? 'red--text'
                            : 'amber--text'
                        "
                      />
                    </span>
                    <h6 class="header-5-alt mt-5">CANTIDAD RESTANTE</h6>
                    <div class="d-flex align-center mb-5">
                      <v-progress-linear
                        color="cyan darken-2"
                        rounded
                        :value="this.availableRate"
                      />
                      <h6 class="header-6-alt  ml-2" style="width:40px">
                        {{ this.availableRate.toFixed(1) }}%
                      </h6>
                    </div>
                    <h6 class="header-5-alt ">MERMA</h6>
                    <div class="d-flex align-center mb-5">
                      <v-progress-linear
                        color="light-green darken-2"
                        rounded
                        :value="mermaRate"
                      />
                      <h6 class="header-6-alt  ml-2" style="width:40px">
                        {{ this.mermaRate.toFixed(1) }}%
                      </h6>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col md="8" class="pl-0 mt-0 pt-0">
                <v-row>
                  <v-col md="12">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          readonly
                          v-model="beer.name"
                          :outlined="edit"
                          label="Cerveza*"
                          required
                          placeholder="Cerveza"
                        />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          readonly
                          v-model="abv"
                          :outlined="edit"
                          label="ABV*"
                          required
                          placeholder="3.5"
                          suffix="%"
                        />
                      </v-col>

                      <v-col cols="2">
                        <v-text-field
                          readonly
                          v-model="ibu"
                          :outlined="edit"
                          label="IBU*"
                          required
                          placeholder="80"
                        />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          readonly
                          :append-icon="marker ? 'mdi-alpha-l' : 'mdi-alpha-g'"
                          @click:append="toggleMarker"
                          v-model="capacity"
                          :outlined="edit"
                          label="Qty*"
                          required
                          placeholder="20"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          readonly
                          v-model="prepared"
                          label="Fecha de elaboración"
                          placeholder="YYYY-MM-DD"
                          :outlined="edit"
                          prepend-inner-icon="mdi-calendar-month"
                        />
                      </v-col>

                      <v-col cols="6">
                        <v-text-field
                          readonly
                          v-model="released"
                          label="Fecha de enbarrilado"
                          placeholder
                          placeholder="YYYY-MM-DD"
                          :outlined="edit"
                          prepend-inner-icon="mdi-calendar-month"
                          readonly
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          readonly
                          v-model="available"
                          label="Cantidad Restante"
                          :outlined="edit"
                          :append-icon="marker ? 'mdi-alpha-l' : 'mdi-alpha-g'"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions class="">
          <v-spacer />
          <v-btn color="error darken-1" text @click="confirm = true">
            Marcar como vacío
          </v-btn>
          <v-btn color="blue darken-1" text @click="handleClose(false)">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-dialog persistent v-model="confirm" max-width="390">
        <v-card class="pt-3 pl-3 pr-3 pb-1">
          <v-card-title>Eliminar barril</v-card-title>
          <v-card-text class="d-flex flex-row align-center">
            ¿Estás seguro que deseas borrar a el barril preparado el
            {{ this.prepared }}?, al confirmar sólo se marcará como vacío, no se
            borrará el barril ni el registro de sus ventas.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="confirm = false">
              Cancelar
            </v-btn>
            <v-btn color="primary darken-1" text @click="deleteKeg()">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-dialog>
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import Api from "../../service/api";
import axios from "axios";
import config from "../../config";
import { mapState } from "vuex";
export default {
  name: "KegDetails",
  data: () => ({
    ibu: "",
    abv: "",
    beerId: "null",
    capacity: "",
    released: "",
    prepared: "",
    available: "",
    status: "",
    merma: "",
    taster: "",
    soldPints: "",
    id: "",
    marker: false,
    edit: false,
    confirm: false,
    loader: false
  }),
  props: {
    open: Boolean,
    handleClose: Function,
    item: Object,
    beer: Object
  },
  computed: {
    ...mapState("Session", ["BASE_URL"]),
    names() {
      return this.$store.getters["Stock/getNames"];
    },
    brands() {
      return this.$store.getters["Stock/getBrands"];
    },
    availableRate() {
      return (this.available / this.capacity) * 100;
    },
    mermaRate() {
      return (this.merma / this.capacity) * 100;
    }
  },
  watch: {
    item: function(newVal, oldVal) {
      if (newVal !== null) {
        this.ibu = newVal.ibu;
        this.abv = newVal.abv;
        this.beerId = newVal.beerId;
        this.capacity = newVal.capacity;
        this.released = this.parseDate(newVal.released);
        this.prepared = this.parseDate(newVal.prepared);
        this.available = newVal.available.toFixed(1);
        this.status = newVal.status;
        this.merma = newVal.merma;
        this.taster = newVal.taster;
        this.soldPints = newVal.soldPints;
        this.id = newVal._id;
      }
    }
  },
  methods: {
    toggleMarker() {
      this.marker = !this.marker;
    },
    parseDate(date) {
      return config.parseHalfDate(date);
    },
    async deleteKeg() {
      try {
        this.loader = true;
        let response = await Api().post("/deleteKeg", { id: this.id });
        if (response.data.confirmation) {
          this.confirm = false;
          this.loader = false;
          this.$store.dispatch("Lines/deleteKeg", this.id);
          this.handleClose(true);
        } else {
          this.loader = false;
          console.log(response.data);
          console.log("valiste");
        }
      } catch (e) {
        this.loader = false;
        this.confirm = false;
        alert("Valió madres");
      }
    }
  }
};
</script>
<style>
.v-dialog {
  overflow: visible !important;
}
</style>
<style lang="scss" scoped>
@import "@/assets/styles/texts";
@import "@/assets/styles/colors";
.image-picker {
  position: relative;
  background-color: transparent;
  pointer-events: none;
}
.image-wrapper {
  display: flex;
  overflow: hidden;
  border: 1px solid lightgray;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  img {
    object-fit: cover;
  }
}
.online {
  color: $alert-hover;
}
.free {
  color: $green-hover;
}
</style>
