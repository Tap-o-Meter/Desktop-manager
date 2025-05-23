const state = {
  lines: [],
  kegs: [],
  beers: [],
  connectedLines: [],
  emergencyCard: "",
};

const mutations = {
  // ON_READER_CONNECT(state, port) {
  //   state.connected = true;
  //   state.portName = port;
  // },
  ON_CONNECT_LINE(state, socketLine) {
    //console.log(socketLine);
    let index = state.connectedLines.findIndex(
      (device) => device.id === socketLine.id
    );
    index === -1
      ? state.connectedLines.push(socketLine)
      : (state.connectedLines[index] = socketLine);
  },

  ON_DISCONNECT_LINE(state, socketLine) {
    const index = state.connectedLines.findIndex(
      (item) => item.socket === socketLine.socket
    );
    index === -1 ? null : state.connectedLines.splice(index, 1);
  },

  DISABLE_LINE(state, lineToChage) {
    state.kegs.find((keg) => {
      if (keg._id === lineToChage.idKeg) keg.status = "DISCONNECTED";
    });
    state.lines.find((line) => {
      if (line.noLinea === lineToChage.noLinea) {
        console.log(line);
        line.idKeg = "";
      }
    });
  },

  SET_ALL_LINES(state, socketLines) {
    //console.log(socketLines);
    // state.connectedLines = socketLines.connectedLines;
    state.kegs = socketLines.data;
    state.lines = socketLines.lines;
    state.lines.sort((a, b) => a.noLinea - b.noLinea);
    state.beers = socketLines.beers;
    state.emergencyCard = socketLines.emergencyCard.cardId;
  },

  SET_CONNECTED_LINES(state, connectedLines) {
    // console.log("está en connected lines");
    console.warn(connectedLines);
    state.connectedLines = connectedLines;
  },

  REPLACE_LINE(state, newLine) {
    const index = state.lines.findIndex(
      (line) => line._id === newLine.data._id
    );
    const oldKeg = state.lines[index].idKeg;
    if (index !== -1) state.lines.splice(index, 1, newLine.data);
    state.kegs.some((keg) => {
      if (keg._id === newLine.data.idKeg) {
        keg.status = "CONNECTED";
        return true;
      }
    });
    state.kegs.some((keg) => {
      if (keg._id === oldKeg) {
        keg.status = newLine.newStatus;
        return true;
      }
    });
  },

  ADD_KEG(state, newKeg) {
    const noKegs = newKeg.cant;
    for (var i = 0; i < noKegs; i++) {
      state.kegs.push(newKeg);
    }
  },

  REMOVE_KEG(state, kegId) {
    console.warn(kegId);
    const index = state.kegs.findIndex((item) => item._id == kegId);
    if (index !== -1) state.kegs.splice(index, 1);
  },

  ADD_BEER(state, newBeer) {
    state.beers.push(newBeer);
  },

  EDIT_BEER(state, newBeer) {
    const index = state.beers.findIndex((beer) => beer._id === newBeer._id);
    if (index !== -1) state.beers.splice(index, 1, newBeer);
  },

  ADD_SALE(state, sale) {
    const index = state.kegs.findIndex((keg) => keg._id === sale.kegId);
    if (index !== -1) state.kegs.splice(index, 1, sale);
  },
};

const actions = {
  // onConnect({ commit }, port) {
  //   console.log("aquí llegó con " + port);
  //   commit("ON_READER_CONNECT", port);
  // },
  // onDisconnect({ commit }) {
  //   console.log("aquí desconecto");
  //   commit("ON_READER_DISCONNECT");
  // }
  replaceLine({ commit }, data) {
    commit("REPLACE_LINE", data);
  },
  connectedLine({ commit }, socketLine) {
    commit("ON_CONNECT_LINE", socketLine);
  },
  setConnectedLines({ commit }, connectedLines) {
    commit("SET_CONNECTED_LINES", connectedLines);
  },
  disconnectedLine({ commit }, socketLine) {
    commit("ON_DISCONNECT_LINE", socketLine);
  },
  disableLine({ commit }, line) {
    commit("DISABLE_LINE", line);
  },
  setLines({ commit }, socketLines) {
    //console.log("hay Lineas");
    commit("SET_ALL_LINES", socketLines);
  },
  addKeg({ commit }, keg) {
    commit("ADD_KEG", keg);
  },
  deleteKeg({ commit }, kegId) {
    commit("REMOVE_KEG", kegId);
  },
  addBeer({ commit }, beer) {
    commit("ADD_BEER", beer);
  },
  editBeer({ commit }, beer) {
    commit("EDIT_BEER", beer);
  },
  newSale({ commit }, sale) {
    commit("ADD_SALE", sale);
  },
};

const getters = {
  getStatus: (state) => (line) => {
    return (
      state.connectedLines.findIndex((device) => line._id === device.id) !== -1
    );
  },
  getKeg: (state) => (idKeg) => {
    return state.kegs.find((keg) => idKeg === keg._id);
  },
  getBeer: (state) => (beerId) => {
    return state.beers.find((beer) => beerId === beer._id);
  },
  getLine: (state) => (id) => {
    return state.lines.find((line) => line._id === id);
  },
  getBeerKegs: (state) => (beerId) => {
    return state.kegs.filter(
      (keg) => keg.beerId === beerId && keg.status !== "CONNECTED"
    );
  },
  getKegCount: (state) => (beerId) => {
    return state.kegs.filter(
      (keg) => keg.beerId === beerId && keg.status !== "CONNECTED"
    ).length;
  },
  getCriticalKegs: (state) => {
    return state.kegs.filter(
      (keg) => keg.available <= 4 && keg.status === "CONNECTED"
    );
  },
  getQtyByLine: (state) => {
    const qtyLines = [];
    state.lines.map((line) =>
      state.kegs.find((keg) => {
        if (line.idKeg === keg._id) {
          qtyLines.push((keg.capacity - keg.available).toFixed(2));
          return;
        }
      })
    );
    return qtyLines;
  },
  getLineNames: (state) => {
    var names = [];
    var beerIds = [];
    const kegsIds = state.lines.map((line) => line.idKeg);
    kegsIds.forEach((idKeg, i) => {
      state.kegs.find((keg) => {
        if (idKeg === keg._id) beerIds.push(keg.beerId);
      });
    });
    beerIds.forEach((beerId, i) => {
      state.beers.find((beer) => {
        if (beerId === beer._id) names.push(beer.name);
      });
    });
    return names;
  },
  getLineByName: (state) => (noLinea) => {
    const line = state.lines.find((line) => line.noLinea === noLinea);
    const keg = state.kegs.find((keg) => line.idKeg === keg._id);
    const beer = state.beers.find((beer) => keg.beerId === beer._id);
    return beer.name;
  },
  getKegName: (state) => (idKeg) => {
    let beerId;
    let beer_name;
    state.kegs.find((keg) => {
      if (idKeg === keg._id) beerId = keg.beerId;
    });

    state.beers.find((beer) => {
      if (beerId === beer._id) beer_name = beer.name;
    });
    return beer_name;
  },
  getLineHistory: (state) => (noLinea) =>
    state.kegs.filter((keg) =>
      keg.hasOwnProperty("lastLine")
        ? keg.lastLine.noLinea != noLinea
          ? false
          : true
        : false
    ),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
