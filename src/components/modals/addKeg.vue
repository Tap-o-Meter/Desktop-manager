<template>
  <div>
    <v-dialog v-model="open" persistent width="750px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">Agregar Barril</span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-3" />
        <v-card-text>
          <v-container class="pb-0" fluid>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col class="pb-0" md="12">
                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                        v-model="beerId"
                        :items="beers"
                        item-text="name"
                        item-value="_id"
                        outlined
                        :rules="beerRules"
                        v-on:change="beerChange"
                        label="Cerveza*"
                        required
                        placeholder="Cerveza"
                      >
                        <template v-slot:selection="data">
                          <v-avatar
                            v-if="data.item.image !== null"
                            size="35"
                            class="mr-3"
                          >
                            <v-img
                              :src="BASE_URL + '/getImage/' + data.item.image"
                            />
                          </v-avatar>
                          {{ data.item.name }}
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="abv"
                        outlined
                        @keypress="filter"
                        label="ABV*"
                        required
                        placeholder="3.5"
                        suffix="%"
                      />
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        v-model="ibu"
                        outlined
                        @keypress="filter"
                        label="IBU*"
                        required
                        placeholder="80"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-combobox
                        :items="keg_sizes"
                        v-model="capacity"
                        :item-value="'qty_lts'"
                        :item-text="'qty_lts'"
                        outlined
                        @keypress="filter"
                        label="Capacity *"
                        required
                        suffix="Lts."
                        placeholder="20"
                        :search-input.sync="searchInput"
                        >
                        <template v-slot:item="{ index, item }">
                          <td>{{item.name}} </td>
                          <v-spacer/>
                          <td>{{item.qty_gal}}<b>Gal</b> / {{item.qty_lts}}<b>Lts</b> </td>
                        </template>
                      </v-combobox>
                      <!-- :append-outer-icon="marker ? 'mdi-alpha-g' : 'mdi-alpha-l'"
                      @click:append-outer="toggleMarker" -->
                      <!-- <v-combobox
                        v-model="brand"
                        :items="brands"
                        :rules="brandRules"
                        label="Marca*"
                        required
                        outlined
                        placeholder="YCHHOPS"
                      /> -->
                    </v-col>

                    <v-col class="pb-0" cols="6">
                      <v-menu
                        ref="menu1"
                        v-model="menu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="Fecha de elaboración"
                            :rules="dateRules"
                            placeholder="YYYY-MM-DD"
                            outlined
                            readonly
                            prepend-inner-icon="mdi-calendar-month"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          no-title
                          @input="menu1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col class="pb-0" cols="6">
                      <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date2"
                            label="Fecha de enbarrilado"
                            :rules="date2Rules"
                            placeholder="YYYY-MM-DD"
                            outlined
                            prepend-inner-icon="mdi-calendar-month"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="date2"
                          no-title
                          @input="menu2 = false"
                        />
                      </v-menu>
                    </v-col>
                    <v-col class="pa-0" offset="10" cols="2">
                      <v-text-field
                        readonly
                        class="centered-input"
                        v-model="cant"
                        label="Qty"
                      >
                        <v-icon slot="append-outer" @click="cant++" color="red">
                          mdi-plus
                        </v-icon>
                        <v-icon
                          slot="prepend"
                          @click="cant > 1 ? cant-- : null"
                          color="green"
                        >
                          mdi-minus
                        </v-icon>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
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
import { mapState } from "vuex";
import Api from "../../service/api";
import config from "./../../config";
export default {
  name: "AddWorker",
  data(vm) {
    return {
      loader: false,
      marker: true,
      beerId: "",
      cant: 1,
      beerRules: [(v) => !!v || "Requerido"],
      abv: "",
      abvRules: [
        (v) => !!v || "Requerido",
        (v) => (v && !isNaN(parseFloat(v))) || "El ABV debe de ser un número",
      ],
      ibu: "",
      ibuRules: [
        (v) => !!v || "Requerido",
        (v) => (v && !isNaN(parseInt(v))) || "El IBU debe de ser un número",
      ],
      capacity: "",
      customCapacity: "",
      capacityRules: [
        (v) => !!v || "Requerido",
        (v) =>
          (v && !isNaN(parseFloat(v))) || "La capacidad debe de ser un número",
      ],
      date: "",
      dateRules: [(v) => !!v || "Requerido"],
      date2: "",
      date2Rules: [(v) => !!v || "Requerido"],
      menu1: false,
      menu2: false,
    };
  },
  props: {
    open: Boolean,
    preBeer: Object,
    handleClose: Function,
  },
  computed: {
    ...mapState("Lines", ["beers"]),
    ...mapState("Session", ["BASE_URL"]),
    keg_sizes() {
      return config.keg_sizes;
    },
    searchInput: {
    get() {
      // Convertir el número a cadena cuando se accede
      return String(this.customCapacity);
    },
    set(value) {
      // Convertir la cadena a número cuando se establece
      const number = Number(value);
      this.customCapacity = number || "";
    }
  }
  },
  watch: {
    open: function (newVal, oldVal) {
      if (newVal) {
        if (this.preBeer) {
          this.beerId = this.preBeer._id;
          this.abv = this.preBeer.abv;
          this.ibu = this.preBeer.ibu;
        }
      }
    },
    customCapacity: function (newVal, oldVal) {
      console.warn(newVal = String(newVal));
    },
  },

  methods: {
    filter: function (evt) {
      evt = evt ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    toggleMarker() {
      this.marker = !this.marker;
      // console.warn(this.capacity);
    },
    beerChange() {
      const selectedBeer = this.beers.find((beer) => beer._id === this.beerId);
      this.abv = selectedBeer.abv;
      this.ibu = selectedBeer.ibu;
    },
    galToliter() {
      return this.capacity * 3.785411784;
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        const { marker, capacity, beerId, abv, ibu, date, date2, cant } = this;
        try {
          this.loader = true;
          let response = await Api().post("/addKeg", {
            qty: cant,
            prepared: date,
            released: date2,
            capacity: marker ? capacity.qty_lts : this.galToliter(),
            beerId,
            abv,
            ibu,
          });
          this.loader = false;
          if (response.data.confirmation === "success") {
            console.log(response.data);
            this.$store.dispatch("Lines/addKeg", {
              ...response.data.data,
              cant,
            });
            this.closeModal();
          } else {
            console.log(response.data);
            console.log("valiste");
          }
        } catch (e) {
          this.loader = false;
        }
      }
    },
    closeModal() {
      this.$refs.form.resetValidation();
      this.loader = false;
      this.marker = true;
      this.cant = 1;
      this.beerId = "";
      this.abv = "";
      this.ibu = "";
      this.capacity = "";
      this.date = "";
      this.date2 = "";
      this.menu1 = false;
      this.menu2 = false;
      this.handleClose(false);
    },
  },
};
</script>
<style>
.v-dialog {
  overflow: visible !important;
}
.centered-input input {
  text-align: center;
}
.centered-input .v-label {
  left: 30% !important;
}
</style>
<style lang="scss" scoped>
@import "@/assets/styles/texts";
@import "@/assets/styles/colors";
@import "@/assets/styles/components";

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
