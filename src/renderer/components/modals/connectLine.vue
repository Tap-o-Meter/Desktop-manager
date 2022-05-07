<template>
  <div>
    <v-dialog v-model="open" persistent width="800px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">Conectar Línea</span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-3" />
        <v-card-text>
          <v-container fluid>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-row>
                  <v-col cols="6">
                    <v-select
                      v-model="beer"
                      :rules="beerRules"
                      :items="beers"
                      item-text="name"
                      item-value="_id"
                      v-on:change="beerChange"
                      outlined
                      label="Cerveza*"
                      required
                      placeholder="Cerveza"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="keg"
                      :items="kegs"
                      :rules="kegRules"
                      item-text="released"
                      v-on:change="kegChange"
                      return-object
                      outlined
                      label="Enbotellado*"
                      prepend-inner-icon="mdi-calendar-month"
                      required
                      placeholder="DD/MM/AAAA"
                    >
                      <template v-slot:selection="data">
                        <span v-text="parseDate(data.item.released)" />
                      </template>
                      <template v-slot:item="data">
                        <span v-text="parseDate(data.item.released)" />
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" class="pb-0">
                    <v-select
                      v-model="line"
                      prefix="#"
                      :rules="lineRules"
                      placeholder="0"
                      :items="lines"
                      item-text="noLinea"
                      item-value="_id"
                      label="# Linea"
                      outlined
                    >
                      <template v-slot:selection="data">
                        {{ data.item.noLinea }}
                        <span
                          class="ma-0 font-weight-black overline"
                          :class="getStatus(data.item) ? 'online' : 'free'"
                          style="position:absolute; right:25px; top:21px"
                          v-html="getStatus(data.item) ? 'En Uso' : 'Libre'"
                        ></span>
                      </template>
                      <template v-slot:item="data">
                        {{ data.item.noLinea }}
                        <span
                          class="ma-0 font-weight-black overline"
                          :class="getStatus(data.item) ? 'online' : 'free'"
                          style="position:absolute; right:25px; top:16px"
                          v-html="getStatus(data.item) ? 'En Uso' : 'Libre'"
                        ></span>
                      </template>
                    </v-select>
                  </v-col>

                  <v-col cols="2" class="pb-0">
                    <v-text-field
                      v-model="abv"
                      outlined
                      label="ABV*"
                      required
                      readonly
                      placeholder="3.5"
                      suffix="%"
                    />
                  </v-col>

                  <v-col cols="2" class="pb-0">
                    <v-text-field
                      v-model="ibu"
                      outlined
                      label="IBU*"
                      required
                      readonly
                      placeholder="80"
                    />
                  </v-col>
                  <v-col cols="2" class="pb-0">
                    <v-text-field
                      :append-icon="marker ? 'mdi-alpha-l' : 'mdi-alpha-g'"
                      @click:append="toggleMarker"
                      v-model="barrelCapacity"
                      outlined
                      label="Qty*"
                      required
                      readonly
                      placeholder="20"
                    />
                  </v-col>
                  <v-col cols="6" class="pt-0 pb-0">
                    <p class="mb-0 header-5-alt light">El barril está:</p>
                    <v-radio-group
                      dense
                      v-model="status"
                      :rules="statusRules"
                      row
                    >
                      <v-radio label="Vacío" value="EMPTY" />
                      <v-radio label="Aún tiene" value="DISCONNECTED" />
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-row>
            </v-form>
          </v-container>
          <p class="text-sm-right mb-0 text--secondary">
            <small>*indicates required field</small>
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions class="">
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeModal()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="createUser()">Save</v-btn>
        </v-card-actions>
      </v-card>
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
import { mapState, mapGetters } from "vuex";
export default {
  name: "AddWorker",
  data() {
    return {
      loader: false,
      marker: true,
      beer: "",
      beerRules: [v => !!v || "El nombre es requerido"],
      keg: "",
      kegRules: [v => !!v || "El barril es requerido"],
      abv: "",
      ibu: "",
      line: "",
      lineRules: [v => !!v || "La línea es requerida"],
      status: "",
      statusRules: [v => !!v || "El estado es requerido"],
      barrelCapacity: "",
      kegs: []
    };
  },
  props: {
    open: Boolean,
    handleClose: Function
  },
  computed: {
    ...mapState("Lines", ["lines", "beers"]),
    ...mapGetters("Lines", ["getStatus", "getBeerKegs"])
  },
  methods: {
    parseDate(date) {
      return config.parseHalfDate(date);
    },
    toggleMarker() {
      this.marker = !this.marker;
      this.galToliter();
    },
    beerChange() {
      this.kegs = this.getBeerKegs(this.beer);
    },
    kegChange() {
      this.abv = this.keg.abv;
      this.ibu = this.keg.ibu;
      this.barrelCapacity = this.keg.capacity;
    },
    galToliter() {
      this.barrelCapacity = this.marker
        ? this.keg.capacity
        : this.barrelCapacity / 3.785411784;
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        const { keg, line, status } = this;
        this.loader = true;
        let response = await Api().post("/connect-line", {
          id: line,
          newStatus: status,
          newKeg: keg._id
        });
        this.loader = false;
        if (response.data.confirmation === "success") {
          this.$store.dispatch("Lines/replaceLine", {
            data: response.data.data,
            newStatus: status
          });
          this.closeModal();
        } else {
          console.log(response.data);
          console.log("valiste");
        }
      }
    },
    closeModal() {
      this.$refs.form.resetValidation();
      this.marker = true;
      this.beer = "";
      this.keg = "";
      this.abv = "";
      this.ibu = "";
      this.line = "";
      this.status = "";
      this.barrelCapacity = "";
      this.kegs = [];
      this.handleClose(false);
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
  border-radius: 10px;
  height: 220px;
  width: 190px;
  border: 1px solid lightgray;
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
