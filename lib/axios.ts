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
| Ambil token dari localStorage menggunakan key yang sama dengan login.
*/

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("approval_token");

      console.log(
        "[AXIOS] Token:",
        token ? "ADA" : "TIDAK ADA"
      );

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
| Kalau token expired / tidak valid, bersihkan session lokal.
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "[AXIOS] Unauthorized - token tidak valid / expired."
      );

      if (typeof window !== "undefined") {
        localStorage.removeItem("approval_token");
        localStorage.removeItem("approval_user");
      }
    }

    return Promise.reject(error);
  }
);

export default api;