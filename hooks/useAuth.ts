"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/auth";

export function useAuth() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("approval_token");
    const storedUser = localStorage.getItem("approval_user");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;

      // Menjadwalkan pembaruan state setelah fase effect selesai.
      queueMicrotask(() => {
        setUser(parsedUser);
        setLoading(false);
      });
    } catch {
      localStorage.removeItem("approval_token");
      localStorage.removeItem("approval_user");
      router.replace("/login");
      return;
    }
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
