// const token = () => useCookie("user.token");

// console.debug("token cookies", token().value);

const BackUpApiService = {
  apiUrl: `/v2`,
  tokenSE: "",
  header: true,

  sc() {
    const { CA_ADMIN_API_URL } = useRuntimeConfig();
    const { TOKEN } = useRuntimeConfig();
    this.apiUrl = `${CA_ADMIN_API_URL}`;
    this.tokenSE = `${TOKEN}`;
    return this;
  },

  external() {
    this.header = false;
    return this;
  },

  internal() {
    this.header = true;
    return this;
  },

  setHeaderToken(headers) {
    if (this.header) {
      headers.Authorization = `Bearer ${this.tokenSE}`;
    }
    return headers;
  },

  async get(resource, params = {}, headers = {}) {
    let response = null;
    headers = this.setHeaderToken(headers);

    try {
      response = await $fetch(`${this.apiUrl}/${resource}`, {
        params,
        headers,
      });
    } catch (error) {
      if (error.response.status === 401) useGoogleLogout();
      throw error;
    }

    return response;
  },

  async post(resource, params, headers = {}) {
    let response = null;
    headers = this.setHeaderToken(headers);

    try {
      response = await $fetch(`${this.apiUrl}/${resource}`, {
        method: "POST",
        body: params,
        headers,
      });
    } catch (error) {
      if (error.response.status === 401) useGoogleLogout();
      throw error;
    }

    return response;
  },

  async put(resource, params, headers = {}) {
    let response = null;
    headers = this.setHeaderToken(headers);

    try {
      response = await $fetch(`${this.apiUrl}/${resource}`, {
        method: "PUT",
        body: params,
        headers,
      });
    } catch (error) {
      if (error.response.status === 401) useGoogleLogout();
      throw error;
    }

    return response;
  },

  async patch(resource, params, headers = {}) {
    let response;
    headers = this.setHeaderToken(headers);

    try {
      response = await $fetch(`${this.apiUrl}/${resource}`, {
        method: "PATCH",
        body: params,
        headers,
      });
    } catch (error) {
      if (error.response.status === 401) useGoogleLogout();
      throw error;
    }

    return response;
  },

  async delete(resource, params, headers = {}, config = {}) {
    let response;
    headers = this.setHeaderToken(headers);

    try {
      response = await $fetch(`${this.apiUrl}/${resource}`, {
        method: "DELETE",
        body: params,
        headers,
      });
    } catch (error) {
      if (error.response.status === 401) useGoogleLogout();
      throw error;
    }

    return response;
  },
};

export default BackUpApiService;
