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

  async send(url = "", body, config, method) {
    let realUrl;
    if (url.split("/")[0].includes(".") || url.split("/")[0].includes("http"))
      realUrl = url;
    else
      realUrl = `${this.defaults.baseUrl}${url.charAt(0) === "/" ? url : "/" + url
        }`;

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
        ...this.configs.config,
        body: JSON.stringify(body),
      });
    }

    return await fetch(realUrl, {
      method: method,
      ...this.configs.config,
    });
  }
  async ssend(url, body, config, method) {
    if (config) {
      return await fetch(url, {
        method: method,
        ...config,
        body: JSON.stringify(body || {}),
      });
    }

    if (body) {
      return await fetch(url, {
        method: method,
        ...this.configs.sconfig,
        body: JSON.stringify(body),
      });
    }

    return await fetch(url, {
      method: method,
      ...this.configs.sconfig,
    });
  }
  async nsend(url, body, config, method) {

    if (config) {
      return await fetch(url, {
        method: method,
        ...config,
        body: JSON.stringify(body || {}),
      });
    }

    if (body) {
      return await fetch(url, {
        method: method,
        ...this.configs.nconfig,
        body: JSON.stringify(body),
      });
    }

    return await fetch(url, {
      method: method,
      ...this.configs.nconfig,
    });
  }

  //normal fetch
  async npost(url, body, config) {
    return await (await this.nsend(url, body, config, "POST")).json();
  }
  async nget(url, body, config) {
    return await (await this.nsend(url, body, config, "GET")).json();
  }
  async nput(url, body, config) {
    return await (await this.nsend(url, body, config, "PUT")).json();
  }
  async ndelete(url, body, config) {
    return await (await this.nsend(url, body, config, "DELETE")).json();
  }

  //default fetch
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

  //secure fetch
  async spost(url, body, config) {
    return await (await this.ssend(url, body, config, "POST")).json();
  }
  async sget(url, body, config) {
    return await (await this.ssend(url, body, config, "GET")).json();
  }
  async sput(url, body, config) {
    return await (await this.ssend(url, body, config, "PUT")).json();
  }
  async sdelete(url, body, config) {
    return await (await this.ssend(url, body, config, "DELETE")).json();
  }
}

const fina = new Fina();

export default fina;
