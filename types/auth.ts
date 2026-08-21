export type UserRole =
  | "admin"
  | "manager"
  | "employee";

/*
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/

export interface User {
  id: number;

  name: string;

  email: string;

  role: UserRole;

  /*
  |--------------------------------------------------------------------------
  | AVATAR
  |--------------------------------------------------------------------------
  |
  | avatar:
  | contoh:
  | avatars/foto.jpg
  |
  | avatar_url:
  | contoh:
  | http://127.0.0.1:8000/storage/avatars/foto.jpg
  |
  */

  avatar?: string | null;

  avatar_url?: string | null;

  email_verified_at?: string | null;

  created_at?: string;

  updated_at?: string;
}

/*
|--------------------------------------------------------------------------
| LOGIN PAYLOAD
|--------------------------------------------------------------------------
*/

export interface LoginPayload {
  email: string;
  password: string;
}

/*
|--------------------------------------------------------------------------
| LOGIN RESPONSE
|--------------------------------------------------------------------------
*/

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