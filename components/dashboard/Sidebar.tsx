"use client";

import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Users,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/services/auth";

type User = {
  name: string;
  role: string;
};

type SidebarProps = {
  user?: User;
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({
  user,
  open,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Pengajuan",
      href: "/dashboard/requests",
      icon: FileText,
    },
    {
      title: "Buat Pengajuan",
      href: "/dashboard/requests/create",
      icon: Plus,
    },
  ];

  if (
    user?.role === "manager" ||
    user?.role === "admin"
  ) {
    menu.push({
      title: "Approval",
      href: "/dashboard/approvals",
      icon: CheckCircle2,
    });
  }

  if (user?.role === "admin") {
    menu.push({
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
    });
  }

  menu.push({
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  });

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-bold text-[#0B4EA2]">
            Approval Workflow
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            PT DAHANA
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                  active
                    ? "bg-[#0B4EA2] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={19} />
                {item.title}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B4EA2] font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() ??
                "U"}
            </div>

            <div>
              <p className="font-semibold">
                {user?.name ?? "User"}
              </p>

              <p className="text-xs capitalize text-slate-500">
                {user?.role ?? "-"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}