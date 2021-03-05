import io from "socket.io-client";
import { store } from "./index";
const socket = io("http://beer-control.local:3000");
// var store = null;

socket.on("chat message", msg => {
  console.log("este es el mensaje: " + msg);
});

socket.on("Linelist", msg => {
  console.log("hay Lista");
  store.dispatch("Lines/setLines", msg);
  store.dispatch("Session/setPlaceInfo", msg.placeInfo);
});

socket.on("lineConnected", msg => {
  console.log("Hay conectado");
  store.dispatch("Lines/connectedLine", msg);
});
socket.on("lineDisconnected", msg => {
  console.log("desconecto");
  store.dispatch("Lines/disconnectedLine", msg);
});

socket.on("connect", () => {
  store.dispatch("Session/connected");
});

socket.on("disconnect", () => {
  store.dispatch("Session/disconnected");
});

// export function setSocketStore(context) {
//   store = context;
//   console.log(store);
// }

export default socket;
