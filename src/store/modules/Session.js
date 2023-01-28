import Api, { SetIp } from "../../service/api";

const state = {
  BASE_URL: "",
  loggedIn: false,
  connectionStatus: false,
  workers: [],
  placeInfo: {
    name: "Chikilla",
    branch: "Taka & Chikilla",
    instagram: "@chikillacraftbeer",
    facebook: "/chikilla.ensenada",
    twitter: ""
  }
};

const mutations = {
  SET_USER(state, user) {
    return (state.loggedIn = user);
  },
  SET_WORKERS(state, response) {
    // console.warn(response);
    return (state.workers = response);
  },
  UPDATE_WORKER(state, workerUpdated) {
    const index = state.workers.findIndex(
      worker => worker._id === workerUpdated._id
    );
    if (index !== -1) state.workers.splice(index, 1, workerUpdated);
  },
  NEW_WORKER(state, newWorker) {
    return state.workers.push(newWorker);
  },
  REMOVE_WORKER(state, workerId) {
    const index = state.workers.findIndex(item => item._id === workerId);
    index === -1 ? null : state.workers.splice(index, 1);
  },
  SET_PLACE_INFO(state, placeInfo) {
    state.placeInfo = placeInfo;
  },
  CONNECTED(state) {
    state.connectionStatus = true;
  },
  DISCONNECTED(state) {
    state.connectionStatus = false;
  },
  SET_URL(state, url) {
    SetIp(url);
    state.BASE_URL = "http://" + url + ":3000";
  }
};

const actions = {
  async logIn({ commit }) {
    //let response = await Api().get("/videos");
    commit("SET_USER", true);
  },
  async getWorkers({ commit }) {
    let response = await Api().get("/getWorkers");
    commit("SET_WORKERS", response.data.data);
  },
  setWorkers({ commit }, workers) {
    commit("SET_WORKERS", workers);
  },
  updateWorker({ commit }, workerUpdated) {
    commit("UPDATE_WORKER", workerUpdated);
  },
  newWorker({ commit }, newWorker) {
    commit("NEW_WORKER", newWorker);
  },
  removeWorker({ commit }, workerId) {
    commit("REMOVE_WORKER", stockId);
  },
  setPlaceInfo({ commit }, placeInfo) {
    commit("SET_PLACE_INFO", placeInfo);
  },
  connected({ commit }) {
    commit("CONNECTED");
  },
  disconnected({ commit }) {
    commit("DISCONNECTED");
  },
  setURL({ commit }, URL) {
    commit("SET_URL", URL);
  }
};

const getters = {
  getWorker: state => workerId => {
    return state.workers.find(worker => {
      if (workerId === worker._id) return worker;
    });
  },
  getWorkerByCardId: state => cardId => {
    return state.workers.find(worker => cardId === worker.cardId);
  },
  getNames: state => {
    return state.workers.map(worker => worker.nombre);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
