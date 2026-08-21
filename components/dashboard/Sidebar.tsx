"use client";

import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Users,
  LogOut,
  Plus,
  ChevronRight,
  X,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import { logout } from "@/services/auth";
import type { LucideIcon } from "lucide-react";

type User = {
  name: string;
  role: string;
  avatar?: string | null;
  avatar_url?: string | null;
};

type SidebarProps = {
  user?: User | null;
  open: boolean;
  onClose: () => void;
  pendingCount?: number;
};

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export default function Sidebar({
  user,
  open,
  onClose,
  pendingCount = 0,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  /*
  |--------------------------------------------------------------------------
  | USER AVATAR
  |--------------------------------------------------------------------------
  |
  | Prioritas:
  | 1. avatar_url dari API
  | 2. avatar path dari API
  | 3. initials
  |
  */

  const getAvatarUrl = () => {
    if (!user) {
      return null;
    }

    // URL lengkap dari Laravel
    if (user.avatar_url) {
      return user.avatar_url;
    }

    // Fallback apabila API hanya mengirim:
    // avatars/nama-file.jpg
    if (user.avatar) {
      if (
        user.avatar.startsWith("http://") ||
        user.avatar.startsWith("https://")
      ) {
        return user.avatar;
      }

      return `http://127.0.0.1:8000/storage/${user.avatar}`;
    }

    return null;
  };

  const avatarUrl = getAvatarUrl();

  const initial =
    user?.name?.charAt(0).toUpperCase() ?? "U";

  /*
  |--------------------------------------------------------------------------
  | MENU
  |--------------------------------------------------------------------------
  */

  const menu: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Requests",
      href: "/dashboard/requests",
      icon: FileText,
    },
    {
      title: "Buat Request",
      href: "/dashboard/requests/create",
      icon: Plus,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | APPROVAL MENU
  |--------------------------------------------------------------------------
  */

  if (
    user?.role === "manager" ||
    user?.role === "admin"
  ) {
    menu.push({
      title: "Approval",
      href: "/dashboard/approvals",
      icon: CheckCircle2,
      badge: pendingCount,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | ADMIN MENU
  |--------------------------------------------------------------------------
  */

  if (user?.role === "admin") {
    menu.push({
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}

      {open && (
        <div
          onClick={onClose}
          className="
            fixed inset-0
            z-40
            bg-slate-950/40
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[270px]
          flex-col
          border-r
          border-slate-200/80
          bg-white
          shadow-[8px_0_30px_rgba(15,23,42,0.04)]
          transition-transform
          duration-300
          lg:translate-x-0

          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =========================================================
            LOGO
        ========================================================= */}

        <div
          className="
            flex
            h-[92px]
            items-center
            justify-between
            border-b
            border-slate-100
            px-7
          "
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="
              group
              flex
              items-center
            "
          >
            <Image
              src="/dahana-logo.png"
              alt="Dahana"
              width={145}
              height={48}
              priority
              className="
                h-auto
                w-[145px]
                object-contain
                transition
                duration-300
                group-hover:scale-[1.02]
              "
            />
          </button>

          {/* MOBILE CLOSE */}

          <button
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* =========================================================
            SYSTEM LABEL
        ========================================================= */}

        <div className="px-6 pt-5">
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-slate-300
            "
          >
            Approval Workflow
          </p>
        </div>

        {/* =========================================================
            MENU
        ========================================================= */}

        <nav className="flex-1 px-4 py-3">
          <div className="space-y-1.5">
            {menu.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    transition-all
                    duration-200

                    ${
                      active
                        ? "bg-[#0B4EA2] text-white shadow-[0_8px_20px_rgba(11,78,162,0.18)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0B4EA2]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        transition

                        ${
                          active
                            ? "bg-white/15"
                            : "bg-slate-50 group-hover:bg-blue-50"
                        }
                      `}
                    >
                      <Icon size={17} />
                    </span>

                    <span
                      className={`
                        text-sm
                        font-medium

                        ${
                          active
                            ? "text-white"
                            : "text-slate-600 group-hover:text-[#0B4EA2]"
                        }
                      `}
                    >
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* BADGE */}

                    {item.badge !== undefined &&
                      item.badge > 0 && (
                        <span
                          className={`
                            flex
                            min-w-6
                            items-center
                            justify-center
                            rounded-full
                            px-1.5
                            py-0.5
                            text-[10px]
                            font-bold

                            ${
                              active
                                ? "bg-white text-[#0B4EA2]"
                                : "bg-red-500 text-white"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}

                    {/* ACTIVE ARROW */}

                    {active && (
                      <ChevronRight
                        size={15}
                        className="text-white/70"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* =========================================================
            BOTTOM USER
        ========================================================= */}

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              {/* =====================================================
                  AVATAR
              ===================================================== */}

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name ?? "User"}
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-xl
                    object-cover
                    shadow-sm
                    ring-1
                    ring-slate-200
                  "
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#0B4EA2]
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                  "
                >
                  {initial}
                </div>
              )}

              {/* =====================================================
                  USER INFO
              ===================================================== */}

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >
                  {user?.name ?? "User"}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    capitalize
                    text-slate-400
                  "
                >
                  {user?.role ?? "-"}
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================
              LOGOUT
          ========================================================= */}

          <button
            onClick={async () => {
              await logout();
            }}
            className="
              mt-3
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-slate-500
              transition

              hover:bg-red-50
              hover:text-red-600
            "
          >
            <LogOut size={17} />

            <span>Logout</span>
          </button>

          {/* =========================================================
              FOOTER
          ========================================================= */}

          <div className="mt-3 px-2">
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-slate-300
              "
            >
              PT Dahana
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}