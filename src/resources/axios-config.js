import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.wysi727.com/",
  /*env.ENVIRONMENT === "dev"
      ? "http://localhost:5000"
      : "https://api.wysi727.com/",*/
});

instance.defaults.withCredentials = true;

export default instance;
