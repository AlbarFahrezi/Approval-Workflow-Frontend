"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import api from "@/lib/axios";

import type { User } from "@/types/auth";

const TOKEN_KEY = "approval_token";
const USER_KEY = "approval_user";
const REMEMBER_KEY = "approval_remember_me";

/*
|--------------------------------------------------------------------------
| GET TOKEN
|--------------------------------------------------------------------------
*/

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem(TOKEN_KEY) ??
    sessionStorage.getItem(TOKEN_KEY)
  );
}

/*
|--------------------------------------------------------------------------
| GET ACTIVE STORAGE
|--------------------------------------------------------------------------
*/

function getActiveStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  const localToken =
    localStorage.getItem(TOKEN_KEY);

  if (localToken) {
    return localStorage;
  }

  const sessionToken =
    sessionStorage.getItem(TOKEN_KEY);

  if (sessionToken) {
    return sessionStorage;
  }

  return null;
}

/*
|--------------------------------------------------------------------------
| CLEAR AUTH
|--------------------------------------------------------------------------
*/

function clearAuthStorage() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(REMEMBER_KEY);
}

/*
|--------------------------------------------------------------------------
| USE AUTH
|--------------------------------------------------------------------------
*/

export function useAuth() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | REFRESH USER
  |--------------------------------------------------------------------------
  |
  | Mengambil profile terbaru dari Laravel.
  |
  | Ini penting supaya:
  |
  | avatar
  | nama
  | email
  | role
  |
  | selalu menggunakan data terbaru.
  |
  */

  const refreshUser =
    useCallback(async () => {
      const token = getToken();
      const storage =
        getActiveStorage();

      /*
      |--------------------------------------------------------------------------
      | TIDAK ADA TOKEN
      |--------------------------------------------------------------------------
      */

      if (!token || !storage) {
        setUser(null);
        setLoading(false);

        router.replace("/login");

        return null;
      }

      /*
      |--------------------------------------------------------------------------
      | AMBIL PROFILE DARI API
      |--------------------------------------------------------------------------
      */

      try {
        console.log(
          "[AUTH] Mengambil profile terbaru..."
        );

        const response =
          await api.get<{
            success: boolean;
            message: string;
            data: User;
          }>("/profile");

        const freshUser =
          response.data.data;

        console.log(
          "[AUTH] Profile berhasil:",
          freshUser
        );

        /*
        |--------------------------------------------------------------------------
        | UPDATE STATE
        |--------------------------------------------------------------------------
        */

        setUser(freshUser);

        /*
        |--------------------------------------------------------------------------
        | UPDATE STORAGE
        |--------------------------------------------------------------------------
        |
        | Supaya Header, Sidebar, dan halaman lain
        | mendapatkan data user terbaru.
        |
        */

        storage.setItem(
          USER_KEY,
          JSON.stringify(freshUser)
        );

        return freshUser;
      } catch (error: any) {
        console.error(
          "[AUTH] Gagal mengambil profile:",
          error
        );

        /*
        |--------------------------------------------------------------------------
        | FALLBACK KE USER YANG TERSIMPAN
        |--------------------------------------------------------------------------
        |
        | Kalau API sedang bermasalah tetapi user
        | masih memiliki cached user, jangan langsung
        | mengeluarkan user dari dashboard.
        |
        */

        const cachedUser =
          storage.getItem(USER_KEY);

        if (cachedUser) {
          try {
            const parsedUser =
              JSON.parse(
                cachedUser
              ) as User;

            setUser(parsedUser);

            console.warn(
              "[AUTH] Menggunakan cached user."
            );

            return parsedUser;
          } catch {
            console.warn(
              "[AUTH] Cached user rusak."
            );
          }
        }

        /*
        |--------------------------------------------------------------------------
        | TOKEN TIDAK VALID
        |--------------------------------------------------------------------------
        */

        if (
          error?.response?.status === 401
        ) {
          clearAuthStorage();

          setUser(null);

          router.replace("/login");

          return null;
        }

        /*
        |--------------------------------------------------------------------------
        | ERROR LAIN
        |--------------------------------------------------------------------------
        */

        setUser(null);

        return null;
      } finally {
        setLoading(false);
      }
    }, [router]);

  /*
  |--------------------------------------------------------------------------
  | INITIAL AUTH CHECK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return {
    user,
    loading,
    isAuthenticated: !!user,
    refreshUser,
  };
}