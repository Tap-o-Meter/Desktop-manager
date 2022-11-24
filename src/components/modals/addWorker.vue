<template>
  <div>
    <v-dialog v-model="open" persistent max-width="750px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <span class="header-2-alt thin">
            <v-icon size="50" v-text="'$addWorker'" />
            {{ this.worker ? "Editar " : "Agregar " }}trabajador
          </span>
        </v-card-title>
        <v-divider color="lightgray" class="mb-1" />

        <!--                              aquí                     -->
        <!-- <v-card-text>
          <v-container fluid>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12" md="4" style="position:relative">
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
                        <v-img :src="image.imageURL" alt="image" />
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
                      <v-text-field
                        outlined
                        placeholder=" "
                        label="Nombre(s)*"
                        v-model="nombre"
                        :rules="nameRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        outlined
                        v-model="cardId"
                        label="Card ID*"
                        :rules="cardRules"
                        placeholder="A1 B2 C3 D4"
                        required
                        readonly
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Apellidos*"
                        outlined
                        :rules="apellidosRules"
                        placeholder=" "
                        v-model="apellidos"
                        hint="example of persistent helper text"
                        persistent-hint
                        required
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text> -->
        <!--                              aquí                     -->

        <v-card-text>
          <v-container fluid class="pa-0">
            <v-scroll-x-transition :hide-on-leave="true">
              <v-row v-show="setCard" class="row-container">
                <div id="animation" :class="animationClass"></div>
                <span class="header-3-alt thin msg" v-text="message" />
              </v-row>
            </v-scroll-x-transition>
            <v-scroll-x-transition :hide-on-leave="true">
              <v-form v-show="!setCard" ref="form" lazy-validation>
                <v-row class="row-container ma-0">
                  <v-col cols="12" md="4" style="position:relative">
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
                          <v-img :src="image.imageURL" alt="image" />
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
                        <v-text-field
                          outlined
                          placeholder=" "
                          label="Nombre(s)*"
                          v-model="nombre"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          outlined
                          v-model="cardId"
                          label="Card ID*"
                          :rules="cardRules"
                          placeholder="A1 B2 C3 D4"
                          required
                          readonly
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Apellidos*"
                          outlined
                          :rules="apellidosRules"
                          placeholder=" "
                          v-model="apellidos"
                          hint="example of persistent helper text"
                          persistent-hint
                          required
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-form>
            </v-scroll-x-transition>
          </v-container>
        </v-card-text>

        <v-divider />
        <v-card-actions class="">
          <div class="d-flex flex-column">
            <span class="caption">Sensor</span>
            <span
              class="body-2 font-weight-bold"
              :class="connected ? ' green--text' : ' red--text'"
            >
              {{ connected ? "Conectado" : "Desconectado" }}
            </span>
          </div>
          <v-btn
            class="ma-2"
            dark
            color="primary"
            text
            small
            @click.stop="dialog = true"
          >
            <v-icon size="16">mdi-usb-port</v-icon>
            Conectar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeScreen()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="createUser()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConnectDevice :open="dialog" :handleClose="closeModal" />
    <v-overlay z-index="2000" :value="loader">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import Api from "../../service/api";
import { mapState } from "vuex";
import { suscribe, unsuscribe } from "../../api/index.js";
import ConnectDevice from "./connectDevice";
import ImageInput from "../form/ImageInput.vue";
import config from "../../config";
import lottie from "lottie-web";
export default {
  name: "AddWorker",
  components: { ConnectDevice, ImageInput },
  data() {
    return {
      image: null,
      dialog: false,
      cardId: "",
      cardRules: [v => !!v || "El ID de la tarjeta es requerido"],
      nombre: "",
      nameRules: [v => !!v || "El nombre es requerido"],
      apellidos: "",
      apellidosRules: [v => !!v || "Los apellidos es requeridos"],
      loader: false,
      setCard: false,
      animationClass: "",
      loop: true,
      message: "",
      animation: null,
      animationClasses: ["animation-nfc", "animation-connect", "green-check"],
      animationList: ["nfc", "connect", "check"],
      messageList: [
        "Coloque la tarjeta en el lector",
        "Favor de conectar el lector",
        "Número de tarjeta capturado"
      ]
    };
  },
  computed: {
    ...mapState("CardReader", ["connected"]),
    ...mapState("Session", ["BASE_URL"])
  },
  props: {
    open: Boolean,
    handleClose: Function,
    worker: Object
  },

  mounted: function() {
    const option = this.connected ? 0 : 1;
    this.animationClass = this.animationClasses[option];
    this.getAnimation(option);
    this.message = this.messageList[option];
    if (this.worker) {
      this.nombre = this.worker.nombre;
      this.apellidos = this.worker.apellidos;
      this.cardId = this.worker.cardId;
      if (this.worker.foto) {
        this.image = {
          imageURL: this.BASE_URL + "/getImage/" + this.worker.foto
        };
      }
    }
  },
  watch: {
    open: function(newVal, oldVal) {
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      if (newVal) {
        setTimeout(() => this.getAnimation(this.connected ? 0 : 1), 200);
        suscribe(id => {
          this.cardId = id;
          this.loop = false;
          this.getAnimation(2);
          this.animationClass = this.animationClasses[2];
          this.message = this.messageList[2];
          setTimeout(() => (this.setCard = false), 1200);
        });
      } else unsuscribe();
    },
    connected: function(newVal, oldVal) {
      const option = newVal ? 0 : 1;
      this.animationClass = this.animationClasses[option];
      this.message = this.messageList[option];
      this.getAnimation(option);
      if (newVal) this.closeModal();
    }
  },
  methods: {
    reset() {
      const option = this.connected ? 0 : 1;
      this.setCard = true;
      this.loop = true;
      this.animationClass = this.animationClasses[option];
      this.getAnimation(option);
      this.message = this.messageList[option];
      this.cardId = "";
    },
    getAnimation(index) {
      if (this.animation) this.animation.destroy();
      this.animation = lottie.loadAnimation({
        container: document.getElementById("animation"),
        renderer: "svg",
        loop: this.loop,
        autoplay: true,
        rendererSettings: {
          scaleMode: "centerCrop",
          clearCanvas: true,
          progressiveLoad: false,
          hideOnTransparent: true
        },
        animationData: config.animations[this.animationList[index]]
      });
    },
    closeModal() {
      this.dialog = false;
    },
    closeScreen(should_reset) {
      if (!this.worker) {
        this.$refs.form.resetValidation();
        this.image = null;
        this.dialog = false;
        this.cardId = "";
        this.nombre = "";
        this.apellidos = "";
        this.loader = false;
        this.setCard = true;
        this.loop = true;
        const option = this.connected ? 0 : 1;
        this.animationClass = this.animationClasses[option];

        this.getAnimation(option);
        this.message = this.messageList[option];
      }
      this.handleClose(should_reset);
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        const url = this.worker ? "/editPersonal" : "/addPersonal";
        try {
          let { image, nombre, apellidos, cardId } = this;
          this.loader = true;
          const formData = new FormData();
          image
            ? image.imageFile
              ? formData.append("file", image.imageFile)
              : null
            : null;
          this.worker ? formData.append("id", this.worker._id) : null;
          formData.append("nombre", nombre);
          formData.append("apellidos", apellidos);
          formData.append("cardId", cardId);
          let response = await Api().post(url, formData);
          this.loader = false;
          if (response.data.confirmation === "success") {
            console.log(response.data.data);
            const action = this.worker
              ? "Session/updateWorker"
              : "Session/newWorker";
            this.$store.dispatch(action, response.data.data);
            this.closeScreen(true);
          } else {
            console.log(response.data);
            alert("La tarjeta ingresada ya fue registrada");
          }
        } catch (e) {
          this.loader = false;
        }
        // this.loader = true;
        // let response = await Api().post("/addPersonal", {
        //   nombre: this.nombre,
        //   apellidos: this.apellidos,
        //   cardId: this.cardId
        // });
        // this.loader = false;
        // if (response.data.confirmation) {
        //   this.closeScreen();
        // } else {
        //   console.log(response.data);
        //   console.log("valiste");
        // }
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/texts";
.row-container {
  position: relative;
  height: 250px;
  overflow: hidden;
  justify-content: center;
}
.msg {
  text-align: center;
  position: absolute;
  width: 100%;
  margin-top: 200px;
  z-index: 100;
}
.green-check {
  width: 200px !important;
  height: 160px !important;
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 15px !important;
  margin-left: auto;
  margin-right: auto;
}
.animation-nfc {
  width: 300px;
  height: 300px;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: -30px !important;
}

.animation-connect {
  width: 200px !important;
  height: 150px !important;
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 20px !important;
  margin-left: auto;
  margin-right: auto;
}
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
</style>
<style>
.v-dialog {
  overflow: visible !important;
}
</style>
