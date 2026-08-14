"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/auth";

export function useAuth() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const getStoredAuth = () => {
      /*
      |--------------------------------------------------------------------------
      | LOCAL STORAGE
      |--------------------------------------------------------------------------
      |
      | Digunakan ketika "Ingat saya" aktif.
      |
      */

      const localToken =
        localStorage.getItem(
          "approval_token"
        );

      const localUser =
        localStorage.getItem(
          "approval_user"
        );

      if (localToken && localUser) {
        return {
          token: localToken,
          user: localUser,
        };
      }

      /*
      |--------------------------------------------------------------------------
      | SESSION STORAGE
      |--------------------------------------------------------------------------
      |
      | Digunakan ketika "Ingat saya" tidak aktif.
      |
      */

      const sessionToken =
        sessionStorage.getItem(
          "approval_token"
        );

      const sessionUser =
        sessionStorage.getItem(
          "approval_user"
        );

      if (sessionToken && sessionUser) {
        return {
          token: sessionToken,
          user: sessionUser,
        };
      }

      return null;
    };

    const authData =
      getStoredAuth();

    /*
    |--------------------------------------------------------------------------
    | TIDAK ADA AUTH
    |--------------------------------------------------------------------------
    */

    if (!authData) {
      setUser(null);
      setLoading(false);

      router.replace("/login");

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | PARSE USER
    |--------------------------------------------------------------------------
    */

    try {
      const parsedUser =
        JSON.parse(
          authData.user
        ) as User;

      setUser(parsedUser);
      setLoading(false);
    } catch {
      /*
      |--------------------------------------------------------------------------
      | AUTH DATA RUSAK
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem(
        "approval_token"
      );

      localStorage.removeItem(
        "approval_user"
      );

      localStorage.removeItem(
        "approval_remember_me"
      );

      sessionStorage.removeItem(
        "approval_token"
      );

      sessionStorage.removeItem(
        "approval_user"
      );

      sessionStorage.removeItem(
        "approval_remember_me"
      );

      setUser(null);
      setLoading(false);

      router.replace("/login");
    }
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}   