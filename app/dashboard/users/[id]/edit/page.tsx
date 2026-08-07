"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

    try {
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
    }
  }

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Edit User
        </h1>

        <p className="text-slate-500">
          Perbarui data user.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-8 shadow"
      >

        <div>

          <label>Nama</label>

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label>Email</label>

          <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label>Role</label>

          <select
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
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

        <div className="flex gap-3">

          <button
            type="button"
            onClick={()=>router.back()}
            className="rounded-xl border px-6 py-3"
          >
            Batal
          </button>

          <button
            className="rounded-xl bg-blue-700 px-6 py-3 text-white"
          >
            Simpan
          </button>

        </div>

      </form>

    </div>
  );
}