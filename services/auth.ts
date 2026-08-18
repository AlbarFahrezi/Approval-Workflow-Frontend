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
  console.log("========== LOGIN START ==========");
  console.log("[LOGIN] Email:", payload.email);

  try {
    /*
    |--------------------------------------------------------------------------
    | REQUEST LOGIN
    |--------------------------------------------------------------------------
    */

    const response = await api.post<LoginResponse>(
      "/login",
      payload
    );

    console.log(
      "[LOGIN] HTTP STATUS:",
      response.status
    );

    console.log(
      "[LOGIN] RESPONSE:",
      response.data
    );

    /*
    |--------------------------------------------------------------------------
    | RESPONSE DATA
    |--------------------------------------------------------------------------
    */

    const responseData: any = response.data;

    const data =
      responseData?.data ??
      responseData;

    /*
    |--------------------------------------------------------------------------
    | TOKEN
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
    | USER
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
    | VALIDATE TOKEN
    |--------------------------------------------------------------------------
    */

    if (!token) {
      console.error(
        "[LOGIN] ❌ TOKEN TIDAK DITEMUKAN"
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
      console.log(
        "[LOGIN] Menyimpan token..."
      );

      localStorage.setItem(
        "approval_token",
        String(token)
      );

      if (user) {
        localStorage.setItem(
          "approval_user",
          JSON.stringify(user)
        );
      }

      /*
      |--------------------------------------------------------------------------
      | VERIFY LOCAL STORAGE
      |--------------------------------------------------------------------------
      */

      const savedToken =
        localStorage.getItem(
          "approval_token"
        );

      const savedUser =
        localStorage.getItem(
          "approval_user"
        );

      console.log(
        "[LOGIN] ================================"
      );

      console.log(
        "[LOGIN] TOKEN STORAGE:",
        savedToken ? "ADA" : "TIDAK ADA"
      );

      console.log(
        "[LOGIN] USER STORAGE:",
        savedUser ? "ADA" : "TIDAK ADA"
      );

      console.log(
        "[LOGIN] TOKEN LENGTH:",
        savedToken?.length ?? 0
      );

      console.log(
        "[LOGIN] ================================"
      );

      /*
      |--------------------------------------------------------------------------
      | VALIDATE STORAGE
      |--------------------------------------------------------------------------
      */

      if (!savedToken) {
        throw new Error(
          "Token gagal disimpan ke localStorage."
        );
      }
    }

    console.log(
      "========== LOGIN SUCCESS =========="
    );

    return response.data;
  } catch (error) {
    console.error(
      "========== LOGIN SERVICE ERROR =========="
    );

    console.error(
      "[LOGIN] ERROR:",
      error
    );

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
    console.warn(
      "[AUTH] Logout API gagal:",
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

      /*
      |--------------------------------------------------------------------------
      | Bersihkan token lama jika masih ada
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_token");

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

  const storedUser =
    localStorage.getItem(
      "approval_user"
    );

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(
      storedUser
    ) as User;
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
| CHECK AUTHENTICATION
|--------------------------------------------------------------------------
*/

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token =
    localStorage.getItem(
      "approval_token"
    );

  return Boolean(token);
}