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
          :fistLoad="errorLoad"
        />
        <RechargeCard
          :worker="workerAction"
          :open="rechargeDialog"
          :handleClose="showRechargeCard"
        />
        <LineList
          :worker="workerAction"
          :open="cliamBeer"
          :handleClose="showClaimBeer"
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
  RechargeCard,
  LineList,
  closeModal,
  ErrorMessage,
} from "./components/modals";
export default {
  name: "retry3",
  components: {
    SideNavigator,
    MultipleOptions,
    ConnectLine,
    RechargeCard,
    LineList,
    ErrorMessage,
  },
  data() {
    return {
      visible: false,
      cardId: "24 63 0A 2B",
      cliamBeer: false,
      lineDialog: false,
      rechargeDialog: false,
      showError: false,
      message: "",
      options: [
        {
          icon: "$searchUser",
          name: "Buscar Usuario",
          action: this.navigateWorker,
          color: "redGradient",
        },
        {
          icon: "mdi-card-plus",
          name: "Recargar Tarjeta",
          action: this.showRechargeCard,
          color: "cyanGradient",
        },
        {
          icon: "mdi-currency-usd",
          name: "Realizar compra",
          action: this.showClaimBeer,
          color: "yellowgradient",
        },
        // {
        //   icon: "$connectBeer",
        //   name: "Conectar Linea",
        //   action: this.showConnectLine,
        //   color: "yellowgradient"
        // }
      ],
      workerAction: {
        _id: "222222",
        nombre: "Karen",
        apellidos: "Lastra",
        beers: { beers: 3, tasters: 1, flight: 5 },
      },
      errorLoad: true,
    };
  },
  computed: {
    ...mapGetters("Session", ["getWorkerByCardId"]),
    ...mapState("Session", ["connectionStatus"]),
  },
  methods: {
    showQuickActions(msg) {
      this.cardId = msg;
      this.getUser();
    },
    showOptions(value) {
      this.visible = value;
    },
    showConnectLine(value) {
      this.lineDialog = value;
      if (!value) this.showOptions(false);
    },
    showRechargeCard(value) {
      this.rechargeDialog = value;
      if (!value) this.showOptions(false);
    },
    showClaimBeer(value) {
      this.cliamBeer = value;
      if (!value) this.showOptions(false);
    },
    navigateWorker() {
      this.$router.push({
        name: "worker-details",
        params: { worker: this.getWorkerByCardId(this.cardId) },
      });
    },
    async getUser() {
      const { cardId } = this;
      this.loader = true;
      let response = await Api().post("/getWorker", { cardId });
      this.loader = false;
      if (response.data.confirmation === "success") {
        console.log(response.data.data);
        this.workerAction = response.data.data;
        this.showOptions(true);
      } else {
        console.log("cardId:");
        console.log({ cardId });
        console.log(response.data);
        this.message = response.data.msg;
        this.showError = true;
      }
    },
    closeError() {
      this.showError = false;
    },
  },
  async mounted() {
    setStore(this.$store);
    setMainOptions((msg, show) => {
      this.showQuickActions(msg);
      // this.showOptions(show);
    });
    let url = await config.BASE_URL();
    this.$store.dispatch("Session/setURL", url);
    connectToSocket();
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
      this.errorLoad = false;
    }, 200);
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/components";
@font-face {
  font-family: "Lato-reg";
  src: url("./assets/fonts/Lato/Lato-Regular.ttf");
}
@font-face {
  font-family: "Lato-light";
  src: url("./assets/fonts/Lato/Lato-Light.ttf");
}
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
