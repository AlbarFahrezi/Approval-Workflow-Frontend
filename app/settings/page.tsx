"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  LogOut,
  RotateCcw,
  Shield,
  User,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";

export default function SettingsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD SETTINGS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const savedNotifications = localStorage.getItem(
      "settings_notifications"
    );

    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }

    // Hapus preferensi dark mode lama jika masih tersimpan
    localStorage.removeItem("settings_dark_mode");

    setLoadingSettings(false);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | GET TOKEN
  |--------------------------------------------------------------------------
  */

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    const keys = [
      "approval_token",
      "token",
      "access_token",
      "auth_token",
      "accessToken",
    ];

    for (const key of keys) {
      const value = localStorage.getItem(key);

      if (value) {
        return value;
      }
    }

    return null;
  };

  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION
  |--------------------------------------------------------------------------
  */

  const handleNotificationToggle = () => {
    setNotifications((current) => !current);
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE SETTINGS
  |--------------------------------------------------------------------------
  */

 const handleSave = () => {
  localStorage.setItem(
    "settings_notifications",
    String(notifications)
  );

  router.replace("/dashboard");
};

  /*
  |--------------------------------------------------------------------------
  | RESET SETTINGS
  |--------------------------------------------------------------------------
  */

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset semua pengaturan ke pengaturan awal?"
    );

    if (!confirmed) {
      return;
    }

    setNotifications(true);

    localStorage.setItem(
      "settings_notifications",
      "true"
    );

    localStorage.removeItem("settings_dark_mode");

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin keluar dari akun?"
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    try {
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("approval_token");
      localStorage.removeItem("approval_user");
      localStorage.removeItem("approval_remember_me");

      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("accessToken");

      localStorage.removeItem("settings_dark_mode");

      router.replace("/login");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loadingSettings) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto flex max-w-5xl items-center justify-center py-32">
          <p className="text-sm text-slate-500">
            Memuat pengaturan...
          </p>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B4EA2]"
          >
            <ArrowLeft size={18} />
            Kembali ke Dashboard
          </button>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola pengaturan akun dan preferensi aplikasi kamu.
          </p>

        </div>

        {/* SUCCESS */}

        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            <Check size={19} />
            Pengaturan berhasil disimpan.
          </div>
        )}

        <div className="space-y-6">

          {/* ACCOUNT */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B4EA2]">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Akun
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Kelola informasi akun kamu.
                  </p>
                </div>

              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {/* PROFILE */}

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="flex w-full items-center justify-between px-7 py-5 text-left transition hover:bg-slate-50"
              >

                <div>

                  <p className="text-sm font-medium text-slate-800">
                    Profile
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Ubah nama, email, dan foto profile.
                  </p>

                </div>

                <ChevronRight
                  size={19}
                  className="text-slate-400"
                />

              </button>

              {/* SECURITY */}

              <button
                type="button"
                onClick={() =>
                  router.push("/settings/security")
                }
                className="flex w-full items-center justify-between px-7 py-5 text-left transition hover:bg-slate-50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <Shield size={19} />
                  </div>

                  <div>

                    <p className="text-sm font-medium text-slate-800">
                      Keamanan
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Kelola password dan keamanan akun.
                    </p>

                  </div>

                </div>

                <ChevronRight
                  size={19}
                  className="text-slate-400"
                />

              </button>

            </div>

          </section>

          {/* NOTIFICATION */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B4EA2]">
                  <Bell size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    Notifikasi
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Atur pemberitahuan aplikasi.
                  </p>

                </div>

              </div>

            </div>

            <div className="flex items-center justify-between px-7 py-6">

              <div>

                <p className="text-sm font-medium text-slate-800">
                  Notifikasi aplikasi
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Terima pemberitahuan mengenai aktivitas pengajuan.
                </p>

              </div>

              <button
                type="button"
                onClick={handleNotificationToggle}
                aria-label="Toggle notifikasi"
                className={`relative h-7 w-12 rounded-full transition ${
                  notifications
                    ? "bg-[#0B4EA2]"
                    : "bg-slate-300"
                }`}
              >

                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                    notifications
                      ? "left-6"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

          </section>

          {/* APPEARANCE */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            

           

          </section>

          {/* ACTIONS */}

          <div className="flex flex-col justify-end gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={18} />
              Reset Pengaturan
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-2xl bg-[#0B4EA2] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-700"
            >
              Simpan Pengaturan
            </button>

          </div>

         
        </div>
      </div>
    </main>
  );
}