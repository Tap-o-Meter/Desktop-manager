<template>
  <div class="addBeer">
    <v-dialog v-model="open" persistent width="950px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">
            <v-icon size="50">$addBeer</v-icon>
            {{ this.isEditing ? "Editar" : "Agregar" }} Cerveza
          </span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-3" />
        <v-card-text>
          <v-container fluid class="pb-0">
            <v-form ref="form" lazy-validation>
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
                      <v-avatar size="100%" v-ripple v-else class="" tile>
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
                <v-col md="9" class="pb-0">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="name"
                        outlined
                        label="Nombre*"
                        :rules="nameRules"
                        required
                        placeholder="Cerveza"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="style"
                        outlined
                        label="Estilo*"
                        :rules="styleRules"
                        required
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
                    <v-col cols="3">
                      <v-text-field
                        v-model="abv"
                        outlined
                        @keypress="filter"
                        label="ABV*"
                        :rules="abvRules"
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
                        :rules="ibuRules"
                        label="IBU*"
                        required
                        placeholder="80"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-textarea
                        outlined
                        label="Descripción*"
                        no-resize
                        hide-details
                        placeholder="Una cerveza a base de ......."
                      />
                      <v-checkbox
                        v-model="addKeg"
                        class="ma-0 pl-2 pt-7"
                        :label="'Agregar barriles'"
                      ></v-checkbox>
                      <!-- <v-radio-group row class="ma-0 pl-2 pt-7">
                        <template v-slot:label>
                          <div class="s-light-subtitles">
                            Agregar barriles ahora:
                          </div>
                        </template>
                        <div class="d-flex flex-row">
                          <v-radio label="SRM" :value="true" />
                          <v-radio label="Personalizado" :value="false" />
                        </div>
                      </v-radio-group> -->
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="type"
                        placeholder="Linea"
                        :rules="typeRules"
                        :items="typeList"
                        label="Tipo*"
                        outlined
                      />
                      <v-radio-group
                        v-model="beerColorOpt"
                        row
                        class="ma-0 pl-2"
                      >
                        <template v-slot:label>
                          <div class="s-light-subtitles">
                            Elegir por <strong>SRM</strong> o
                            <strong>Color</strong>
                          </div>
                        </template>
                        <div class="d-flex flex-row">
                          <v-radio label="SRM" :value="true" />
                          <v-radio label="Personalizado" :value="false" />
                        </div>
                      </v-radio-group>
                      <v-select
                        v-if="beerColorOpt"
                        v-model="srm"
                        :rules="srmRules"
                        placeholder="Color"
                        :items="srmList"
                        item-value="srm"
                        label="SRM*"
                        outlined
                      >
                        <template v-slot:selection="data">
                          <v-avatar size="20" tile :color="data.item.color" />
                          <span class="ml-2" v-text="'SRM ' + data.item.srm" />
                        </template>
                        <template v-slot:item="data">
                          <v-avatar size="20" tile :color="data.item.color" />
                          <span class="ml-2" v-text="'SRM ' + data.item.srm" />
                        </template>
                      </v-select>

                      <v-text-field
                        v-else
                        v-model="color"
                        v-mask="mask"
                        :rules="srmRules"
                        outlined
                        label="Color*"
                      >
                        <template v-slot:append>
                          <v-menu
                            v-model="menu"
                            top
                            nudge-bottom="210"
                            nudge-left="16"
                            :close-on-content-click="false"
                          >
                            <template v-slot:activator="{ on }">
                              <div :style="swatchStyle" v-on="on" />
                            </template>
                            <v-card>
                              <v-card-text class="pa-0">
                                <v-color-picker v-model="color" flat />
                              </v-card-text>
                            </v-card>
                          </v-menu>
                        </template>
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
import config from "../../config";
import Api from "../../service/api";
import ImageInput from "../form/ImageInput.vue";
import { mapState } from "vuex";
export default {
  name: "AddWorker",
  components: {
    ImageInput: ImageInput
  },
  data() {
    return {
      color: "#1976D2",
      mask: "!#XXXXXX",
      menu: false,
      beerColorOpt: true,
      valid: true,
      loader: false,
      marker: true,
      image: null,
      addKeg: null,
      name: "",
      style: "",
      brand: "",
      abv: "",
      ibu: "",
      type: "",
      description: "",
      srm: "",
      nameRules: [
        v => !!v || "El nombre es requerido",
        v => (v && v.length > 3) || "El nombre debe de ser mayor a 3 letras"
      ],
      styleRules: [v => !!v || "El Estilo es requerido"],
      abvRules: [
        v => !!v || "El ABV es requerido",
        v => (v && !isNaN(parseInt(v))) || "El ABV debe de ser un número"
      ],
      ibuRules: [
        v => !!v || "El IBU es requerido",
        v => (v && !isNaN(parseInt(v))) || "El IBU debe de ser un número"
      ],
      typeRules: [v => !!v || "El tipo es requerido"],
      srmRules: [v => !!v || "El SRM es requerido"],
      typeList: ["Linea", "Temporada"]
    };
  },
  props: {
    open: Boolean,
    handleClose: Function,
    isEditing: Boolean,
    beer: Object
  },
  computed: {
    ...mapState("Session", ["BASE_URL"]),
    srmList: function() {
      return config.srmList;
    },
    swatchStyle() {
      const { color, menu } = this;
      return {
        backgroundColor: color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: menu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out"
      };
    }
  },
  beforeMount: function() {
    if (this.isEditing) {
      this.name = this.beer.name;
      this.style = this.beer.style;
      this.brand = this.beer.brand;
      this.abv = this.beer.abv;
      this.ibu = this.beer.ibu;
      this.type = this.beer.type;
      this.description = this.beer.description;
      this.srm = this.srmList[this.beer.srm - 1].srm;
      if (this.beer.image) {
        this.image = {
          imageURL: this.BASE_URL + "/getImage/" + this.beer.image
        };
      }
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
        const { image, beerColorOpt, color } = this;
        //console.warn(s2.toString(16));
        this.loader = true;
        try {
          const formData = new FormData();
          const fixedColor = !beerColorOpt
            ? parseInt("0x" + color.substring(1))
            : this.srm;
          image
            ? image.imageFile
              ? formData.append("file", image.imageFile)
              : null
            : null;
          this.isEditing ? formData.append("id", this.beer._id) : null;
          formData.append("name", this.name);
          formData.append("style", this.style);
          formData.append("brand", this.brand);
          formData.append("abv", this.abv);
          formData.append("ibu", this.ibu);
          formData.append("srm", fixedColor);
          formData.append("type", this.type);
          formData.append("description", this.description);
          const path = this.isEditing ? "/editBeer" : "/addBeer";
          let response = await Api().post(path, formData);
          this.loader = false;
          if (response.data.confirmation === "success") {
            const action = this.isEditing ? "Lines/editBeer" : "Lines/addBeer";
            this.$store.dispatch(action, response.data.data);
            this.closeModal(response.data.data);
          } else {
            console.log(response.data);
            console.log("valiste");
          }
        } catch (e) {
          this.loader = false;
        }
      }
    },
    closeModal(id) {
      this.$refs.form.resetValidation();
      if (!this.isEditing) {
        this.marker = true;
        this.image = null;
        this.name = "";
        this.style = "";
        this.brand = "";
        this.abv = "";
        this.ibu = "";
        this.type = "";
        this.description = "";
        this.srm = "";
      }
      if (this.addKeg) this.handleClose(false, id);
      else this.handleClose(false);
    }
  }
};
</script>
<style lang="scss">
.v-dialog {
  overflow: visible !important;
}

.v-text-field--outlined fieldset {
  color: gray !important;
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
