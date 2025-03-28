<template>
  <div id="app no-scroll">
    <v-app id="app-content">
      <SideNavigator />

      <div :class="this.$route.name != 'login' ? 'app-wrapper' : 'full-screen'">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
        <ConnectLine :open="lineDialog" :handleClose="showConnectLine" />
        <ErrorMessage
          :visible="showError"
          :message="message"
          :handleClose="closeError"
          :firstLoad="errorLoad"
        />
        <RechargeCard
          :user="workerAction"
          :open="rechargeDialog"
          :handleClose="showRechargeCard"
        />

        <MultipleOptions
          :open="visible"
          :handleClose="showOptions"
          :options="options"
        />
        <v-alert
          :value="!connectionStatus"
          color="red"
          dark
          class="connection-alert"
          border="top"
          icon="mdi-alert"
          transition="scale-transition"
        >
          <b>Revise conexión</b>. No está conectado al servidor
        </v-alert>
        <v-overlay z-index="2000" :value="loader">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <GettingHost
          v-if="getting_host"
          :open="getting_host"
          :handleClose="closeGettingHost"
          :error="errorLookingServer"
          :onRetry="lookForServer"
        />
      </div>
    </v-app>
  </div>
</template>

<script>
import { SideNavigator } from "./components/navigator";
import { setStore, setMainOptions, connectToSocket, socket } from "./api";
import { mapGetters, mapState } from "vuex";
import config from "./config";
import Api from "./service/api";
import {
  MultipleOptions,
  ConnectLine,
  GettingHost,
  ErrorMessage,
  RechargeCard,
} from "./components/modals";

export default {
  name: "retry3",
  components: {
    SideNavigator,
    MultipleOptions,
    ConnectLine,
    GettingHost,
    ErrorMessage,
    RechargeCard,
  },
  data() {
    return {
      visible: false,
      cardId: null,
      workerAction: null,
      lineDialog: false,
      message: "",
      errorLookingServer: false,
      getting_host: true,
      rechargeDialog: false,
      showError: false,
      errorLoad: true,
      loader: false,
      options: [
        {
          icon: "$searchUser",
          name: "Buscar Usuario",
          action: this.navigateWorker,
          color: "cyanGradient",
        },
        {
          icon: "mdi-card-plus",
          name: "Recargar Tarjeta",
          action: this.showRechargeCard,
          color: "cyanGradient",
        },

        {
          icon: "$connectBeer",
          name: "Conectar Linea",
          action: this.showConnectLine,
          color: "yellowgradient",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("Session", ["getWorkerByCardId"]),
    ...mapState("Session", ["connectionStatus"]),
  },
  methods: {
    showQuickActions(msg) {
      this.cardId = msg;
    },
    showOptions(value) {
      this.visible = value;
    },
    showRechargeCard(value) {
      if (!value) {
        this.rechargeDialog = false;
        this.showOptions(false);
        return;
      }
      this.getUser();
    },
    closeGettingHost() {
      this.getting_host = false;
      this.errorLookingServer = false;
    },
    async getUser() {
      const { cardId } = this;
      this.loader = true;
      try {
        let response = await Api("http://192.168.1.79:3000").post("/get-user", {
          cardId,
        });

        // Si la respuesta HTTP no es 200, lanzamos un error
        if (response.status !== 200) {
          throw new Error("Error en la conexión: Código " + response.status);
        }

        if (response.data.confirmation === "success") {
          this.workerAction = response.data.data;
          this.rechargeDialog = true;
        } else {
          // El servidor respondió pero no encontró el usuario
          this.message = "No se encontró el usuario";
          this.showError = true;
          this.errorLoad = false;
        }
      } catch (error) {
        console.error("Error en la petición:", error);
        // Diferencia el error de red del error de respuesta
        this.message = "No hay conexión con el servidor";
        // if (error.code === "ERR_NETWORK") {
        // } else {
        //   this.message = error.message || "Error desconocido";
        // }
        this.showError = true;
        this.errorLoad = false;
      } finally {
        this.loader = false;
      }
    },
    async lookForServer() {
      this.errorLookingServer = false;
      try {
        let url = await config.BASE_URL();
        this.getting_host = true;
        if (url) {
          this.getting_host = false;
          setStore(this.$store);
          setMainOptions((msg, show) => {
            this.showQuickActions(msg);
            this.showOptions(show);
          });
          this.$store.dispatch("Session/setURL", url);
          connectToSocket();
        }
      } catch (e) {
        this.errorLookingServer = true;
      }
    },
    showConnectLine(value) {
      this.lineDialog = value;
    },
    closeError() {
      this.showError = false;
    },
    navigateWorker: function () {
      this.$router.push({
        name: "worker-details",
        params: { id: this.getWorkerByCardId(this.cardId)._id },
      });
    },
  },
  async mounted() {
    this.lookForServer();
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/components";
// @font-face {
//   font-family: "Lato-reg";
//   src: url("./assets/fonts/Lato/Lato-Regular.ttf");
// }
// @font-face {
//   font-family: "Lato-light";
//   src: url("./assets/fonts/Lato/Lato-Light.ttf");
// }
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.connection-alert {
  position: fixed !important;
  bottom: 0;
  width: 100%;
  margin: 0 !important;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
#app-content {
  display: flex;
  position: relative;
  flex: 1;
  flex-direction: row;
}
.full-screen {
  width: 100%;
}
.app-wrapper {
  padding-left: 76px;
  width: calc(100%);
}
.v-application--wrap {
  flex-direction: row !important;
}
@media (min-width: 1525px) {
  .app-wrapper {
    padding-left: 0px;
    width: calc(100% - 256px);
  }
}
</style>
