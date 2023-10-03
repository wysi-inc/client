import { settings } from "../env";

class Fina {
  defaults = {
    baseUrl: settings.api_url,
    baseConfig: {},
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

  async send(url = "", body, config, method) {
    let realUrl;
    if (url.split("/")[0].includes(".")) {
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
        ...this.defaults.baseConfig,
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
}

const fina = new Fina();

export default fina;
