class Axios {
  defaults = {
    baseUrl: "",
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
    console.log(this.defaults.baseUrl);
    let realUrl;
    if (url.split("/")[0].includes(".")) {
      realUrl = url;
    } else {
      realUrl = `${this.defaults.baseUrl}${url.charAt(0) === "/" ? url : "/" + url
        }`;
    }

    console.log(realUrl);

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

const axios = new Axios();

export default axios;
