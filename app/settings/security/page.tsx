"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Shield,
} from "lucide-react";

export default function SecurityPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
    useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 8) {
      setErrorMessage(
        "Password baru minimal 8 karakter."
      );
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setErrorMessage(
        "Konfirmasi password baru tidak sama."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setErrorMessage(
        "Token login tidak ditemukan. Silakan login kembali."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * Endpoint backend akan kita buat setelah ini.
       */
      const response = await fetch(
        "http://127.0.0.1:8000/api/profile/password",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            password: newPassword,
            password_confirmation:
              newPasswordConfirmation,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal mengubah password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");

      setSuccessMessage(
        result.message ||
          "Password berhasil diperbarui."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengubah password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() => router.push("/settings")}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B4EA2]"
          >
            <ArrowLeft size={18} />
            Kembali ke Settings
          </button>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Keamanan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola password dan keamanan akun kamu.
          </p>

        </div>

        {/* SUCCESS */}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            <CheckCircle2 size={19} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ERROR */}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="space-y-6">

          {/* SECURITY INFO */}

          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B4EA2]">
                <Shield size={23} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Keamanan Akun
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Gunakan password yang kuat dan jangan
                  membagikan password kepada orang lain.
                </p>
              </div>

            </div>

          </section>

          {/* CHANGE PASSWORD */}

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B4EA2]">
                  <Lock size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    Ubah Password
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Masukkan password lama dan password baru.
                  </p>

                </div>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-7"
            >

              {/* CURRENT PASSWORD */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password Saat Ini
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-blue-400 focus-within:bg-white">

                  <Lock
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type={
                      showCurrent
                        ? "text"
                        : "password"
                    }
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(
                        event.target.value
                      )
                    }
                    className="ml-3 w-full bg-transparent text-sm text-slate-800 outline-none"
                    placeholder="Masukkan password saat ini"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrent(
                        (current) => !current
                      )
                    }
                    className="ml-2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* NEW PASSWORD */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password Baru
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-blue-400 focus-within:bg-white">

                  <Lock
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type={
                      showNew
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    className="ml-3 w-full bg-transparent text-sm text-slate-800 outline-none"
                    placeholder="Masukkan password baru"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNew(
                        (current) => !current
                      )
                    }
                    className="ml-2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Password minimal 8 karakter.
                </p>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Konfirmasi Password Baru
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-blue-400 focus-within:bg-white">

                  <Lock
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type={
                      showConfirmation
                        ? "text"
                        : "password"
                    }
                    value={newPasswordConfirmation}
                    onChange={(event) =>
                      setNewPasswordConfirmation(
                        event.target.value
                      )
                    }
                    className="ml-3 w-full bg-transparent text-sm text-slate-800 outline-none"
                    placeholder="Ulangi password baru"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmation(
                        (current) => !current
                      )
                    }
                    className="ml-2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmation ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* SUBMIT */}

              <div className="flex justify-end border-t border-slate-100 pt-6">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-[#0B4EA2] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : "Ubah Password"}
                </button>

              </div>

            </form>

          </section>

        </div>

      </div>
    </main>
  );
}