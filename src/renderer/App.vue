<template>
  <div id="app">
    <v-app id="app-content">
      <SideNavigator />

      <div :class="this.$route.name != 'login' ? 'app-wrapper' : 'full-screen'">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
        <ConnectLine :open="lineDialog" :handleClose="showConnectLine" />
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
import { setStore, setMainOptions } from "./api";
import { mapGetters, mapState } from "vuex";
import { MultipleOptions, ConnectLine } from "./components/modals";
export default {
  name: "retry3",
  components: { SideNavigator, MultipleOptions, ConnectLine },
  data() {
    return {
      visible: false,
      cardId: null,
      lineDialog: false,
      options: [
        {
          icon: "$searchUser",
          name: "Buscar Usuario",
          action: this.navigateWorker,
          color: "cyanGradient"
        },
        {
          icon: "$connectBeer",
          name: "Conectar Linea",
          action: this.showConnectLine,
          color: "yellowgradient"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("Session", ["getWorkerByCardId"]),
    ...mapState("Session", ["connectionStatus"])
  },
  methods: {
    showQuickActions(msg) {
      this.cardId = msg;
    },
    showOptions(value) {
      this.visible = value;
    },
    showConnectLine(value) {
      this.lineDialog = value;
    },
    navigateWorker() {
      this.$router.push({
        name: "worker-details",
        params: { id: this.getWorkerByCardId(this.cardId)._id }
      });
    }
  },
  mounted() {
    setStore(this.$store);
    setMainOptions((msg, show) => {
      this.showQuickActions(msg);
      this.showOptions(show);
    });
  }
};
</script>

<style>
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
