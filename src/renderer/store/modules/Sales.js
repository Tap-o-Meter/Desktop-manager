import Api from "../../service/api";

const state = {
  sales: []
};

const mutations = {
  SET_SALES(state, salesList) {
    return (state.sales = salesList);
  },
  ADD_SALE(state, sale) {
    state.sales.push(sale);
  }
};

const actions = {
  async getSales({ commit }) {
    const date = new Date();
    let response = await Api().get(
      "/sales/" + date.getMonth() + "/" + date.getMonth() + 1
    );
    commit("SET_SALES", response.data.data);
  },
  addSale({ commit }, sale) {
    console.log("tamos aquí");
    commit("ADD_SALE", sale);
  }
};
const getters = {
  getSalesConter: state => workerId => {
    var growlers = 0;
    var tasters = 0;
    var pints = 0;
    state.sales.find(sale => {
      if (sale.workerId === workerId) {
        switch (sale.concept) {
          case "GROWLER":
            growlers++;
            break;
          case "PINT":
            pints++;
            break;
          case "TASTER":
            tasters++;
            break;
        }
      }
    });
    return { growlers, tasters, pints };
  },
  getLineSales: state => idKeg => {
    return state.sales.filter(sale => sale.kegId === idKeg);
  },

  getSalesByWorker: state => workers => {
    var salesByWorker = [];
    workers.forEach((worker, i) => {
      var qtyByWorker = 0.0;
      state.sales.find(sale => {
        if (sale.workerId == worker._id && sale.concept != "MERMA") {
          // if (i === 2) console.log(parseFloat(sale.qty));
          qtyByWorker += parseFloat(sale.qty);
        }
      });

      salesByWorker.push(
        qtyByWorker - Math.floor(qtyByWorker) !== 0
          ? qtyByWorker.toFixed(2)
          : qtyByWorker
      );
    });
    return salesByWorker;
  },
  getMermaFromWorker: state => worker => {
    var mermaWorker = 0.0;
    state.sales.find(sale => {
      if (sale.workerId == worker._id && sale.concept == "MERMA") {
        mermaWorker += parseFloat(sale.qty);
      }
    });
    return mermaWorker - Math.floor(mermaWorker) !== 0
      ? mermaWorker.toFixed(2)
      : mermaWorker;
  },
  getDumpByLines: state => lines => {
    var dumpByLine = [];
    lines.forEach((line, i) => {
      if (line.idKeg.length > 0) {
        var qtyByLine = 0.0;
        state.sales.find(sale => {
          if (sale.kegId == line.idKeg && sale.concept == "MERMA")
            qtyByLine += parseFloat(sale.qty);
        });
        dumpByLine.push(qtyByLine);
      }
    });
    return dumpByLine;
  },
  getCounterByLines: state => lines => {
    var lineCount = [];
    lines.map(line => {
      var growlers = 0;
      var tasters = 0;
      var pints = 0;
      state.sales.find(sale => {
        if (sale.kegId === line.idKeg) {
          switch (sale.concept) {
            case "GROWLER":
              growlers++;
              break;
            case "PINT":
              pints++;
              break;
            case "TASTER":
              tasters++;
              break;
          }
        }
      });
      lineCount.push({
        id: line._id,
        noLinea: line.noLinea,
        beer: line.beerId,
        count: { growlers, pints, tasters }
      });
    });
    return lineCount;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
