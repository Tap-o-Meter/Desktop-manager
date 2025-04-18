import Vue from "vue";
import Router from "vue-router";
import {
  Login,
  Sales,
  Config,
  Barrels,
  Workers,
  Dashboard,
  Inventario,
  KegDetails,
  VIPClients,
  LineDetails,
  ExpandedList,
  WorkerDetails,
  ClientDetails,
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
      component: Barrels,
      params: true
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
      path: "/worker-details/:worker",
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
      path: "/list-details",
      name: "list-details",
      component: ExpandedList,
      params: true
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