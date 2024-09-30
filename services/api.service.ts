const token = () => useCookie("user.token");

// console.debug("token cookies", token().value);

const ApiService = {
  apiUrl: `/v2`,
  tokenSE: "",
  header: true,

  v1() {
    const { API_URL } = useRuntimeConfig();
    this.apiUrl = `${API_URL}`;
    return this;
  },

  v2() {
    const { API_URL } = useRuntimeConfig();
    this.apiUrl = `${API_URL}/v2`;
    return this;
  },

  sc() {
    const { CA_ADMIN_API_URL } = useRuntimeConfig();
    this.apiUrl = `${CA_ADMIN_API_URL}`;
    return this;
  },

  oldSc() {
    const { SE_API_URL } = useRuntimeConfig();
    const { SE_API_KEY } = useRuntimeConfig();
    this.apiUrl = `${SE_API_URL}`;
    this.tokenSE = `${SE_API_KEY}`;
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
      headers.Authorization = `Bearer ${token().value}`;
    }
    return headers;
  },

  setHeaderTokenSEOldData(headers) {
    if (this.header) {
      headers.Authorization = this.tokenSE;
    }
    return headers;
  },

  async getNoHeader(resource, params = {}) {
    let response = null;

    try {
      response = await $fetch(`${this.apiUrl}/${resource}`, {
        params,
      });
    } catch (error) {
      if (error.response.status === 401) useGoogleLogout();
      throw error;
    }

    return response;
  },

  async postNoHeader(resource, params) {
    let response = null;

    try {
      response = await $fetch(`${this.apiUrl}/${resource}`, {
        method: "POST",
        body: params,
      });
    } catch (error) {
      throw error;
    }

    return response;
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

  async getSEOldData(resource, params = {}, headers = {}) {
    let response = null;
    headers = this.setHeaderTokenSEOldData(headers);

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
        body: {
          data: params,
        },
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
        body: { data: params },
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

export default ApiService;
