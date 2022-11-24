<template>
  <div>
    <v-dialog v-model="open" persistent width="950px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">Agregar Barril mdf</span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-3" />
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="3">
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
                      <span>NO IMAGE</span>
                    </div>
                    <v-avatar size="100%" v-ripple v-else class="mb-3" tile>
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
              <v-col md="9">
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="name"
                      outlined
                      label="Nombre*"
                      required
                      :rules="nameRules"
                      placeholder="Cerveza"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="style"
                      outlined
                      label="Estilo*"
                      required
                      :rules="styleRules"
                      placeholder="IPA"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="brand"
                      outlined
                      label="Marca*"
                      required
                      placeholder="Local"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="abv"
                      outlined
                      label="ABV*"
                      required
                      placeholder="3.5"
                      suffix="%"
                    />
                  </v-col>

                  <v-col cols="2">
                    <v-text-field
                      v-model="ibu"
                      outlined
                      label="IBU*"
                      required
                      placeholder="80"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      :append-icon="marker ? 'mdi-alpha-l' : 'mdi-alpha-g'"
                      @click:append="toggleMarker"
                      v-model="barrelCapacity"
                      outlined
                      label="Qty*"
                      required
                      :rules="capacityRules"
                      placeholder="20"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-textarea
                      outlined
                      label="Descripción*"
                      required
                      no-resize
                      placeholder="Una cerveza a base de ......."
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-select
                      prefix="#"
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
                        <!-- <v-chip
                          class="ma-0"
                          small
                          dark
                          style="position:absolute; right:25px; top:12px"
                          :color="getStatus(data.item) ? 'green' : 'red'"
                        >
                        </v-chip> -->
                        <span
                          class="ma-0 font-weight-black overline"
                          :class="getStatus(data.item) ? 'online' : 'free'"
                          style="position:absolute; right:25px; top:16px"
                          v-html="getStatus(data.item) ? 'En Uso' : 'Libre'"
                        ></span>
                      </template>
                    </v-select>
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
          <v-btn color="blue darken-1" text @click="closeModal()">
            Close
          </v-btn>
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
import { mapState, mapGetters } from "vuex";
import ImageInput from "../form/ImageInput.vue";
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
      nameRules: [
        v => !!v || "El nombre es requerido",
        v => (v && v.length <= 3) || "El nombre debe de ser mayor a 3 letras"
      ],
      style: "",
      styleRules: [v => !!v || "El Estilo es requerido"],
      brand: "",
      abv: "",
      ibu: "",
      barrelCapacity: "",
      capacityRules: [
        v => !!v || "La capacidad es requerida",
        v => (v && isNaN(v)) || "El nombre debe de ser mayor a 3 letras"
      ],
      descripcion: ""
    };
  },
  props: {
    open: Boolean,
    handleClose: Function
  },
  computed: {
    ...mapState("Lines", ["lines"]),
    ...mapGetters("Lines", ["getStatus"])
  },
  methods: {
    toggleMarker() {
      this.marker = !this.marker;
    },
    async createUser() {
      this.$refs.form.validate();
      // const { image } = this;
      // console.log(this.image);
      // this.loader = true;
      // const formData = new FormData();
      // image ? formData.append("file", image.imageFile) : null;
      // formData.append("name", this.name);
      // formData.append("style", this.style);
      // formData.append("brand", this.brand);
      // formData.append("abv", this.abv);
      // formData.append("ibu", this.ibu);
      // formData.append("barrelCapacity", this.barrelCapacity);
      // formData.append("descripcion", this.descripcion);
      // let response = await Api().post("/addBarrel", formData);
      // this.loader = false;
      // if (response.data.confirmation) {
      //   console.log(response.data);
      //   this.closeModal();
      // } else {
      //   console.log(response.data);
      //   console.log("valiste");
      // }
    },
    closeModal() {
      this.marker = true;
      this.image = null;
      this.name = "";
      this.style = "";
      this.brand = "";
      this.abv = "";
      this.ibu = "";
      this.barrelCapacity = "";
      this.descripcion = "";
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
