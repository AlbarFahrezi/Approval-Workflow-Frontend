import api from "@/lib/axios";

import type {
  LoginPayload,
  LoginResponse,
  User,
} from "@/types/auth";

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  console.log("========== LOGIN ==========");
  console.log(
    "LOGIN URL:",
    `${api.defaults.baseURL}/login`
  );
  console.log("EMAIL:", payload.email);

  const response = await api.post<LoginResponse>(
    "/login",
    payload
  );

  console.log(
    "LOGIN RESPONSE:",
    response.data
  );

  /*
  |--------------------------------------------------------------------------
  | AMBIL DATA RESPONSE
  |--------------------------------------------------------------------------
  */

  const responseData: any = response.data;

  console.log(
    "[LOGIN] Full response:",
    responseData
  );

  /*
  |--------------------------------------------------------------------------
  | HANDLE BEBERAPA KEMUNGKINAN RESPONSE
  |--------------------------------------------------------------------------
  */

  const data =
    responseData?.data ??
    responseData;

  /*
  |--------------------------------------------------------------------------
  | AMBIL TOKEN
  |--------------------------------------------------------------------------
  */

  const token =
    data?.token ??
    data?.access_token ??
    responseData?.token ??
    responseData?.access_token ??
    null;

  /*
  |--------------------------------------------------------------------------
  | AMBIL USER
  |--------------------------------------------------------------------------
  */

  const user =
    data?.user ??
    responseData?.user ??
    null;

  console.log(
    "[LOGIN] TOKEN:",
    token ? "DITEMUKAN" : "TIDAK DITEMUKAN"
  );

  console.log(
    "[LOGIN] USER:",
    user
  );

  /*
  |--------------------------------------------------------------------------
  | TOKEN WAJIB ADA
  |--------------------------------------------------------------------------
  */

  if (!token) {
    console.error(
      "[LOGIN] RESPONSE BACKEND TIDAK MENGANDUNG TOKEN!"
    );
    console.error(
      "[LOGIN] RESPONSE LENGKAP:",
      responseData
    );
    throw new Error(
      "Login berhasil tetapi token tidak ditemukan dari server."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | SIMPAN SESSION
  |--------------------------------------------------------------------------
  */

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "approval_token",
      token
    );
    console.log(
      "[LOGIN] approval_token berhasil disimpan."
    );
    if (user) {
      localStorage.setItem(
        "approval_user",
        JSON.stringify(user)
      );
      console.log(
        "[LOGIN] approval_user berhasil disimpan."
      );
    }
    console.log(
      "[LOGIN] CEK LOCAL STORAGE:",
      localStorage.getItem("approval_token")
        ? "TOKEN ADA"
        : "TOKEN TIDAK ADA"
    );
  }

  return response.data;
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export async function logout(): Promise<void> {
  try {
    await api.post("/logout");
  } catch (error) {
    console.warn(
      "Logout API gagal, session lokal tetap dibersihkan.",
      error
    );
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem(
        "approval_token"
      );

      localStorage.removeItem(
        "approval_user"
      );

      window.location.href = "/login";
    }
  }
}

/*
|--------------------------------------------------------------------------
| GET STORED USER
|--------------------------------------------------------------------------
*/

export function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem(
    "approval_user"
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch (error) {
    console.error(
      "[AUTH] Gagal membaca approval_user:",
      error
    );

    localStorage.removeItem(
      "approval_user"
    );

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| GET STORED TOKEN
|--------------------------------------------------------------------------
*/

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    "approval_token"
  );
}

/*
|--------------------------------------------------------------------------
| CHECK AUTH
|--------------------------------------------------------------------------
*/

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(
    localStorage.getItem("approval_token")
  );
}