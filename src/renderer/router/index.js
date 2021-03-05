import Vue from "vue";
import Router from "vue-router";
import {
  Login,
  Dashboard,
  Barrels,
  Workers,
  WorkerDetails,
  Sales,
  Inventario,
  Config,
  LineDetails,
  KegDetails,
  VIPClients,
  ClientDetails
} from "../views";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard
    },
    {
      path: "/barrels",
      name: "barrels",
      component: Barrels
    },
    {
      path: "/line-details/:id",
      name: "line-details",
      component: LineDetails,
      params: true
    },
    {
      path: "/keg-details/:id",
      name: "keg-details",
      component: KegDetails,
      params: true
    },
    {
      path: "/workers",
      name: "workers",
      component: Workers
    },
    {
      path: "/worker-details/:id",
      name: "worker-details",
      component: WorkerDetails,
      params: true
    },
    {
      path: "/sales",
      name: "sales",
      component: Sales
    },
    {
      path: "inventario",
      name: "inventario",
      component: Inventario
    },
    {
      path: "/configuration",
      name: "config",
      component: Config
    },
    {
      path: "/Clients",
      name: "VIPClients",
      component: VIPClients
    },
    {
      path: "/client-details/:id",
      name: "client-details",
      component: ClientDetails,
      params: true
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
