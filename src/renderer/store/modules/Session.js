import Api from "../../service/api";

const state = {
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
  SET_PLACE_INFO(state, placeInfo) {
    state.placeInfo = placeInfo;
  },
  CONNECTED(state) {
    state.connectionStatus = true;
  },
  DISCONNECTED(state) {
    state.connectionStatus = false;
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
  updateWorker({ commit }, workerUpdated) {
    commit("UPDATE_WORKER", workerUpdated);
  },
  newWorker({ commit }, newWorker) {
    commit("NEW_WORKER", newWorker);
  },
  setPlaceInfo({ commit }, placeInfo) {
    commit("SET_PLACE_INFO", placeInfo);
  },
  connected({ commit }) {
    commit("CONNECTED");
  },
  disconnected({ commit }) {
    commit("DISCONNECTED");
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
