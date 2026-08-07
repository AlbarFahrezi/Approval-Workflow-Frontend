"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    UserPlus,
    Eye,
    EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { createUser } from "@/services/user";

export default function CreateUserPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
  useState("");

const [showPassword, setShowPassword] =
  useState(false);

const [
  showConfirmPassword,
  setShowConfirmPassword,
] = useState(false);
  const [role, setRole] = useState("employee");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !password ||
      !passwordConfirmation
    ) {
      toast.error("Semua field wajib diisi.");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error(
        "Konfirmasi password tidak sama."
      );
      return;
    }

    try {
      setLoading(true);

      await createUser({
  name,
  email,
  password,
  password_confirmation:
    passwordConfirmation,
  role,
});

      toast.success("User berhasil dibuat.");

      router.push("/dashboard/users");
    } catch (error) {
      console.error(error);

      toast.error("Gagal membuat user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      <div>

        <h1 className="text-3xl font-bold">
          Tambah User
        </h1>

        <p className="mt-2 text-slate-500">
          Tambahkan user baru ke dalam sistem.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >

        <div className="space-y-6">

          <div>

            <label className="mb-2 block font-semibold">
              Nama
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Nama lengkap"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B4EA2]"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B4EA2]"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-[#0B4EA2]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Konfirmasi Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={passwordConfirmation}
                onChange={(e) =>
                  setPasswordConfirmation(
                    e.target.value
                  )
                }
                placeholder="Konfirmasi Password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-[#0B4EA2]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B4EA2]"
            >
              <option value="employee">
                Employee
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/users")
              }
              className="rounded-xl border border-slate-200 px-6 py-3 hover:bg-slate-100"
            >
              Batal
            </button>

            <button
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-6 py-3 font-semibold text-white hover:bg-[#083d83] disabled:opacity-60"
            >
              <UserPlus size={18} />

              {loading
                ? "Menyimpan..."
                : "Tambah User"}
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}