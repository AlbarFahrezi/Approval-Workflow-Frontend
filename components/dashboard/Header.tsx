"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  X,
  CheckCircle2,
  XCircle,
  Clock3,
  User,
  Settings,
  LogOut,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

type UserData = {
  name: string;
  role: string;
  avatar?: string | null;
};

type NotificationItem = {
  id: number;
  type: "approved" | "rejected" | "pending";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

type HeaderProps = {
  user?: UserData;
  onOpenSidebar: () => void;
  search: string;
  onSearch: (value: string) => void;
  onLogout?: () => void;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "rejected",
    title: "Request Ditolak",
    description:
      'Pembelian Monitor 2K ditolak karena alasan tertentu.',
    time: "2 jam lalu",
    read: false,
  },
  {
    id: 2,
    type: "pending",
    title: "Request Menunggu Approval",
    description:
      "Terdapat request baru yang membutuhkan approval.",
    time: "3 jam lalu",
    read: false,
  },
  {
    id: 3,
    type: "approved",
    title: "Request Disetujui",
    description:
      "Request Pembelian Keyboard telah disetujui.",
    time: "Kemarin",
    read: true,
  },
];

export default function Header({
  user,
  onOpenSidebar,
  search,
  onSearch,
  onLogout,
}: HeaderProps) {
  const router = useRouter();

  const [currentTime, setCurrentTime] = useState("");

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >(initialNotifications);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /*
  |--------------------------------------------------------------------------
  | CURRENT TIME
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update();

    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | GREETING
  |--------------------------------------------------------------------------
  */

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";

    return "Selamat Malam";
  }, []);

  /*
  |--------------------------------------------------------------------------
  | UNREAD NOTIFICATION
  |--------------------------------------------------------------------------
  */

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  /*
  |--------------------------------------------------------------------------
  | CLOSE DROPDOWN WHEN CLICK OUTSIDE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION ICON
  |--------------------------------------------------------------------------
  */

  const getNotificationIcon = (
    type: NotificationItem["type"]
  ) => {
    if (type === "approved") {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
          <CheckCircle2 size={19} />
        </div>
      );
    }

    if (type === "rejected") {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <XCircle size={19} />
        </div>
      );
    }

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
        <Clock3 size={19} />
      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | MARK ALL NOTIFICATIONS AS READ
  |--------------------------------------------------------------------------
  */

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  /*
  |--------------------------------------------------------------------------
  | MARK SINGLE NOTIFICATION
  |--------------------------------------------------------------------------
  */

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PROFILE NAVIGATION
  |--------------------------------------------------------------------------
  */

  const openProfile = () => {
    setShowProfile(false);
    router.push("/profile");
  };

  const openSettings = () => {
    setShowProfile(false);
    router.push("/settings");
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    setShowProfile(false);

    if (onLogout) {
      onLogout();
      return;
    }

    router.push("/login");
  };

  /*
  |--------------------------------------------------------------------------
  | AVATAR
  |--------------------------------------------------------------------------
  */

  const avatarUrl = user?.avatar;

  const initial =
    user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-[82px] items-center justify-between px-6 lg:px-8">

        {/* ============================================================
            LEFT
        ============================================================ */}

        <div className="flex items-center gap-5">

          {/* MOBILE MENU */}

          <button
            onClick={onOpenSidebar}
            className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* GREETING */}

          <div>
            <p className="text-sm text-slate-500">
              {greeting},
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {user?.name ?? "User"}
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              {currentTime}
            </p>
          </div>
        </div>

        {/* ============================================================
            RIGHT
        ============================================================ */}

        <div className="flex items-center gap-3">

          {/* ==========================================================
              SEARCH
          ========================================================== */}

          <div className="hidden items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:flex">

            <Search
              size={17}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari request..."
              value={search}
              onChange={(e) =>
                onSearch(e.target.value)
              }
              className="ml-3 w-64 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

            {/* CLEAR SEARCH */}

            {search && (
              <button
                onClick={() => onSearch("")}
                className="ml-2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* ==========================================================
              NOTIFICATION
          ========================================================== */}

          <div
            ref={notificationRef}
            className="relative"
          >

            <button
              onClick={() => {
                setShowNotifications(
                  (current) => !current
                );

                setShowProfile(false);
              }}
              className={`relative rounded-2xl border p-3 transition ${
                showNotifications
                  ? "border-blue-200 bg-blue-50 text-[#0B4EA2]"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
              title="Notifikasi"
            >
              <Bell size={19} />

              {/* BADGE */}

              {unreadCount > 0 && (
                <>
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-ping rounded-full bg-red-400 opacity-70" />

                  <span className="absolute right-2 top-2 flex h-2.5 min-w-2.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white" />
                </>
              )}
            </button>

            {/* ========================================================
                NOTIFICATION DROPDOWN
            ======================================================== */}

            {showNotifications && (
              <div className="absolute right-0 top-[58px] w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Notifikasi
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {unreadCount > 0
                        ? `${unreadCount} notifikasi belum dibaca`
                        : "Semua sudah dibaca"}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs font-semibold text-[#0B4EA2] hover:underline"
                    >
                      <Check size={14} />
                      Tandai dibaca
                    </button>
                  )}
                </div>

                {/* NOTIFICATION LIST */}

                <div className="max-h-[390px] overflow-y-auto">

                  {notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <Bell
                        size={30}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-medium text-slate-500">
                        Tidak ada notifikasi
                      </p>
                    </div>
                  ) : (
                    notifications.map(
                      (notification) => (
                        <button
                          key={notification.id}
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                          className={`flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${
                            !notification.read
                              ? "bg-slate-50/80"
                              : "bg-white"
                          }`}
                        >

                          {getNotificationIcon(
                            notification.type
                          )}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <p className="text-sm font-semibold text-slate-800">
                                {notification.title}
                              </p>

                              {!notification.read && (
                                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                              )}
                            </div>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                              {notification.description}
                            </p>

                            <p className="mt-2 text-[11px] text-slate-400">
                              {notification.time}
                            </p>

                          </div>
                        </button>
                      )
                    )
                  )}
                </div>

                {/* FOOTER */}

                <div className="border-t border-slate-200 p-3">

                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      router.push("/notifications");
                    }}
                    className="w-full rounded-xl py-2.5 text-sm font-semibold text-[#0B4EA2] transition hover:bg-blue-50"
                  >
                    Lihat Semua Notifikasi
                  </button>

                </div>
              </div>
            )}
          </div>

          {/* ==========================================================
              PROFILE
          ========================================================== */}

          <div
            ref={profileRef}
            className="relative"
          >

            <button
              onClick={() => {
                setShowProfile(
                  (current) => !current
                );

                setShowNotifications(false);
              }}
              className={`group flex items-center gap-3 rounded-2xl border bg-white px-3 py-2 transition ${
                showProfile
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >

              {/* AVATAR */}

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name ?? "User"}
                  className="h-11 w-11 rounded-2xl object-cover shadow"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B4EA2] font-semibold text-white shadow">
                  {initial}
                </div>
              )}

              {/* NAME */}

              <div className="hidden text-left xl:block">

                <p className="text-sm font-semibold text-slate-800">
                  {user?.name ?? "User"}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {user?.role ?? "-"}
                </p>

              </div>

              <ChevronDown
                size={18}
                className={`text-slate-400 transition ${
                  showProfile
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ========================================================
                PROFILE DROPDOWN
            ======================================================== */}

            {showProfile && (
              <div className="absolute right-0 top-[58px] w-[250px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* PROFILE INFO */}

                <div className="border-b border-slate-100 px-4 py-4">

                  <div className="flex items-center gap-3">

                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.name ?? "User"}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B4EA2] font-semibold text-white">
                        {initial}
                      </div>
                    )}

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {user?.name ?? "User"}
                      </p>

                      <p className="mt-1 text-xs capitalize text-slate-400">
                        {user?.role ?? "-"}
                      </p>

                    </div>

                  </div>
                </div>

                {/* MENU */}

                <div className="p-2">

                  <button
                    onClick={openProfile}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <User
                      size={18}
                      className="text-slate-400"
                    />

                    Profile
                  </button>

                  <button
                    onClick={openSettings}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <Settings
                      size={18}
                      className="text-slate-400"
                    />

                    Settings
                  </button>

                </div>

                {/* LOGOUT */}

                <div className="border-t border-slate-100 p-2">

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />

                    Logout
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}