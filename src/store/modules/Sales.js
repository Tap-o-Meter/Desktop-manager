import Api from "../../service/api";

const state = {
  sales: [],
};

const mutations = {
  SET_SALES(state, salesList) {
    return (state.sales = salesList);
  },
  ADD_SALE(state, sale) {
    state.sales.push(sale);
  },
};

const actions = {
  async getSales({ commit }) {
    const date = new Date();
    let response = await Api().get(
      "/sales/" + date.getMonth() + "/" + date.getMonth() + 1
    );
    commit("SET_SALES", response.data.data);
  },
  setSales({ commit }, sales) {
    commit("SET_SALES", sales);
  },
  addSale({ commit }, sale) {
    console.log("tamos aquí");
    commit("ADD_SALE", sale);
  },
};
const getters = {
  getSalesConter: (state) => (workerId) => {
    const categorySales = [
      0, //taster2oz
      0, //taster5oz
      0, //pint8oz
      0, //pint10oz
      0, //pint16oz
      0, //growler32oz
      0, //growler64oz
      0, //growler128oz,
      0, //merma
    ];
    state.sales.forEach((sale) => {
      if (workerId == sale.workerId) {
        if (sale.concept == "PINT") {
          if (sale.qty === ".236") categorySales[2]++;
          else if (sale.qty === ".296") categorySales[3]++;
          else if (sale.qty === ".473") categorySales[4]++;
        }
        if (sale.concept == "TASTER") {
          if (sale.qty === ".06") categorySales[0]++;
          else if (sale.qty === ".142") categorySales[1]++;
        }
        if (sale.concept == "GROWLER") {
          if (sale.qty === "1") categorySales[5]++;
          else if (sale.qty === "2") categorySales[6]++;
          else if (sale.qty === "4") categorySales[7]++;
        }
        if (sale.concept == "MERMA") {
          categorySales[8] += parseFloat(sale.qty);
        }
      }
    });

    return {
      pints: [categorySales[2], categorySales[3], categorySales[4]],
      tasters: [categorySales[0], categorySales[1]],
      growlers: [categorySales[5], categorySales[6], categorySales[7]],
      merma: [`${categorySales[8].toFixed(2)} Lts.`],
    };
  },
  getLineSales: (state) => (idKeg) => {
    return state.sales.filter((sale) => sale.kegId === idKeg);
  },
  getSalesByWorker: (state) => (workers) => {
    var salesByWorker = [];
    workers.forEach((worker, i) => {
      var qtyByWorker = 0.0;
      state.sales.find((sale) => {
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
  getMermaFromWorker: (state) => (worker) => {
    var mermaWorker = 0.0;
    state.sales.find((sale) => {
      if (sale.workerId == worker._id && sale.concept == "MERMA") {
        mermaWorker += parseFloat(sale.qty);
      }
    });
    return mermaWorker - Math.floor(mermaWorker) !== 0
      ? mermaWorker.toFixed(2)
      : mermaWorker;
  },
  getDumpByLines: (state) => (lines) => {
    var dumpByLine = [];
    lines.forEach((line, i) => {
      if (line.idKeg.length > 0) {
        var qtyByLine = 0.0;
        state.sales.find((sale) => {
          if (sale.kegId == line.idKeg && sale.concept == "MERMA")
            qtyByLine += parseFloat(sale.qty);
        });
        dumpByLine.push(qtyByLine);
      }
    });
    return dumpByLine;
  },
  getCounterByLines: (state) => (lines) => {
    var lineCount = [];
    lines.map((line) => {
      var growlers = 0;
      var tasters = 0;
      var pints = 0;
      state.sales.find((sale) => {
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
        idKeg: line.idKeg,
        beer: line.beerId,
        count: { growlers, pints, tasters },
      });
    });
    return lineCount;
  },
  getCounterAllSales: (state) => {
    const categorySales = [
      0, //taster2oz
      0, //taster5oz
      0, //pint8oz
      0, //pint10oz
      0, //pint16oz
      0, //growler32oz
      0, //growler64oz
      0, //growler128oz
      0, //merma
    ];
    state.sales.forEach((sale) => {
      if (sale.concept == "PINT") {
        if (sale.qty === ".236") categorySales[2]++;
        else if (sale.qty === ".296") categorySales[3]++;
        else if (sale.qty === ".473") categorySales[4]++;
      }
      if (sale.concept == "TASTER") {
        if (sale.qty === ".06") categorySales[0]++;
        else if (sale.qty === ".142") categorySales[1]++;
      }
      if (sale.concept == "GROWLER") {
        if (sale.qty === "1") categorySales[5]++;
        else if (sale.qty === "2") categorySales[6]++;
        else if (sale.qty === "4") categorySales[7]++;
      }
      if (sale.concept == "MERMA") {
        categorySales[8] += parseFloat(sale.qty);
      }
    });
    return {
      pints: [categorySales[2], categorySales[3], categorySales[4]],
      tasters: [categorySales[0], categorySales[1]],
      growlers: [categorySales[5], categorySales[6], categorySales[7]],
      merma: [`${categorySales[8].toFixed(2)} Lts.`],
    };
  },
  getFullCounterByLine: (state) => (line) => {
    var lineCount = {};
    const categorySales = [
      0, //taster2oz
      0, //taster5oz
      0, //pint8oz
      0, //pint10oz
      0, //pint16oz
      0, //growler32oz
      0, //growler64oz
      0, //growler128oz
      0, //merma
    ];
    state.sales.find((sale) => {
      if (sale.kegId === line.idKeg) {
        if (sale.concept == "PINT") {
          if (sale.qty === ".236") categorySales[2]++;
          else if (sale.qty === ".296") categorySales[3]++;
          else if (sale.qty === ".473") categorySales[4]++;
        }
        if (sale.concept == "TASTER") {
          if (sale.qty === ".06") categorySales[0]++;
          else if (sale.qty === ".142") categorySales[1]++;
        }
        if (sale.concept == "GROWLER") {
          if (sale.qty === "1") categorySales[5]++;
          else if (sale.qty === "2") categorySales[6]++;
          else if (sale.qty === "4") categorySales[7]++;
        }
        if (sale.concept == "MERMA") {
          categorySales[8] += parseFloat(sale.qty);
        }
      }
    });
    lineCount = {
      id: line._id,
      noLinea: line.noLinea,
      beer: line.beerId,
      count: [
        [
          categorySales[2], //pint8oz
          categorySales[3], //pint10oz
          categorySales[4], //pint16oz
        ],
        [
          categorySales[0], //taster2oz
          categorySales[1], //taster5oz
        ],
        [
          categorySales[5], //growler32oz
          categorySales[6], //growler64oz
          categorySales[7], //growler128oz
        ],
        [`${categorySales[8].toFixed(2)} Lts.`],
      ],
    };

    return lineCount;
  },
  getTotalMerma: (state) => {
    var total_merma = 0;
    state.sales.forEach((sale) => {
      if (sale.concept == "MERMA") {
        total_merma += parseFloat(sale.qty);
      }
    });
    return total_merma.toFixed(2);
  },
  getTotaSales: (state) => {
    var total_sold = 0;
    state.sales.forEach((sale) => {
      if (sale.concept == "PINT") total_sold += parseFloat(sale.qty);
      if (sale.concept == "TASTER") total_sold += parseFloat(sale.qty);
      if (sale.concept == "GROWLER") total_sold += parseFloat(sale.qty);
    });
    return total_sold.toFixed(2);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
