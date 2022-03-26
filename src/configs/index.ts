import axios from "axios";

const configs = {
  url: "http://localhost:4003",
};

const api = axios.create({
  baseURL: configs.url,
});

export { configs, api };
