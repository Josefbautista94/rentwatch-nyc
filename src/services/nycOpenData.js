import axios from "axios";

const sodan = axios.create({
  baseURL: "https://data.cityofnewyork.us/resource",
  timeout: 15000,
  headers: { Accept: "application/json" },
});

const token = import.meta.env.VITE_NYC_APP_TOKEN;
if (token) {
  sodan.defaults.headers.common["X-App-Token"] = token;
}

export default sodan;