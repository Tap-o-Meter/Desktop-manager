import socket from "./socket-client";
import {
  portList,
  connectPort,
  suscribe,
  unsuscribe,
  setMainOptions
} from "./serial-client";

var store = null;

export function setStore(context) {
  store = context;
}

export {
  portList,
  connectPort,
  suscribe,
  unsuscribe,
  store,
  socket,
  setMainOptions
};
