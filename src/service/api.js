import axios from "axios";

var realIp = "";
export function SetIp(ip) {
  realIp = ip;
}

export const multipartHeaders = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export default () => {
  // const baseURL = "http://192.168.1.175" + ":3000";
  // const baseURL = "https://127.0.0.1" + ":3000";
  const baseURL = "http://" + realIp + ":3000";
  return axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
