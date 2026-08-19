import api from "@/lib/axios";

import type {
  LoginPayload,
  LoginResponse,
  User,
} from "@/types/auth";

/*
|--------------------------------------------------------------------------
| STORAGE KEYS
|--------------------------------------------------------------------------
*/

const TOKEN_KEY = "approval_token";
const USER_KEY = "approval_user";
const REMEMBER_KEY = "approval_remember_me";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getStorage(): Storage | null {
  if (!isBrowser()) {
    return null;
  }

  const rememberMe =
    localStorage.getItem(REMEMBER_KEY) === "true";

  return rememberMe
    ? localStorage
    : sessionStorage;
}

function clearAuthStorage(): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(REMEMBER_KEY);

  /*
  |--------------------------------------------------------------------------
  | Bersihkan key lama
  |--------------------------------------------------------------------------
  */

  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("auth_token");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("auth_token");
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  try {
    /*
    |--------------------------------------------------------------------------
    | Pastikan session lama dibersihkan sebelum login baru
    |--------------------------------------------------------------------------
    */

    clearAuthStorage();

    const response =
      await api.post<LoginResponse>(
        "/login",
        payload
      );

    const responseData: any =
      response.data;

    /*
    |--------------------------------------------------------------------------
    | Normalisasi response
    |--------------------------------------------------------------------------
    */

    const data =
      responseData?.data ??
      responseData;

    /*
    |--------------------------------------------------------------------------
    | Ambil token
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
    | Ambil user
    |--------------------------------------------------------------------------
    */

    const user =
      data?.user ??
      responseData?.user ??
      null;

    /*
    |--------------------------------------------------------------------------
    | Validasi token
    |--------------------------------------------------------------------------
    */

    if (!token) {
      throw new Error(
        "Login berhasil tetapi token tidak ditemukan dari server."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Simpan default ke localStorage
    |--------------------------------------------------------------------------
    |
    | LoginForm akan mengatur storage berdasarkan Remember Me.
    | Fungsi ini hanya memastikan login service tetap kompatibel
    | apabila dipanggil langsung.
    |
    */

    if (isBrowser()) {
      const storage = localStorage;

      storage.setItem(
        TOKEN_KEY,
        String(token)
      );

      if (user) {
        storage.setItem(
          USER_KEY,
          JSON.stringify(user)
        );
      }

      storage.setItem(
        REMEMBER_KEY,
        "true"
      );
    }

    return response.data;
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | Jangan manipulasi storage di sini.
    | Error akan diteruskan ke LoginForm.
    |--------------------------------------------------------------------------
    */

    throw error;
  }
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
    /*
    |--------------------------------------------------------------------------
    | Logout lokal tetap dilakukan walaupun backend gagal.
    |--------------------------------------------------------------------------
    */

    console.warn(
      "[AUTH] Logout API gagal:",
      error
    );
  } finally {
    clearAuthStorage();

    if (isBrowser()) {
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
  if (!isBrowser()) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Coba storage aktif terlebih dahulu
  |--------------------------------------------------------------------------
  */

  const activeStorage =
    getStorage();

  const activeUser =
    activeStorage?.getItem(USER_KEY);

  if (activeUser) {
    try {
      return JSON.parse(
        activeUser
      ) as User;
    } catch {
      activeStorage?.removeItem(
        USER_KEY
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Fallback
  |--------------------------------------------------------------------------
  */

  const localUser =
    localStorage.getItem(USER_KEY);

  if (localUser) {
    try {
      return JSON.parse(
        localUser
      ) as User;
    } catch {
      localStorage.removeItem(
        USER_KEY
      );
    }
  }

  const sessionUser =
    sessionStorage.getItem(
      USER_KEY
    );

  if (sessionUser) {
    try {
      return JSON.parse(
        sessionUser
      ) as User;
    } catch {
      sessionStorage.removeItem(
        USER_KEY
      );
    }
  }

  return null;
}

/*
|--------------------------------------------------------------------------
| GET STORED TOKEN
|--------------------------------------------------------------------------
*/

export function getStoredToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Active storage
  |--------------------------------------------------------------------------
  */

  const activeStorage =
    getStorage();

  const activeToken =
    activeStorage?.getItem(
      TOKEN_KEY
    );

  if (activeToken) {
    return activeToken;
  }

  /*
  |--------------------------------------------------------------------------
  | Fallback localStorage
  |--------------------------------------------------------------------------
  */

  const localToken =
    localStorage.getItem(
      TOKEN_KEY
    );

  if (localToken) {
    return localToken;
  }

  /*
  |--------------------------------------------------------------------------
  | Fallback sessionStorage
  |--------------------------------------------------------------------------
  */

  const sessionToken =
    sessionStorage.getItem(
      TOKEN_KEY
    );

  if (sessionToken) {
    return sessionToken;
  }

  return null;
}

/*
|--------------------------------------------------------------------------
| CHECK AUTHENTICATION
|--------------------------------------------------------------------------
*/

export function isAuthenticated(): boolean {
  return Boolean(
    getStoredToken()
  );
}

/*
|--------------------------------------------------------------------------
| GET AUTH STORAGE
|--------------------------------------------------------------------------
*/

export function getAuthStorage(): Storage | null {
  return getStorage();
}

/*
|--------------------------------------------------------------------------
| GET AUTH USER ROLE
|--------------------------------------------------------------------------
*/

export function getStoredUserRole():
  | User["role"]
  | null {
  const user =
    getStoredUser();

  return user?.role ?? null;
}

