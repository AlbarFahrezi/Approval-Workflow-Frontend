import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| Selalu ambil token TERBARU dari localStorage setiap request.
*/

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("approval_token");

      console.log(
        "[AXIOS] ================================"
      );

      console.log(
        "[AXIOS] REQUEST:",
        config.method?.toUpperCase(),
        config.url
      );

      console.log(
        "[AXIOS] TOKEN:",
        token ? "ADA" : "TIDAK ADA"
      );

      /*
      |--------------------------------------------------------------------------
      | Authorization
      |--------------------------------------------------------------------------
      */

      if (token) {
        config.headers = config.headers ?? {};

        config.headers.Authorization =
          `Bearer ${token}`;

        console.log(
          "[AXIOS] Authorization: Bearer [TOKEN ADA]"
        );
      } else {
        console.warn(
          "[AXIOS] ⚠️ TOKEN TIDAK DITEMUKAN"
        );
      }

      console.log(
        "[AXIOS] ================================"
      );
    }

    return config;
  },
  (error) => {
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
    return response;
  },
  (error) => {
    const status = error.response?.status;

    console.error(
      "[AXIOS] RESPONSE ERROR:",
      status,
      error.config?.url
    );

    /*
    |--------------------------------------------------------------------------
    | 401
    |--------------------------------------------------------------------------
    | Jangan langsung hapus token untuk semua 401.
    | Kita perlu melihat dulu apakah token memang invalid.
    */

    if (status === 401) {
      console.warn(
        "[AXIOS] 401 Unauthorized"
      );

      if (typeof window !== "undefined") {
        const token =
          localStorage.getItem("approval_token");

        console.warn(
          "[AXIOS] Token saat menerima 401:",
          token ? "MASIH ADA" : "SUDAH TIDAK ADA"
        );

        /*
        |--------------------------------------------------------------------------
        | Jangan hapus token otomatis dulu.
        |--------------------------------------------------------------------------
        | Ini penting untuk debugging supaya token tidak hilang
        | gara-gara satu request gagal.
        */
      }
    }

    return Promise.reject(error);
  }
);

export default api;