<template>
  <v-navigation-drawer
    v-if="this.$route.name != 'login'"
    permanent
    color="#22252a"
    :expand-on-hover="windowWidth < 1525"
    dark
    :absolute="windowWidth < 1525"
    clipped
    height="100vh"
  >
    <v-list nav class="py-0" style="height:100vh;">
      <v-list-item two-line class="pt-8 pl-0 avatar-expanded">
        <v-list-item-avatar class="mt-1 mb-1 mr-1" size="60">
          <v-img contain :src="BASE_URL + '/placeLogo'" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ placeInfo.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ placeInfo.branch }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider color="gray" class="mb-3" />

      <v-list-item
        active-class=""
        v-for="item in items"
        :key="item.title"
        :to="{ name: item.route }"
        class="padding-item"
        link
        dark
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <span class="caption bold ml-4 white--text">Lector</span>
      <v-list nav class="py-0">
        <v-list-item style="padding:0px 5px !important; align-items:end">
          <v-icon
            class="mb-2 ml-2"
            v-text="'mdi-circle-medium'"
            :class="connected ? ' green--text' : ' red--text'"
          />
          <span
            style="padding-top:2px;"
            class="body-2 font-weight-bold white--text"
          >
            {{ connected ? "Conectado" : "Desconectado" }}
          </span>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SideNavigator",
  data() {
    return {
      drawer: true,
      windowWidth: window.innerWidth,
      items: [
        { title: "Home", icon: "mdi-home", route: "dashboard" },
        {
          title: "Trabajadores",
          icon: "mdi-account-hard-hat",
          route: "workers"
        },
        { title: "Barriles", icon: "mdi-keg", route: "barrels" },
        { title: "Ventas", icon: "mdi-credit-card-outline", route: "sales" },
        {
          title: "Inventario",
          icon: "mdi-clipboard-list",
          route: "inventario"
        },
        { title: "Configuración", icon: "mdi-cog", route: "config" },
        {
          title: "Chikilla VIP",
          icon: "mdi-card-account-details-star",
          route: "VIPClients"
        }
      ]
    };
  },
  computed: {
    ...mapState("CardReader", ["connected"]),
    ...mapState("Session", ["placeInfo", "BASE_URL"]),
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/texts";
.v-navigation-drawer {
  min-width: 78px;
  z-index: 2000;
}
.v-list-item {
  padding: 0 16px !important;
}

.avatar-expanded {
  margin-top: 10px;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.v-list--nav {
  padding-left: 11px;
  padding-right: 11px !important;
}
.v-list--nav .v-list-item,
.v-list--nav .v-list-item:before {
  border-radius: 12px !important;
}
</style>

<style>
.v-navigation-drawer__content {
  overflow-y: hidden !important;
}
</style>
