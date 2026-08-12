import api from "@/lib/axios";
import type {
  LoginPayload,
  LoginResponse,
  User,
} from "@/types/auth";

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  console.log("========== LOGIN ==========");
  console.log("LOGIN URL:", `${api.defaults.baseURL}/login`);
  console.log("EMAIL:", payload.email);

  const response = await api.post<LoginResponse>(
    "/login",
    payload
  );

  console.log("LOGIN RESPONSE:", response.data);

  const data = response.data.data;

  const token =
    data.token ??
    data.access_token;

  const user = data.user;

  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(
        "approval_token",
        token
      );
    }

    if (user) {
      localStorage.setItem(
        "approval_user",
        JSON.stringify(user)
      );
    }
  }

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/logout");
  } catch (error) {
    console.warn(
      "Logout API gagal, session lokal tetap akan dibersihkan.",
      error
    );
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("approval_token");
      localStorage.removeItem("approval_user");

      window.location.href = "/login";
    }
  }
}

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
  } catch {
    localStorage.removeItem(
      "approval_user"
    );

    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    "approval_token"
  );
}