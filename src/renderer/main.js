import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueTheMask from "vue-the-mask";

// import { webFrame } from "electron";

// window.addEventListener(
//   "keydown",
//   e => {
//     console.log(e);
//     if (e.key === "Meta") {
//       let currentZoom = webFrame.getZoomFactor();
//       switch (e.key) {
//         case "+":
//           webFrame.setZoomFactor(currentZoom + 0.05);
//           break;
//         case "–" || "-":
//           webFrame.setZoomFactor(currentZoom + 0.05);
//           break;
//         case "0":
//           webFrame.setZoomFactor(1);
//           break;
//         default:
//       }
//     }
//   },
//   true
// );
//

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.use(VueTheMask);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  vuetify,
  router,
  store,
  template: "<App/>"
}).$mount("#app");
