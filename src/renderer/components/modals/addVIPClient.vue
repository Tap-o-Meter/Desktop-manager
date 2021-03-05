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
                <lottie-animation
                  :class="animationClass"
                  :path="animation"
                  :loop="loop"
                  :autoPlay="true"
                  :speed="1"
                />
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
                      <button
                        plain
                        class="xs-subtitles-bold"
                        @click.stop="reset()"
                      >
                        <span>
                          <u>{{ this.cardId }}</u>
                        </span>
                        <v-icon class="ml-2" size="16" v-text="'mdi-repeat'" />
                      </button>
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
  </div>
</template>
<script>
import Api from "../../service/api";
import { mapState } from "vuex";
import { suscribe, unsuscribe } from "../../api/index.js";
import ConnectDevice from "./connectDevice";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs
export default {
  name: "AddWorker",
  components: { ConnectDevice, LottieAnimation },
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
      animation: "",
      animationClass: "",
      loop: true,
      message: "",
      animationClasses: ["animation-nfc", "animation-connect", "green-check"],
      animationList: ["nfc", "connect-device", "green-check"],
      messageList: [
        "Coloque la nueva tarjeta de Emergencia",
        "Favor de conectar el lector",
        "Número de tarjeta capturado"
      ]
    };
  },
  computed: { ...mapState("CardReader", ["connected"]) },
  props: {
    open: Boolean,
    handleClose: Function
  },

  beforeMount: function() {
    const option = this.connected ? 0 : 1;
    this.animationClass = this.animationClasses[option];
    this.animation = this.getAnimation(option);
    this.message = this.messageList[option];
  },
  watch: {
    open: function(newVal, oldVal) {
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      if (newVal) {
        suscribe(id => {
          this.cardId = id;
          this.animation = this.getAnimation(2);
          this.animationClass = this.animationClasses[2];
          this.message = this.messageList[2];
          this.loop = false;
          setTimeout(() => (this.setCard = false), 1200);
        });
      } else unsuscribe();
    },
    connected: function(newVal, oldVal) {
      const option = newVal ? 0 : 1;
      this.animationClass = this.animationClasses[option];
      this.message = this.messageList[option];
      this.animation = this.getAnimation(option);
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
      this.animationClass = this.animationClasses[option];
      this.animation = this.getAnimation(option);
      this.message = this.messageList[option];
      this.cardId = "";
      this.loop = true;
    },
    getAnimation(index) {
      return "../../../../static/".concat(this.animationList[index], ".json");
    },
    closeScreen() {
      this.handleClose();
      this.$refs.form.resetValidation();
      this.names = "";
      this.lastName = "";
      const option = this.connected ? 0 : 1;
      this.animationClass = this.animationClasses[option];
      this.animation = this.getAnimation(option);
      this.message = this.messageList[option];
      this.cardId = "";
      this.setCard = true;
      this.loop = true;
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        this.loader = true;
        let response = await Api().post("/addClient", {
          name: this.name,
          lastName: this.lastName,
          cardId: this.cardId,
          level: 1
        });
        this.loader = false;
        if (response.data.confirmation) {
          this.closeScreen();
        } else {
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
