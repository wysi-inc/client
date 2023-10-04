import { settings } from "../env";

class Fina {
  defaults = {
    baseUrl: settings.api_url,
    token: "",
  };

  configs = {
    nconfig: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    config: {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    },
    sconfig: {
      headers: {
        "Content-Type": "application/json",
        "x-token": this.defaults.token,
      },
      credentials: "include"
    }
  }

  getRealUrl(url = "") {
    if (url.split("/")[0].includes(".") || url.split("/")[0].includes("http"))
      return url;
    else return `${this.defaults.baseUrl}${url.charAt(0) === "/" ? url : "/" + url}`;
  }

  async send(url, body = undefined, config, method) {
    const realUrl = this.getRealUrl(url);

    if (config) {
      return await fetch(realUrl, {
        method: method,
        ...config,
        body: JSON.stringify(body || {}),
      });
    }

    if (body !== undefined) {
      return await fetch(realUrl, {
        method: method,
        ...this.configs.config,
        body: JSON.stringify(body),
      });
    }

    return await fetch(realUrl, {
      method: method,
      ...this.configs.config,
    });
  }

  //normal fetch
  async npost(url, body, config = this.configs.nconfig) {
    return await (await this.send(url, body, config, "POST")).json();
  }
  async nget(url, config = this.configs.nconfig) {
    return await (await this.send(url, undefined, config, "GET")).json();
  }
  async nput(url, body, config = this.configs.nconfig) {
    return await (await this.send(url, body, config, "PUT")).json();
  }
  async ndelete(url, body, config = this.configs.nconfig) {
    return await (await this.send(url, body, config, "DELETE")).json();
  }

  //default fetch
  async post(url, body, config = this.configs.config) {
    return await (await this.send(url, body, config, "POST")).json();
  }
  async get(url, config = this.configs.config) {
    return await (await this.send(url, undefined, config, "GET")).json();
  }
  async put(url, body, config = this.configs.config) {
    return await (await this.send(url, body, config, "PUT")).json();
  }
  async delete(url, body, config = this.configs.config) {
    return await (await this.send(url, body, config, "DELETE")).json();
  }

  //secure fetch
  async spost(url, body, config = this.configs.sconfig) {
    return await (await this.send(url, body, config, "POST")).json();
  }
  async sget(url, config = this.configs.sconfig) {
    return await (await this.send(url, undefined, config, "GET")).json();
  }
  async sput(url, body, config = this.configs.sconfig) {
    return await (await this.send(url, body, config, "PUT")).json();
  }
  async sdelete(url, body, config = this.configs.sconfig) {
    return await (await this.send(url, body, config, "DELETE")).json();
  }
}

const fina = new Fina();

export default fina;
