import api from "@/lib/axios";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export async function login(payload: LoginPayload) {
  console.log("BASE URL:", api.defaults.baseURL);
  console.log("LOGIN URL:", `${api.defaults.baseURL}/login`);

  const response = await api.post<LoginResponse>("/login", payload);

  return response.data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("approval_token");
    localStorage.removeItem("approval_user");
  }
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("approval_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}