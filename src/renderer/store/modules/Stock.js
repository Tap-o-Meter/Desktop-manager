import Api from "../../service/api";
const state = {
  stock: []
};

const mutations = {
  SET_STOCK(state, stockList) {
    state.stock = stockList;
  },
  ON_NEW_STOCK(state, item) {
    state.stock.push(item);
  },
  ON_TAKE_STOCK(state, items) {
    items.forEach(item => {
      state.stock.find(stockToSubtract => {
        if (item._id === stockToSubtract.id) {
          stockToSubtract.volume = stockToSubtract.volume - item.value;
        }
      });
    });
    console.warn(state.stock);
  },
  ON_REFILL_STOCK(state, items) {
    items.forEach(item => {
      state.stock.find(stockToSubtract => {
        if (item._id === stockToSubtract.id) {
          stockToSubtract.volume =
            stockToSubtract.volume + parseInt(item.value);
        }
      });
    });
  },
  REMOVE_STOCK(state, stockId) {
    const index = state.stock.findIndex(item => item._id === stockId);
    index === -1 ? null : state.stock.splice(index, 1);
  }
};

const actions = {
  async getStock({ commit }) {
    let response = await Api().get("/getStock");
    commit("SET_STOCK", response.data.data);
  },
  addStock({ commit }, stock) {
    commit("ON_NEW_STOCK", stock);
  },
  takeStock({ commit }, socketLine) {
    commit("ON_TAKE_STOCK", socketLine);
  },
  refillStock({ commit }, socketLine) {
    commit("ON_REFILL_STOCK", socketLine);
  },
  removeStock({ commit }, stockId) {
    commit("REMOVE_STOCK", stockId);
  }
};

const getters = {
  getNames: state => {
    let names = [];
    state.stock.forEach(item => {
      names.push(item.name);
    });
    return names;
  },
  getBrands: state => {
    let brands = [];
    state.stock.forEach(item => {
      brands.push(item.brand);
    });
    return brands;
  },
  getItem: state => itemId => {
    return state.stock.find(item => item._id === itemId);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
