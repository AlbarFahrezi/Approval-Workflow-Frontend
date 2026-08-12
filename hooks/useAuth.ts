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
    const token =
      localStorage.getItem("approval_token");

    const storedUser =
      localStorage.getItem("approval_user");

    if (!token || !storedUser) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    try {
      const parsedUser =
        JSON.parse(storedUser) as User;

      setUser(parsedUser);
      setLoading(false);
    } catch {
      localStorage.removeItem(
        "approval_token"
      );

      localStorage.removeItem(
        "approval_user"
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