import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import io from "socket.io-client";

var lockerSerialPort = null;
var callbackMap = [];
const SP = SerialPort;
var parser = null;
var mainOptions = null;

export async function portList() {
  const ports = await SerialPort.list();
  return ports || [];
}

export function connectPort(port, store) {
  const portToConnect = port === null ? store.state.CardReader.portName : port;
  if (portToConnect.length < 1) return; 
  lockerSerialPort = null;
  lockerSerialPort = new SP({
    path: port,
    baudRate: 115200,
    autoOpen: false,
    flowControl: false,
    parity: "none",
    stopBits: 1
  });

  lockerSerialPort.write("^");

  parser = lockerSerialPort.pipe(new ReadlineParser({ delimiter: "\n" }));
  lockerSerialPort.open(function(err) {
    if (err) {
      console.log("we are fucked " + err);
      lockerSerialPort = null;
      parser = null;
      store.dispatch("CardReader/onDisconnect");
      return;
    }
    store.dispatch("CardReader/onConnect", portToConnect);

    lockerSerialPort.on("close", () => {
      console.log("dejconectó el hds!!!");
      store.dispatch("CardReader/onDisconnect");
    });

    parser.on("data", data => {
      let decodedData = data.toString("utf8").replace(/(\r\n|\n|\r)/gm, "");
      console.log(decodedData);
      if (callbackMap.length > 0) {
        callbackMap.forEach(element => element(decodedData));
        console.log("suscritos: " + callbackMap.length);
      } else {
        mainOptions(decodedData, true);
      }
    });
  });
}
export function setMainOptions(callback) {
  mainOptions = callback;
}
export function suscribe(callback) {
  callbackMap.push(callback);
}
export function unsuscribe() {
  callbackMap = [];
  console.log("desuscrito: " + callbackMap.length);
}
