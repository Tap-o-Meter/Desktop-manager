<template>
  <div>
    <v-dialog v-model="open" persistent width="820px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">Agregar a inventario</span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-3" />
        <v-card-text>
          <v-container fluid>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12" md="4">
                  <image-input v-model="image" class="image-picker">
                    <div slot="activator" class="image-wrapper">
                      <div
                        class="d-flex flex-column"
                        v-if="!image"
                        style="text-align:center"
                      >
                        <v-icon :size="90" color="grey">
                          mdi-image-filter-hdr
                        </v-icon>
                        <span class="pb-2">NO IMAGE</span>
                      </div>
                      <v-avatar size="100%" v-ripple v-else class="mb-0" tile>
                        <img :src="image.imageURL" alt="image" />
                      </v-avatar>
                      <div
                        class="d-flex justify-center align-center"
                        style="left:0;right:0;margin-left: auto;margin-right: auto;position: absolute; bottom: -20px; width: 40px; height: 40px;border-radius: 9px;box-shadow: 0 10px 20px -5px #9794f2;border: solid 1px #9794f2;background-color: #9794f2;"
                      >
                        <v-icon color="white">mdi-camera</v-icon>
                      </div>
                    </div>
                  </image-input>
                </v-col>
                <v-col md="8" class="pl-0 mt-2">
                  <v-row>
                    <v-col cols="6">
                      <v-combobox
                        v-model="name"
                        :items="names"
                        :rules="nameRules"
                        label="Nombre"
                        placeholder="Amarillo Hops"
                        required
                        outlined
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-combobox
                        v-model="brand"
                        :items="brands"
                        :rules="brandRules"
                        label="Marca*"
                        required
                        outlined
                        placeholder="YCHHOPS"
                      />
                    </v-col>

                    <v-col cols="3">
                      <v-autocomplete
                        v-model="unity"
                        outlined
                        :rules="unityRules"
                        :items="unities"
                        label="Unidad*"
                        required
                        placeholder="kg"
                      />
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="volume"
                        outlined
                        @keypress="filter"
                        :rules="volumeRules"
                        label="Volumen*"
                        required
                        placeholder="20KG (c/u)"
                      />
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        v-model="lead_time"
                        outlined
                        @keypress="filter"
                        :rules="leadRules"
                        label="Tiempo*"
                        required
                        placeholder="8 días"
                      />
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="min_product"
                        outlined
                        @keypress="filter"
                        :rules="minRules"
                        label="Cant. minima.*"
                        required
                        placeholder="20 lbs"
                      />
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
import Api from "../../service/api";
import axios from "axios";
import ImageInput from "../form/ImageInput.vue";
export default {
  name: "AddWorker",
  components: { ImageInput: ImageInput },
  data() {
    return {
      loader: false,
      marker: true,
      image: null,
      name: "",
      nameRules: [
        v => !!v || "Requerido",
        v => (v && v.length > 3) || "El nombre debe de ser mayor a 3 letras"
      ],
      brand: "",
      brandRules: [v => !!v || "Requerido"],
      unity: "",
      unityRules: [v => !!v || "Requerido"],
      volume: "",
      volumeRules: [v => !!v || "Requerido"],
      lead_time: "",
      leadRules: [v => !!v || "Requerido"],
      min_product: "",
      minRules: [v => !!v || "Requerido"],
      unities: ["kg", "g", "mg", "lb", "oz", "Lt", "mL", "gal", "qt"]
    };
  },
  props: {
    open: Boolean,
    handleClose: Function
  },
  computed: {
    names() {
      return this.$store.getters["Stock/getNames"];
    },
    brands() {
      return this.$store.getters["Stock/getBrands"];
    }
  },
  methods: {
    toggleMarker() {
      this.marker = !this.marker;
    },
    filter: function(evt) {
      evt = evt ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        try {
          const { min_product } = this;
          const { image, name, brand, unity, volume, lead_time } = this;
          this.loader = true;
          const formData = new FormData();
          image ? formData.append("file", image.imageFile) : null;
          formData.append("name", name);
          formData.append("brand", brand);
          formData.append("unity", unity);
          formData.append("volume", volume);
          formData.append("lead_time", lead_time);
          formData.append("min_product", min_product);
          let response = await Api().post("/addStock", formData);
          this.loader = false;
          if (response.data.confirmation === "success") {
            this.$store.dispatch("Stock/addStock", response.data.data);
            this.closeModal(true);
          } else {
            console.log(response.data);
            console.log("valiste");
          }
        } catch (e) {
          this.loader = false;
        }
      }
    },
    closeModal(should_update) {
      this.$refs.form.resetValidation();
      this.loader = false;
      this.marker = true;
      this.image = null;
      this.name = "";
      this.brand = "";
      this.unity = "";
      this.volume = "";
      this.lead_time = "";
      this.min_product = "";
      this.handleClose(should_update);
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
