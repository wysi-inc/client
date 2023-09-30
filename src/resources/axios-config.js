import axios from "axios";
import env from "react-dotenv";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  /*env.ENVIRONMENT === "dev"
      ? "http://localhost:5000"
      : "https://api.wysi727.com/",*/
});

instance.defaults.withCredentials = true;

export default instance;
