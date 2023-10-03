import { settings } from "../env";

class Fina {
  defaults = {
    baseUrl: settings.api_url,
    baseConfig: {},
    token: ""
  };


  constructor() {
    this.defaults.baseConfig = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
  }

  configure(baseUrl) {
    this.defaults.baseUrl = baseUrl;
  }

  baseConfig(token = "") {
    return {
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
      credentials: "include",
    };
  }

  async send(url = "", body, config, method, token = "") {
    let realUrl;
    if (url.split("/")[0].includes(".") || url.split("/")[0].includes("http")) {
      realUrl = url;
    } else {
      realUrl = `${this.defaults.baseUrl}${
        url.charAt(0) === "/" ? url : "/" + url
      }`;
    }

    if (config) {
      return await fetch(realUrl, {
        method: method,
        ...config,
        body: JSON.stringify(body || {}),
      });
    }

    if (body) {
      return await fetch(realUrl, {
        method: method,
        ...baseConfig(token),
        body: JSON.stringify(body),
      });
    }

    return await fetch(realUrl, {
      method: method,
      credentials: "include",
    });
  }

  async post(url, body, config) {
    return await (await this.send(url, body, config, "POST")).json();
  }
  async get(url, body, config) {
    return await (await this.send(url, body, config, "GET")).json();
  }
  async put(url, body, config) {
    return await (await this.send(url, body, config, "PUT")).json();
  }
  async delete(url, body, config) {
    return await (await this.send(url, body, config, "DELETE")).json();
  }

  async spost(url, body, config) {
    return await (await this.send(url, body, config, "POST", this.defaults.token)).json();
  }
  async sget(url, body, config) {
    return await (await this.send(url, body, config, "GET", this.defaults.token)).json();
  }
  async sput(url, body, config) {
    return await (await this.send(url, body, config, "PUT", this.defaults.token)).json();
  }
  async sdelete(url, body, config) {
    return await (await this.send(url, body, config, "DELETE", this.defaults.token)).json();
  }
}

const fina = new Fina();

export default fina;
