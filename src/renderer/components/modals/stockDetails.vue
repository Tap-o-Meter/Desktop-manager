<template>
  <div>
    <v-dialog v-model="open" persistent width="820px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">Articulo</span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-3" />
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="4">
                <image-input class="image-picker">
                  <div slot="activator" class="image-wrapper">
                    <v-avatar size="100%" v-ripple class="mb-0" tile>
                      <img
                        :src="
                          image !== null
                            ? image
                            : require('@/assets/no-image.svg')
                        "
                        alt="image"
                      />
                    </v-avatar>
                  </div>
                </image-input>
              </v-col>
              <v-col md="8" class="pl-0 mt-2">
                <v-row>
                  <v-col cols="6">
                    <v-combobox
                      disabled
                      v-model="name"
                      :items="names"
                      label="Nombre"
                      placeholder="Amarillo Hops"
                      required
                      outlined
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-combobox
                      disabled
                      v-model="brand"
                      :items="brands"
                      label="Marca*"
                      required
                      outlined
                      placeholder="YCHHOPS"
                    />
                  </v-col>

                  <v-col cols="3">
                    <v-autocomplete
                      disabled
                      v-model="unity"
                      outlined
                      :items="unities"
                      label="Unidad*"
                      required
                      placeholder="kg"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      disabled
                      v-model="volume"
                      outlined
                      label="Volumen*"
                      required
                      placeholder="20KG (c/u)"
                    />
                  </v-col>

                  <v-col cols="3">
                    <v-text-field
                      v-model="lead_time"
                      outlined
                      label="Tiempo*"
                      required
                      disabled
                      placeholder="8 días"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="min_product"
                      outlined
                      disabled
                      label="Cant. minima.*"
                      required
                      placeholder="20 lbs"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
          <p class="text-sm-right mb-0 text--secondary">
            <small>*indicates required field</small>
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions class="">
          <v-spacer />
          <v-btn color="blue darken-1" text @click="handleClose(false)">
            Cerrar
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
import Api from "../../service/api";
import axios from "axios";
import ImageInput from "../form/ImageInput.vue";
import { mapState } from "vuex";
export default {
  name: "AddWorker",
  components: {
    ImageInput: ImageInput
  },
  data() {
    return {
      loader: false,
      marker: true,
      image: null,
      name: "",
      brand: "",
      unity: "",
      volume: "",
      lead_time: "",
      min_product: "",
      unities: ["kg", "g", "mg", "lb", "oz", "Lt", "mL", "gal", "qt"]
    };
  },
  props: {
    open: Boolean,
    handleClose: Function,
    item: Object
  },
  computed: {
    ...mapState("Session", ["BASE_URL"]),
    names() {
      return this.$store.getters["Stock/getNames"];
    },
    brands() {
      return this.$store.getters["Stock/getBrands"];
    }
  },
  watch: {
    item: function(newVal, oldVal) {
      if (newVal !== null) {
        this.brand = newVal.brand;
        this.unity = newVal.unity;
        this.volume = newVal.volume;
        this.lead_time = newVal.lead_time;
        this.min_product = newVal.min_product;
        this.name = newVal.name;
        this.image =
          newVal.image !== null
            ? this.BASE_URL + "/getImage/" + newVal.image
            : null;
      }
    }
  },
  methods: {
    toggleMarker() {
      this.marker = !this.marker;
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
  height: 220px;
  width: 190px;
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
