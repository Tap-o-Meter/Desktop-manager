const state = {
  connected: false,
  portName: ""
};

const mutations = {
  ON_READER_CONNECT(state, port) {
    state.connected = true;
    state.portName = port;
  },
  ON_READER_DISCONNECT(state) {
    state.connected = false;
  }
};

const actions = {
  onConnect({ commit }, port) {
    console.log("aquí llegó con " + port);
    commit("ON_READER_CONNECT", port);
  },
  onDisconnect({ commit }) {
    console.log("aquí desconecto");
    commit("ON_READER_DISCONNECT");
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
