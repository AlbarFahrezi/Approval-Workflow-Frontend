"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Users,
  ShieldCheck,
  UserRound,
  Pencil,
  Trash2,
  LayoutDashboard,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import {
  getUsers,
  deleteUser,
} from "@/services/user";

import type { User } from "@/types/user";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus user ini?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      toast.success("User berhasil dihapus.");

      await loadUsers();
    } catch (error) {
      console.error(error);

      toast.error("Gagal menghapus user.");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.role.toLowerCase().includes(keyword)
    );
  });

  const totalUsers = users.length;

  const totalManagers = users.filter(
    (user) => user.role.toLowerCase() === "manager"
  ).length;

  const totalEmployees = users.filter(
    (user) => user.role.toLowerCase() === "employee"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role.toLowerCase() === "admin"
  ).length;

  return (
    <div className="min-h-full bg-[#f5f8fc] px-4 py-5 sm:px-6 lg:px-8">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B4EA2] via-[#1468b8] to-[#1495b0] px-5 py-6 text-white shadow-lg sm:px-7 sm:py-7">

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute -bottom-24 right-16 h-40 w-40 rounded-full bg-cyan-300/10" />

        <div className="pointer-events-none absolute left-[42%] -top-16 h-28 w-28 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Title */}
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <Users size={27} strokeWidth={1.8} />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                  Administration
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                User Management
              </h1>

              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Kelola akun, role, dan akses pengguna pada sistem approval.
              </p>
            </div>

          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap gap-2">

            <button
              onClick={() => router.push("/dashboard")}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                border border-white/20
                bg-white/10
                px-4 py-2.5
                text-sm font-semibold
                text-white
                backdrop-blur-sm
                transition
                hover:bg-white/20
              "
            >
              <LayoutDashboard size={17} />
              Dashboard
            </button>

            <button
              onClick={() => router.push("/dashboard/users/create")}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                bg-white
                px-4 py-2.5
                text-sm font-bold
                text-[#0B4EA2]
                shadow-sm
                transition
                hover:bg-slate-50
                active:scale-[0.98]
              "
            >
              <Plus size={17} />
              Tambah User
            </button>

          </div>

        </div>
      </section>


      {/* =====================================================
          STATISTICS
      ====================================================== */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total User
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalUsers}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Akun terdaftar
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0B4EA2]">
              <Users size={22} />
            </div>

          </div>

        </div>


        {/* Admin */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Admin
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalAdmins}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Akses administrator
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ShieldCheck size={22} />
            </div>

          </div>

        </div>


        {/* Manager */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Manager
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalManagers}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Akses persetujuan
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <ShieldCheck size={22} />
            </div>

          </div>

        </div>


        {/* Employee */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Employee
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {totalEmployees}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Pengguna operasional
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <UserRound size={22} />
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          USER LIST
      ====================================================== */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Daftar Pengguna
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Menampilkan {filteredUsers.length} dari {users.length} pengguna.
              </p>
            </div>

            <button
              onClick={loadUsers}
              disabled={loading}
              className="
                inline-flex w-fit items-center gap-2
                rounded-xl
                border border-slate-200
                bg-white
                px-3.5 py-2.5
                text-sm font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

          </div>


          {/* Search */}
          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama, email, atau role..."
              className="
                h-12 w-full
                rounded-xl
                border border-slate-200
                bg-slate-50
                pl-11 pr-4
                text-sm text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-[#0B4EA2]
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            />

          </div>

        </div>


        {/* =====================================================
            LOADING
        ====================================================== */}
        {loading ? (

          <div className="flex min-h-[350px] items-center justify-center">

            <div className="flex flex-col items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Loader2
                  size={25}
                  className="animate-spin text-[#0B4EA2]"
                />
              </div>

              <p className="text-sm text-slate-400">
                Memuat data pengguna...
              </p>

            </div>

          </div>

        ) : filteredUsers.length === 0 ? (

          /* =====================================================
              EMPTY STATE
          ====================================================== */
          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={28} />
            </div>

            <h3 className="text-lg font-bold text-slate-700">
              Tidak ada pengguna
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
              {search
                ? "Pengguna yang sesuai dengan pencarian tidak ditemukan."
                : "Belum ada pengguna yang terdaftar pada sistem."}
            </p>

          </div>

        ) : (

          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================== */}
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Pengguna
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Role
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="
                        border-b border-slate-100
                        last:border-b-0
                        transition
                        hover:bg-slate-50/70
                      "
                    >

                      {/* User */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f0fa] font-bold text-[#0B4EA2]">
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-700">
                              {user.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              ID #{user.id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Email */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-slate-500">

                          <Mail size={15} className="text-slate-400" />

                          <span>
                            {user.email}
                          </span>

                        </div>

                      </td>


                      {/* Role */}
                      <td className="px-6 py-5">

                        <RoleBadge role={user.role} />

                      </td>


                      {/* Actions */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          {/* EDIT - kiri desktop */}
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/users/${user.id}/edit`
                              )
                            }
                            className="
                              inline-flex items-center gap-2
                              rounded-xl
                              bg-blue-50
                              px-4 py-2.5
                              text-sm font-semibold
                              text-[#0B4EA2]
                              transition
                              hover:bg-blue-100
                              active:scale-[0.98]
                            "
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          {/* DELETE - kanan desktop */}
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="
                              inline-flex items-center gap-2
                              rounded-xl
                              bg-red-50
                              px-4 py-2.5
                              text-sm font-semibold
                              text-red-600
                              transition
                              hover:bg-red-100
                              active:scale-[0.98]
                            "
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* =================================================
                MOBILE CARD
            ================================================== */}
            <div className="divide-y divide-slate-100 md:hidden">

              {filteredUsers.map((user) => (

                <div
                  key={user.id}
                  className="p-4 transition hover:bg-slate-50/70"
                >

                  {/* User information */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f0fa] font-bold text-[#0B4EA2]">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-slate-700">
                          {user.name}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">

                          <Mail size={13} />

                          <span className="truncate">
                            {user.email}
                          </span>

                        </div>

                      </div>

                    </div>

                    <RoleBadge role={user.role} />

                  </div>


                  {/* Actions */}
                  <div className="mt-4 flex gap-2">

                    {/* DELETE
                        Mobile = KIRI
                    */}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="
                        flex flex-1
                        items-center justify-center gap-2
                        rounded-xl
                        bg-red-50
                        px-4 py-2.5
                        text-sm font-semibold
                        text-red-600
                        transition
                        hover:bg-red-100
                        active:scale-[0.98]
                      "
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>


                    {/* EDIT
                        Mobile = KANAN
                    */}
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/users/${user.id}/edit`
                        )
                      }
                      className="
                        flex flex-1
                        items-center justify-center gap-2
                        rounded-xl
                        bg-blue-50
                        px-4 py-2.5
                        text-sm font-semibold
                        text-[#0B4EA2]
                        transition
                        hover:bg-blue-100
                        active:scale-[0.98]
                      "
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}


        {/* =====================================================
            FOOTER
        ====================================================== */}
        {!loading && filteredUsers.length > 0 && (

          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span>
                Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </span>

            </div>

            <span className="font-medium text-slate-400">
              User Management · Internal System
            </span>

          </div>

        )}

      </section>


      {/* =====================================================
          BOTTOM BRAND
      ====================================================== */}
      <div className="flex items-center justify-between px-2 pt-5 text-[10px] uppercase tracking-[0.12em] text-slate-400">

        <span>
          Approval Workflow System
        </span>

        <span>
          Internal Enterprise System · PT DAHANA
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   ROLE BADGE
============================================================ */

function RoleBadge({ role }: { role: string }) {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-600">
        <ShieldCheck size={13} />
        Admin
      </span>
    );
  }

  if (normalizedRole === "manager") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-orange-600">
        <ShieldCheck size={13} />
        Manager
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-bold text-cyan-600">
      <UserRound size={13} />
      Employee
    </span>
  );
}