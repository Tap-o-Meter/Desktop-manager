import axios from "axios";
const baseURL = "http://beer-control.local:3000";
export { baseURL };

export default () => {
  return axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};
