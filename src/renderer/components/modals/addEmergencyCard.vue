<template>
  <div>
    <v-dialog v-model="open" persistent max-width="750px">
      <v-card class="pt-3 pl-3 pr-3 pb-1">
        <v-card-title>
          <p class="header-2-alt thin">
            <v-icon size="50" v-text="'$addWorker'" />
            Tarjeta de Emergencia
          </p>
        </v-card-title>
        <v-divider color="lightgray" class="mb-1" />
        <v-card-text>
          <v-container fluid>
            <v-row class="row-container">
              <div id="animation" :class="animationClass"></div>
              <span class="header-3-alt thin msg" v-text="message" />
            </v-row>
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
import config from "../../config";
import lottie from "lottie-web";
export default {
  name: "AddWorker",
  components: { ConnectDevice },
  data() {
    return {
      dialog: false,
      cardId: "",
      loader: false,
      animationClass: "",
      loop: true,
      message: "",
      animation: null,
      animationClasses: ["animation-nfc", "animation-connect", "green-check"],
      animationList: ["nfc", "connect", "check"],
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
      return 1;
    },
    closeScreen() {
      this.handleClose();
      this.loop = true;
      const option = this.connected ? 0 : 1;
      this.animationClass = this.animationClasses[option];
      this.getAnimation(option);
      this.message = this.messageList[option];
      this.cardId = "";
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        const url = this.worker ? "/editPersonal" : "/addPersonal";
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
