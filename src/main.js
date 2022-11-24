import Vue from 'vue'
import axios from "axios";
import App from './App.vue'
import store from './store'
import router from "./router";
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
Vue.http = Vue.prototype.$http = axios;

new Vue({
  components: { App },
  store,
  vuetify,
  router,
  template: "<App/>",
  render: h => h(App)
}).$mount('#app')
