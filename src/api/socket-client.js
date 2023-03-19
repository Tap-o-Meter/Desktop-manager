import io from "socket.io-client";
import { store } from "./index";

var socket = "";
// var store = null; io("http://beer-control.local:3000");
function checkConnection() {
  const status_stored = store.state.Session.connectionStatus;
  const real_status = socket.connected;

  if (status_stored && !real_status) store.dispatch("Session/disconnected");
  else if (!status_stored && real_status) store.dispatch("Session/connected");

  setTimeout(checkConnection, 5000);
}

export function connectToSocket() {
  socket = io(store.state.Session.BASE_URL);
  checkConnection();
  socket.on("chat message", msg => {
    console.log("este es el mensaje: " + msg);
  });

  socket.on("Linelist", msg => {
    store.dispatch("Lines/setLines", msg);
    // store.dispatch("Session/setPlaceInfo", msg.placeInfo);
  });

  socket.on("connectedLines", msg => {
    store.dispatch("Lines/setConnectedLines", msg.connectedLines);
  });

  socket.on("lineConnected", msg => {
    console.log("Hay conectado");
    store.dispatch("Lines/connectedLine", msg);
  });
  socket.on("lineDisconnected", msg => {
    console.log("desconecto");
    store.dispatch("Lines/disconnectedLine", msg);
  });

  socket.on("sale-commited", msg => {
    console.warn(msg);
    store.dispatch("Lines/newSale", msg.data);
    store.dispatch("Sales/addSale", msg.doc);
  });

  // socket.on("connect", () => {
  //   store.dispatch("Session/connected");
  // });
  //
  // socket.on("disconnect", () => {
  //   store.dispatch("Session/disconnected");
  // });
}

// export function setSocketStore(context) {
//   store = context;
//   console.log(store);
// }

export default function() {
  if (!socket.connected) socket = io(store.state.Session.BASE_URL);
  return socket;
}
