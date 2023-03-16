import dns from "dns";
export default {
  BASE_URL: async function() {
    return "127.0.0.1";
    return new Promise((resolve, reject) => {
      dns.lookup("beer-control.local", (err, address, family) => {
        if (err) reject(err);
        resolve(address);
      });
    });
  },
  animations: {
    nfc: require("../assets/lottie/nfc.json"),
    connect: require("../assets/lottie/connect-device.json"),
    check: require("../assets/lottie/green-check.json"),
    hostLoad: require("../assets/lottie/connecting-server.json"),
    error: require("../assets/lottie/error2.json")
  },
  days: {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miércoles: 3,
    jueves: 4,
    viernes: 5,
    sábado: 6
  },
  keg_sizes:[
    {
      name:"Cornelius",
      qty_gal:5,
      qty_lts:18
    },
    {
      name:"Torpedo",
      qty_gal:5.16,
      qty_lts:20
    },
    {
      name:"Pony",
      qty_gal:7.75,
      qty_lts:30
    },
    {
      name:"European Keg",
      qty_gal:13.2,
      qty_lts:50
    },
    {
      name:"Half barrel",
      qty_gal:15.5,
      qty_lts:60
    }
  ],
  months: [
    { name: "Enero", value: 0 },
    { name: "Febrero", value: 1 },
    { name: "Marzo", value: 2 },
    { name: "Abril", value: 3 },
    { name: "Mayo", value: 4 },
    { name: "Junio", value: 5 },
    { name: "Julio", value: 6 },
    { name: "Agosto", value: 7 },
    { name: "Septiembre", value: 8 },
    { name: "Octubre", value: 9 },
    { name: "Noviembre", value: 10 },
    { name: "Diciembre", value: 11 }
  ],
  currentMonth: function() {
    const d = new Date();
    return this.months[d.getMonth()];
  },
  ToString: function(date) {
    var time = new Date(date);
    return (
      time.getFullYear() +
      "-" +
      this.twoDigits(time.getMonth() + 1) +
      "-" +
      this.twoDigits(time.getDate()) +
      " " +
      time.getHours() +
      ":" +
      this.twoDigits(time.getMinutes())
    );
  },
  parseDate: function(date) {
    var time = new Date(date);
    return (
      this.twoDigits(time.getDate()) +
      "/" +
      this.twoDigits(time.getMonth()) +
      "/" +
      time.getFullYear() +
      " - " +
      time.getHours() +
      ":" +
      this.twoDigits(time.getMinutes()) +
      ":" +
      this.twoDigits(time.getSeconds())
    );
  },
  parseHalfDate: function(date) {
    var time = new Date(date);
    return (
      this.twoDigits(time.getDate()) +
      "/" +
      this.twoDigits(time.getMonth() + 1) +
      "/" +
      time.getFullYear()
    );
  },
  twoDigits: function(value) {
    return value < 10 ? "0" + value : value;
  },
  getColorLevel: function(level) {
    switch (level) {
      case 1:
        return "red";
      case 2:
        return "#FDD835";
      case 3:
        return "#757575";
      case 4:
        return "black";
    }
  },
  getSrm: function(srmIndex) {
    if (srmIndex > this.srmList.length)
      return { color: "#" + srmIndex.toString(16), srm: "N/A" };
    else return this.srmList[srmIndex - 1];
  },
  srmList: [
    { color: "#FFE699", srm: "1" },
    { color: "#FFD878", srm: "2" },
    { color: "#FFCA5A", srm: "3" },
    { color: "#FFBF42", srm: "4" },
    { color: "#FBB123", srm: "5" },
    { color: "#F8A600", srm: "6" },
    { color: "#F39C00", srm: "7" },
    { color: "#EA8F00", srm: "8" },
    { color: "#E58500", srm: "9" },
    { color: "#DE7C00", srm: "10" },
    { color: "#D77200", srm: "11" },
    { color: "#CF6900", srm: "12" },
    { color: "#CB6200", srm: "13" },
    { color: "#C35900", srm: "14" },
    { color: "#BB5100", srm: "15" },
    { color: "#B54C00", srm: "16" },
    { color: "#B04500", srm: "17" },
    { color: "#A63E00", srm: "18" },
    { color: "#A13700", srm: "19" },
    { color: "#9B3200", srm: "20" },
    { color: "#952D00", srm: "21" },
    { color: "#8E2900", srm: "22" },
    { color: "#882300", srm: "23" },
    { color: "#821E00", srm: "24" },
    { color: "#7B1A00", srm: "25" },
    { color: "#771900", srm: "26" },
    { color: "#701400", srm: "27" },
    { color: "#6A0E00", srm: "28" },
    { color: "#660D00", srm: "29" },
    { color: "#5E0B00", srm: "30" },
    { color: "#5A0A02", srm: "31" },
    { color: "#600903", srm: "32" },
    { color: "#520907", srm: "33" },
    { color: "#4C0505", srm: "34" },
    { color: "#470606", srm: "35" },
    { color: "#440607", srm: "36" },
    { color: "#3F0708", srm: "37" },
    { color: "#3B0607", srm: "38" },
    { color: "#3A070B", srm: "39" },
    { color: "#36080A", srm: "40" }
  ],
  cardLevels: ["Bebedor Social", "Mi Hobby", "El Alcohólico", "El Chikilla"]
};
