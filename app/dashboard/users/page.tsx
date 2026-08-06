"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { getUsers } from "@/services/user";
import type { User } from "@/types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            User Management
          </h1>

          <p className="text-slate-500 mt-1">
            Kelola seluruh user pada sistem.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={loadUsers}
            className="rounded-xl border border-slate-200 p-3 hover:bg-slate-100"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>

          <button
            className="flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-5 py-3 font-semibold text-white hover:bg-[#083d83]"
          >
            <Plus size={18} />
            Tambah User
          </button>

        </div>

      </div>

      {loading ? (

        <div className="flex h-72 items-center justify-center">
          <Loader2
            size={30}
            className="animate-spin text-[#0B4EA2]"
          />
        </div>

      ) : (

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-6 py-4 text-left">
                  Nama
                </th>

                <th className="px-6 py-4 text-left">
                  Email
                </th>

                <th className="px-6 py-4 text-left">
                  Role
                </th>

                <th className="px-6 py-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-t"
                >

                  <td className="px-6 py-4">
                    {user.name}
                  </td>

                  <td className="px-6 py-4">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 capitalize">
                    {user.role}
                  </td>

                  <td className="space-x-2 px-6 py-4 text-center">

                    <button
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}