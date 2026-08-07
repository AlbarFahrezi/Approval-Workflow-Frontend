"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  getUser,
  updateUser,
} from "@/services/user";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");

  async function loadUser() {
    try {
      const user = await getUser(id);

      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Nama dan Email wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      await updateUser(id, {
        name,
        email,
        role,
      });

      toast.success("User berhasil diperbarui.");

      router.push("/dashboard/users");
    } catch (error) {
      console.error(error);

      toast.error("Gagal mengupdate user.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-[#0B4EA2]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Edit User
        </h1>

        <p className="mt-1 text-slate-500">
          Perbarui data user.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >

        <div>
          <label className="mb-2 block font-semibold">
            Nama
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B4EA2]"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 px-6 py-3 hover:bg-slate-100"
          >
            Batal
          </button>

          <button
            disabled={saving}
            className="rounded-xl bg-[#0B4EA2] px-6 py-3 font-semibold text-white hover:bg-[#083d83] disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>

        </div>

      </form>

    </div>
  );
}