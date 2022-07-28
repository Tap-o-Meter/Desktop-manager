<template>
  <div>
    <v-dialog v-model="open" persistent max-width="750px">
      <v-card class="pt-3 pl-3 pr-3 pb-0">
        <v-card-title>
          <p class="header-2-alt thin">
            <v-icon size="40" v-text="'mdi-star'" />
            Agregar Cliente VIP
          </p>
        </v-card-title>
        <v-divider color="lightgray" class="mb-1" />
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
                  <v-col cols="12" class="pt-0">
                    <v-row
                      class="d-flex align-center justify-center flex-column ma-0"
                    >
                      <v-icon size="100" v-text="'mdi-account-outline'" />
                      <span class="header-4-alt">No. de Tarjeta</span>
                      <div class="d-flex justify-center align-center">
                        <span class="xs-subtitles-bold">
                          <u>{{ this.cardId }}</u>
                        </span>
                        <v-btn
                          height="24"
                          width="24"
                          color="primary"
                          fab
                          class="ml-2"
                          @click.stop="reset()"
                        >
                          <v-icon size="15" v-text="'mdi-cached'" />
                        </v-btn>
                      </div>
                    </v-row>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      outlined
                      placeholder="Karen"
                      label="Nombre(s)*"
                      v-model="name"
                      :rules="nameRules"
                      required
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      placeholder="Chavez"
                      outlined
                      label="Apellido(s)*"
                      v-model="lastName"
                      :rules="lastNameRules"
                      required
                    />
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
    <v-dialog
      :value="error"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <v-icon v-text="'mdi-alert'" color="red" class="mr-2" />Error
        </v-card-title>
        <v-card-text class="d-flex flex-row align-center">
          La tarjeta que ha asignado ya está ocupada, por favor registre una
          nueva y vuelva a intentar.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="error = false">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Api from "../../service/api";
import { mapState } from "vuex";
import { suscribe, unsuscribe } from "../../api/index.js";
import ConnectDevice from "./connectDevice";
import config from "../../config";
import lottie from "lottie-web";
export default {
  name: "AddWorker",
  components: { ConnectDevice },
  data() {
    return {
      dialog: false,
      cardId: "",
      name: "",
      lastName: "",
      nameRules: [v => !!v || "El nombre es requerido"],
      lastNameRules: [v => !!v || "Los apellidos es requeridos"],
      setCard: true,
      loader: false,
      error: false,
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
  computed: { ...mapState("CardReader", ["connected"]) },
  props: {
    open: Boolean,
    handleClose: Function,
    Client: Object
  },

  beforeMount: function() {
    const option = this.connected ? 0 : 1;
    this.animationClass = this.animationClasses[option];
    this.getAnimation(option);
    this.message = this.messageList[option];
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
    closeModal() {
      this.dialog = false;
    },
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
    closeScreen(data, should_reset) {
      this.handleClose(data);
      this.$refs.form.resetValidation();
      this.name = "";
      this.lastName = "";
      this.loop = true;
      const option = this.connected ? 0 : 1;
      this.animationClass = this.animationClasses[option];
      this.getAnimation(option);
      this.message = this.messageList[option];
      this.cardId = "";
      this.setCard = true;
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        const { name, lastName, cardId } = this;
        const url = this.Client ? "/editClient" : "/addClient";
        const data = { name, lastName, cardId, level: 1 };
        this.Client ? (data.id = this.Client._id) : null;
        this.loader = true;
        let response = await Api().post(url, data);
        this.loader = false;
        if (response.data.confirmation === "success") {
          this.closeScreen(response.data.data);
        } else {
          this.error = true;
          console.log(response.data);
          console.log("valiste");
        }
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
