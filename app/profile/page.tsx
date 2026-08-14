"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api from "@/lib/axios";

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  avatar_url?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /*
  |--------------------------------------------------------------------------
  | GET PROFILE
  |--------------------------------------------------------------------------
  */

  const getProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/profile");

      console.log("PROFILE RESPONSE:", response.data);

      const profile: UserData = response.data.data;

      setUser(profile);
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
      setAvatarPreview(profile.avatar_url ?? null);

      /*
      |--------------------------------------------------------------------------
      | UPDATE LOCAL USER
      |--------------------------------------------------------------------------
      */

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "approval_user",
          JSON.stringify(profile)
        );
      }
    } catch (error: any) {
      console.error("GET PROFILE ERROR:", error);

      const message =
        error?.response?.data?.message ||
        "Gagal mengambil data profile.";

      setErrorMessage(message);

      /*
      |--------------------------------------------------------------------------
      | TOKEN INVALID / EXPIRED
      |--------------------------------------------------------------------------
      */

      if (
        error?.response?.status === 401
      ) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("approval_token");
          localStorage.removeItem("approval_user");
        }

        setErrorMessage(
          "Session login sudah tidak valid. Silakan login kembali."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD PROFILE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    getProfile();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CHOOSE AVATAR
  |--------------------------------------------------------------------------
  */

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE FILE TYPE
    |--------------------------------------------------------------------------
    */

    if (!file.type.startsWith("image/")) {
      setErrorMessage("File avatar harus berupa gambar.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE FILE SIZE
    |--------------------------------------------------------------------------
    */

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran foto maksimal 2 MB.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    setAvatarFile(file);

    /*
    |--------------------------------------------------------------------------
    | PREVIEW
    |--------------------------------------------------------------------------
    */

    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN FILE PICKER
  |--------------------------------------------------------------------------
  */

  const openFilePicker = () => {
    if (saving) {
      return;
    }

    fileInputRef.current?.click();
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE PROFILE
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      /*
      |--------------------------------------------------------------------------
      | UPDATE PROFILE
      |--------------------------------------------------------------------------
      */

      const response = await api.post(
        "/profile",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log(
        "UPDATE PROFILE RESPONSE:",
        response.data
      );

      const updatedUser: UserData =
        response.data.data;

      /*
      |--------------------------------------------------------------------------
      | UPDATE STATE
      |--------------------------------------------------------------------------
      */

      setUser(updatedUser);
      setName(updatedUser.name ?? "");
      setEmail(updatedUser.email ?? "");
      setAvatarPreview(
        updatedUser.avatar_url ?? null
      );
      setAvatarFile(null);

      /*
      |--------------------------------------------------------------------------
      | UPDATE LOCAL STORAGE USER
      |--------------------------------------------------------------------------
      */

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "approval_user",
          JSON.stringify(updatedUser)
        );
      }

      setSuccessMessage(
        response.data.message ||
          "Profile berhasil diperbarui."
      );

      /*
      |--------------------------------------------------------------------------
      | RESET FILE INPUT
      |--------------------------------------------------------------------------
      */

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Gagal memperbarui profile.";

      setErrorMessage(message);

      /*
      |--------------------------------------------------------------------------
      | TOKEN INVALID / EXPIRED
      |--------------------------------------------------------------------------
      */

      if (
        error?.response?.status === 401
      ) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(
            "approval_token"
          );

          localStorage.removeItem(
            "approval_user"
          );
        }

        setErrorMessage(
          "Session login sudah tidak valid. Silakan login kembali."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL
  |--------------------------------------------------------------------------
  */

  const initial =
    user?.name?.charAt(0).toUpperCase() ?? "U";

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-32">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2
              size={22}
              className="animate-spin"
            />

            Memuat profile...
          </div>
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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">

          <div className="mb-5">

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B4EA2]"
            >
              <ArrowLeft size={18} />

              Kembali ke Dashboard
            </button>

          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola informasi akun dan keamanan
            profile kamu.
          </p>

        </div>

        {/* SUCCESS */}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">

            <CheckCircle2 size={19} />

            <span>
              {successMessage}
            </span>

          </div>
        )}

        {/* ERROR */}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

            <AlertCircle size={19} />

            <span>
              {errorMessage}
            </span>

          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 lg:grid-cols-[410px_1fr]">

            {/* ======================================================
                PROFILE CARD
            ====================================================== */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex flex-col items-center">

                {/* AVATAR */}

                <div className="relative">

                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={
                        user?.name ?? "User"
                      }
                      className="h-32 w-32 rounded-3xl object-cover shadow-lg ring-4 ring-white"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-[#0B4EA2] text-5xl font-semibold text-white shadow-lg ring-4 ring-white">
                      {initial}
                    </div>
                  )}

                  {/* CAMERA BUTTON */}

                  <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={saving}
                    className="absolute bottom-[-4px] right-[-4px] flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-[#0B4EA2] text-white shadow-lg transition hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    title="Ganti foto profile"
                  >
                    <Camera size={20} />
                  </button>

                  {/* HIDDEN FILE INPUT */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={
                      handleAvatarChange
                    }
                    className="hidden"
                  />

                </div>

                {/* NAME */}

                <h2 className="mt-6 text-xl font-semibold text-slate-900">
                  {user?.name ?? "User"}
                </h2>

                {/* EMAIL */}

                <p className="mt-1 text-sm text-slate-500">
                  {user?.email ?? "-"}
                </p>

                {/* ROLE */}

                <div className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium capitalize text-[#0B4EA2]">
                  {user?.role ?? "-"}
                </div>

                {/* USER ID */}

                <div className="mt-8 w-full border-t border-slate-100 pt-6">

                  <p className="text-xs text-slate-400">
                    User ID
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    #{user?.id ?? "-"}
                  </p>

                </div>

                {/* INFO */}

                <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                  Klik tombol kamera untuk
                  mengganti foto profile.
                  Foto akan diperbarui setelah
                  menekan tombol Simpan
                  Perubahan.
                </p>

              </div>

            </div>

            {/* ======================================================
                PROFILE FORM
            ====================================================== */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="mb-7">

                <h2 className="text-lg font-semibold text-slate-900">
                  Informasi Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Perbarui nama, email, dan foto
                  profile kamu.
                </p>

              </div>

              {/* NAME */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nama
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition focus-within:border-blue-400 focus-within:bg-white">

                  <User
                    size={19}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    className="ml-3 w-full bg-transparent text-sm text-slate-800 outline-none"
                    placeholder="Masukkan nama"
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition focus-within:border-blue-400 focus-within:bg-white">

                  <Mail
                    size={19}
                    className="text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    className="ml-3 w-full bg-transparent text-sm text-slate-800 outline-none"
                    placeholder="Masukkan email"
                    required
                  />

                </div>

              </div>

              {/* ROLE */}

              <div className="mb-8">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3.5">

                  <Shield
                    size={19}
                    className="text-slate-400"
                  />

                  <span className="ml-3 text-sm capitalize text-slate-600">
                    {user?.role ?? "-"}
                  </span>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Role akun dikelola oleh
                  administrator.
                </p>

              </div>

              {/* SAVE */}

              <div className="flex justify-end">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-2xl bg-[#0B4EA2] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={18} />

                      Simpan Perubahan
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </form>

      </div>
    </main>
  );
}