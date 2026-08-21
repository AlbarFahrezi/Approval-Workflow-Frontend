import axios from "axios";

/*
|--------------------------------------------------------------------------
| AXIOS INSTANCE
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",

  headers: {
    Accept: "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| STORAGE KEY
|--------------------------------------------------------------------------
*/

const TOKEN_KEY = "approval_token";

/*
|--------------------------------------------------------------------------
| GET AUTH TOKEN
|--------------------------------------------------------------------------
*/

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const localToken =
    window.localStorage.getItem(TOKEN_KEY);

  if (localToken) {
    return localToken;
  }

  return window.sessionStorage.getItem(TOKEN_KEY);
}

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") {
      return config;
    }

    const url = config.url ?? "";

    const isLoginRequest =
      url === "/login" ||
      url.endsWith("/login");

    /*
    |--------------------------------------------------------------------------
    | LOGIN REQUEST
    |--------------------------------------------------------------------------
    */

    if (isLoginRequest) {
      if (config.headers) {
        delete config.headers.Authorization;
      }

      console.log(
        "[AXIOS] LOGIN:",
        config.method?.toUpperCase(),
        url
      );

      return config;
    }

    /*
    |--------------------------------------------------------------------------
    | AUTH TOKEN
    |--------------------------------------------------------------------------
    */

    const token = getAuthToken();

    if (token) {
      config.headers =
        config.headers ?? {};

      config.headers.Authorization =
        `Bearer ${token}`;

      console.log(
        "[AXIOS] AUTH:",
        config.method?.toUpperCase(),
        url,
        "| Bearer token dikirim"
      );
    } else {
      console.warn(
        "[AXIOS] ⚠️ Token tidak ditemukan:",
        url
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FORM DATA
    |--------------------------------------------------------------------------
    |
    | Kalau request menggunakan FormData, jangan paksa
    | Content-Type menjadi application/json.
    |
    | Browser akan otomatis menentukan:
    |
    | multipart/form-data; boundary=...
    |
    |--------------------------------------------------------------------------
    */

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];

      console.log(
        "[AXIOS] FORM DATA:",
        url
      );
    }

    return config;
  },

  (error) => {
    console.error(
      "[AXIOS] Request interceptor error:",
      error
    );

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => {
    console.log(
      "[AXIOS] RESPONSE:",
      response.status,
      response.config.url
    );

    return response;
  },

  (error) => {
    const status =
      error.response?.status;

    const url =
      error.config?.url;

    /*
    |--------------------------------------------------------------------------
    | LOGIN 401
    |--------------------------------------------------------------------------
    */

    if (
      status === 401 &&
      (
        url === "/login" ||
        url?.endsWith("/login")
      )
    ) {
      console.warn(
        "[AXIOS] Login ditolak: email/password tidak valid."
      );

      return Promise.reject(error);
    }

    /*
    |--------------------------------------------------------------------------
    | OTHER 401
    |--------------------------------------------------------------------------
    */

    if (status === 401) {
      console.warn(
        "[AXIOS] ⚠️ 401 Unauthorized:",
        url
      );

      if (typeof window !== "undefined") {
        const localToken =
          window.localStorage.getItem(
            TOKEN_KEY
          );

        const sessionToken =
          window.sessionStorage.getItem(
            TOKEN_KEY
          );

        console.warn(
          "[AXIOS] localStorage token:",
          localToken
            ? "ADA"
            : "TIDAK ADA"
        );

        console.warn(
          "[AXIOS] sessionStorage token:",
          sessionToken
            ? "ADA"
            : "TIDAK ADA"
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | 403 FORBIDDEN
    |--------------------------------------------------------------------------
    */

    if (status === 403) {
      console.warn(
        "[AXIOS] ⚠️ 403 Forbidden:",
        url
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 404 NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (status === 404) {
      console.warn(
        "[AXIOS] ⚠️ 404 Endpoint tidak ditemukan:",
        url
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 422 VALIDATION ERROR
    |--------------------------------------------------------------------------
    */

    if (status === 422) {
      console.warn(
        "[AXIOS] ⚠️ 422 Validation Error:",
        url
      );

      if (error.response?.data) {
        console.warn(
          "[AXIOS] Validation:",
          error.response.data
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | 500 SERVER ERROR
    |--------------------------------------------------------------------------
    */

    if (status === 500) {
      console.error(
        "[AXIOS] ❌ 500 Internal Server Error:",
        url
      );
    }

    /*
    |--------------------------------------------------------------------------
    | NETWORK ERROR
    |--------------------------------------------------------------------------
    */

    if (!error.response) {
      console.error(
        "[AXIOS] ❌ Tidak ada response dari server."
      );

      console.error(
        "[AXIOS] Pastikan Laravel sedang berjalan."
      );
    }

    return Promise.reject(error);
  }
);

export default api;