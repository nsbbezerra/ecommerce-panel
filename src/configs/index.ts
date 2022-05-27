import axios from "axios";

const configs = {
  url: "http://localhost:4003",
  pagination: 10,
  defaultIcon: { icon: "AiFillTag", title: "Padrão", category: "default" },
};

const api = axios.create({
  baseURL: configs.url,
});

export { configs, api };
