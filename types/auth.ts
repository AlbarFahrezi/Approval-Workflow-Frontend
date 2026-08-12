export type UserRole =
  | "admin"
  | "manager"
  | "employee";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    user: User;

    token?: string;
    access_token?: string;

    [key: string]: unknown;
  };
}