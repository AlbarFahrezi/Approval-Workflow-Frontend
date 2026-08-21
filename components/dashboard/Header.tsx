"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Menu,
  Bell,
  BellOff,
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
  RefreshCw,
} from "lucide-react";

import { useRouter } from "next/navigation";

import type {
  ApprovalRequest,
} from "@/types/approvalRequest";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type BackendNotification,
} from "@/services/notification";

type UserData = {
  name: string;
  role: string;
  avatar?: string | null;
  avatar_url?: string | null;
};

type NotificationItem = {
  id: string;

  type:
    | "approved"
    | "rejected"
    | "pending";

  title: string;
  description: string;
  time: string;
  read: boolean;

  approvalRequestId?: number;
};

type HeaderProps = {
  user?: UserData;

  onOpenSidebar: () => void;

  search: string;

  onSearch: (
    value: string
  ) => void;

  approvalRequests?: ApprovalRequest[];

  onLogout?: () => void;
};

const NOTIFICATION_SETTING_KEY =
  "approval_notifications_enabled";

export default function Header({
  user,
  onOpenSidebar,
  search,
  onSearch,
  approvalRequests = [],
  onLogout,
}: HeaderProps) {
  const router = useRouter();

  const [
    currentTime,
    setCurrentTime,
  ] = useState("");

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [
    showProfile,
    setShowProfile,
  ] = useState(false);

  const [
    showSearchResults,
    setShowSearchResults,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<
    NotificationItem[]
  >([]);

  const [
    notificationLoading,
    setNotificationLoading,
  ] = useState(false);

  const [
    notificationsEnabled,
    setNotificationsEnabled,
  ] = useState(true);

  const notificationRef =
    useRef<HTMLDivElement>(
      null
    );

  const profileRef =
    useRef<HTMLDivElement>(
      null
    );

  const searchRef =
    useRef<HTMLDivElement>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | LOAD NOTIFICATION SETTING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const savedSetting =
      localStorage.getItem(
        NOTIFICATION_SETTING_KEY
      );

    if (
      savedSetting === "false"
    ) {
      setNotificationsEnabled(
        false
      );
    } else {
      setNotificationsEnabled(
        true
      );
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CURRENT TIME
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleString(
          "id-ID",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      );
    };

    update();

    const interval =
      setInterval(
        update,
        60000
      );

    return () =>
      clearInterval(
        interval
      );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | GREETING
  |--------------------------------------------------------------------------
  */

  const greeting =
    useMemo(() => {
      const hour =
        new Date().getHours();

      if (hour < 11) {
        return "Selamat Pagi";
      }

      if (hour < 15) {
        return "Selamat Siang";
      }

      if (hour < 18) {
        return "Selamat Sore";
      }

      return "Selamat Malam";
    }, []);

  /*
  |--------------------------------------------------------------------------
  | SEARCH RESULTS
  |--------------------------------------------------------------------------
  */

  const searchResults =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return [];
      }

      return approvalRequests
        .filter(
          (request) => {
            const title =
              request.title
                ?.toLowerCase() ??
              "";

            const description =
              request.description
                ?.toLowerCase() ??
              "";

            const status =
              request.status
                ?.toLowerCase() ??
              "";

            const id =
              String(
                request.id
              ).toLowerCase();

            return (
              title.includes(
                keyword
              ) ||
              description.includes(
                keyword
              ) ||
              status.includes(
                keyword
              ) ||
              id.includes(
                keyword
              )
            );
          }
        )
        .slice(0, 5);
    }, [
      search,
      approvalRequests,
    ]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH RESULT CLICK
  |--------------------------------------------------------------------------
  */

  const handleSearchResultClick =
    (
      request:
        ApprovalRequest
    ) => {
      setShowSearchResults(
        false
      );

      onSearch("");

      router.push(
        `/dashboard/requests/${request.id}`
      );
    };

  /*
  |--------------------------------------------------------------------------
  | FORMAT BACKEND NOTIFICATION
  |--------------------------------------------------------------------------
  */

  const formatNotification =
    (
      notification:
        BackendNotification
    ): NotificationItem => {
      const status =
        notification.data.status;

      let type:
        NotificationItem["type"] =
          "pending";

      if (
        status === "approved"
      ) {
        type = "approved";
      } else if (
        status === "rejected"
      ) {
        type = "rejected";
      }

      return {
        id:
          notification.id,

        type,

        title:
          notification.data.title ??
          "Notifikasi Approval",

        description:
          notification.data.message ??
          "Ada aktivitas approval baru.",

        time:
          new Date(
            notification.created_at
          ).toLocaleString(
            "id-ID",
            {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),

        read:
          notification.read_at !==
          null,

        approvalRequestId:
          notification.data
            .approval_request_id,
      };
    };

  /*
  |--------------------------------------------------------------------------
  | LOAD NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  const loadNotifications =
    async () => {
      if (
        !notificationsEnabled ||
        !user
      ) {
        return;
      }

      try {
        setNotificationLoading(
          true
        );

        const data =
          await getNotifications();

        setNotifications(
          data.map(
            formatNotification
          )
        );
      } catch (error) {
        console.error(
          "Gagal mengambil notifications:",
          error
        );
      } finally {
        setNotificationLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD + AUTO REFRESH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !user ||
      !notificationsEnabled
    ) {
      return;
    }

    void loadNotifications();

    const interval =
      setInterval(() => {
        void loadNotifications();
      }, 30000);

    return () =>
      clearInterval(
        interval
      );
  }, [
    user,
    notificationsEnabled,
  ]);

  /*
  |--------------------------------------------------------------------------
  | UNREAD COUNT
  |--------------------------------------------------------------------------
  */

  const unreadCount =
    notificationsEnabled
      ? notifications.filter(
          (
            notification
          ) =>
            !notification.read
        ).length
      : 0;

  /*
  |--------------------------------------------------------------------------
  | TOGGLE NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  const toggleNotifications =
    () => {
      const nextValue =
        !notificationsEnabled;

      setNotificationsEnabled(
        nextValue
      );

      localStorage.setItem(
        NOTIFICATION_SETTING_KEY,
        String(nextValue)
      );

      if (!nextValue) {
        setNotifications([]);

        setShowNotifications(
          false
        );

        return;
      }

      void loadNotifications();
    };

  /*
  |--------------------------------------------------------------------------
  | CLICK OUTSIDE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleClickOutside =
      (
        event:
          MouseEvent
      ) => {
        const target =
          event.target as Node;

        if (
          notificationRef.current &&
          !notificationRef.current.contains(
            target
          )
        ) {
          setShowNotifications(
            false
          );
        }

        if (
          profileRef.current &&
          !profileRef.current.contains(
            target
          )
        ) {
          setShowProfile(
            false
          );
        }

        if (
          searchRef.current &&
          !searchRef.current.contains(
            target
          )
        ) {
          setShowSearchResults(
            false
          );
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

  const getNotificationIcon =
    (
      type:
        NotificationItem["type"]
    ) => {
      if (
        type === "approved"
      ) {
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">

            <CheckCircle2
              size={19}
            />

          </div>
        );
      }

      if (
        type === "rejected"
      ) {
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

            <XCircle
              size={19}
            />

          </div>
        );
      }

      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">

          <Clock3
            size={19}
          />

        </div>
      );
    };

  /*
  |--------------------------------------------------------------------------
  | MARK ALL AS READ
  |--------------------------------------------------------------------------
  */

  const markAllAsRead =
    async () => {
      try {
        await markAllNotificationsAsRead();

        setNotifications(
          (current) =>
            current.map(
              (
                notification
              ) => ({
                ...notification,
                read: true,
              })
            )
        );
      } catch (error) {
        console.error(
          "Gagal menandai semua notifikasi:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | MARK SINGLE AS READ
  |--------------------------------------------------------------------------
  */

  const markAsRead =
    async (
      id: string
    ) => {
      try {
        await markNotificationAsRead(
          id
        );

        setNotifications(
          (current) =>
            current.map(
              (
                notification
              ) =>
                notification.id === id
                  ? {
                      ...notification,
                      read: true,
                    }
                  : notification
            )
        );
      } catch (error) {
        console.error(
          "Gagal menandai notifikasi:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CLICK NOTIFICATION
  |--------------------------------------------------------------------------
  */

  const handleNotificationClick =
    async (
      notification:
        NotificationItem
    ) => {
      if (
        !notification.read
      ) {
        await markAsRead(
          notification.id
        );
      }

      setShowNotifications(
        false
      );

      if (
        notification.approvalRequestId
      ) {
        router.push(
          `/dashboard/requests/${notification.approvalRequestId}`
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | PROFILE
  |--------------------------------------------------------------------------
  */

  const openProfile = () => {
    setShowProfile(
      false
    );

    router.push(
      "/profile"
    );
  };

  const openSettings = () => {
    setShowProfile(
      false
    );

    router.push(
      "/settings"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    setShowProfile(
      false
    );

    if (onLogout) {
      onLogout();

      return;
    }

    router.push(
      "/login"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | AVATAR
  |--------------------------------------------------------------------------
  */

  const avatarUrl =
    user?.avatar_url ?? null;

  const initial =
    user?.name
      ?.charAt(0)
      .toUpperCase() ?? "U";

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">

      <div className="flex min-h-[92px] items-center justify-between px-4 pr-6 lg:px-0 lg:pr-8">

        {/* ================================================================ */}
        {/* LEFT SIDE */}
        {/* ================================================================ */}

        <div className="flex min-w-0 items-center">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={
              onOpenSidebar
            }
            className="ml-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-label="Buka menu"
          >

            <Menu size={19} />

          </button>

          {/* MOBILE TITLE */}

          <div className="ml-3 min-w-0 lg:hidden">

            <p className="truncate text-sm font-semibold text-[#0B4EA2]">

              System Approval

            </p>

            <p className="text-[11px] text-slate-400">

              PT DAHANA

            </p>

          </div>

          {/* ============================================================ */}
          {/* DESKTOP GREETING */}
          {/* ============================================================ */}

          <div className="hidden items-stretch lg:flex">

            {/* ACCENT */}

            <div className="w-1.5 shrink-0 bg-gradient-to-b from-[#0B4EA2] via-[#1677D2] to-[#4DA3FF]" />

            {/* GREETING CONTENT */}

            <div className="flex min-h-[92px] items-center pl-6">

              <div className="flex flex-col justify-center">

                {/* GREETING */}

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />

                  <p className="text-sm font-medium text-slate-500">

                    {greeting}

                  </p>

                </div>

                {/* NAME */}

                <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">

                  {user?.name ??
                    "User"}

                </h1>

                {/* TIME + ROLE */}

                <div className="mt-0.5 flex items-center gap-2">

                  <p className="text-xs text-slate-400">

                    {currentTime}

                  </p>

                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold capitalize text-[#0B4EA2]">

                    {user?.role ??
                      "-"}

                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================================ */}
        {/* RIGHT SIDE */}
        {/* ================================================================ */}

        <div className="flex items-center gap-3">

          {/* ============================================================ */}
          {/* SEARCH */}
          {/* ============================================================ */}

          <div
            ref={searchRef}
            className="relative hidden lg:block"
          >

            <div
              className={`flex items-center rounded-2xl border bg-slate-50 px-4 py-3 transition ${
                showSearchResults &&
                search.trim()
                  ? "border-blue-300 ring-2 ring-blue-100"
                  : "border-slate-200"
              }`}
            >

              <Search
                size={17}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Cari request..."
                value={search}
                onFocus={() => {
                  if (
                    search.trim()
                  ) {
                    setShowSearchResults(
                      true
                    );
                  }
                }}
                onChange={(
                  event
                ) => {
                  const value =
                    event.target.value;

                  onSearch(
                    value
                  );

                  setShowSearchResults(
                    value.trim()
                      .length > 0
                  );
                }}
                className="ml-3 w-64 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

              {search && (

                <button
                  type="button"
                  onClick={() => {
                    onSearch("");

                    setShowSearchResults(
                      false
                    );
                  }}
                  className="ml-2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  title="Clear search"
                >

                  <X size={15} />

                </button>

              )}

            </div>

            {/* SEARCH DROPDOWN */}

            {showSearchResults &&
              search.trim() && (

                <div className="absolute right-0 top-[58px] z-50 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                  {/* HEADER */}

                  <div className="border-b border-slate-100 px-5 py-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

                      Hasil Pencarian

                    </p>

                    <p className="mt-1 text-sm text-slate-500">

                      {searchResults.length >
                      0
                        ? `${searchResults.length} request ditemukan`
                        : "Tidak ada request yang cocok"}

                    </p>

                  </div>

                  {/* RESULTS */}

                  {searchResults.length >
                  0 ? (

                    <div className="max-h-[360px] overflow-y-auto">

                      {searchResults.map(
                        (
                          request
                        ) => (

                          <button
                            key={
                              request.id
                            }
                            type="button"
                            onClick={() =>
                              handleSearchResultClick(
                                request
                              )
                            }
                            className="flex w-full items-start gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-blue-50"
                          >

                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B4EA2]">

                              <Search
                                size={17}
                              />

                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-3">

                                <p className="truncate text-sm font-semibold text-slate-800">

                                  {
                                    request.title
                                  }

                                </p>

                                <span
                                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                    request.status ===
                                    "approved"
                                      ? "bg-green-100 text-green-700"
                                      : request.status ===
                                        "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : request.status ===
                                        "submitted"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >

                                  {
                                    request.status
                                  }

                                </span>

                              </div>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">

                                {
                                  request.description
                                }

                              </p>

                              <p className="mt-2 text-[11px] text-slate-400">

                                Request #
                                {
                                  request.id
                                }

                              </p>

                            </div>

                            <ChevronDown
                              size={16}
                              className="mt-2 shrink-0 -rotate-90 text-slate-300"
                            />

                          </button>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="px-5 py-10 text-center">

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">

                        <Search
                          size={22}
                          className="text-slate-400"
                        />

                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700">

                        Request tidak ditemukan

                      </p>

                      <p className="mt-1 text-xs text-slate-400">

                        Coba gunakan kata kunci lain.

                      </p>

                    </div>

                  )}

                  {/* FOOTER */}

                  {searchResults.length >
                    0 && (

                    <div className="border-t border-slate-200 p-3">

                      <button
                        type="button"
                        onClick={() => {
                          setShowSearchResults(
                            false
                          );

                          router.push(
                            "/dashboard/requests"
                          );
                        }}
                        className="w-full rounded-xl py-2.5 text-sm font-semibold text-[#0B4EA2] transition hover:bg-blue-50"
                      >

                        Lihat Semua Request →

                      </button>

                    </div>

                  )}

                </div>

              )}

          </div>

          {/* ============================================================ */}
          {/* NOTIFICATION */}
          {/* ============================================================ */}

          <div
            ref={
              notificationRef
            }
            className="relative"
          >

            <button
              type="button"
              onClick={() => {
                if (
                  !notificationsEnabled
                ) {
                  toggleNotifications();

                  return;
                }

                setShowNotifications(
                  (current) =>
                    !current
                );

                setShowProfile(
                  false
                );
              }}
              className={`relative rounded-2xl border p-3 transition ${
                notificationsEnabled
                  ? showNotifications
                    ? "border-blue-200 bg-blue-50 text-[#0B4EA2]"
                    : "border-slate-200 bg-white hover:bg-slate-100"
                  : "border-slate-300 bg-slate-100 text-slate-400"
              }`}
              title={
                notificationsEnabled
                  ? "Notifikasi aktif"
                  : "Notifikasi mati — klik untuk mengaktifkan"
              }
            >

              {notificationsEnabled ? (

                <Bell
                  size={19}
                />

              ) : (

                <BellOff
                  size={19}
                />

              )}

              {notificationsEnabled &&
                unreadCount >
                  0 && (

                  <>

                    <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-ping rounded-full bg-red-400 opacity-70" />

                    <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">

                      {unreadCount >
                      99
                        ? "99+"
                        : unreadCount}

                    </span>

                  </>

                )}

            </button>

            {showNotifications &&
              notificationsEnabled && (

                <div className="absolute right-0 top-[58px] z-50 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                  <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                    <div>

                      <h3 className="text-base font-semibold text-slate-900">

                        Notifikasi

                      </h3>

                      <p className="mt-1 text-xs text-slate-400">

                        {unreadCount >
                        0
                          ? `${unreadCount} notifikasi belum dibaca`
                          : "Semua sudah dibaca"}

                      </p>

                    </div>

                    <div className="flex items-center gap-2">

                      {unreadCount >
                        0 && (

                        <button
                          type="button"
                          onClick={() =>
                            void markAllAsRead()
                          }
                          className="flex items-center gap-1 text-xs font-semibold text-[#0B4EA2] hover:underline"
                        >

                          <Check
                            size={14}
                          />

                          Tandai dibaca

                        </button>

                      )}

                      <button
                        type="button"
                        onClick={
                          toggleNotifications
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        title="Matikan notifikasi"
                      >

                        <BellOff
                          size={16}
                        />

                      </button>

                    </div>

                  </div>

                  <div className="max-h-[390px] overflow-y-auto">

                    {notificationLoading ? (

                      <div className="px-5 py-10 text-center">

                        <RefreshCw
                          size={24}
                          className="mx-auto animate-spin text-slate-400"
                        />

                        <p className="mt-3 text-sm text-slate-500">

                          Memuat notifikasi...

                        </p>

                      </div>

                    ) : notifications.length ===
                      0 ? (

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
                        (
                          notification
                        ) => (

                          <button
                            key={
                              notification.id
                            }
                            type="button"
                            onClick={() =>
                              void handleNotificationClick(
                                notification
                              )
                            }
                            className={`flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${
                              !notification.read
                                ? "bg-blue-50/50"
                                : "bg-white"
                            }`}
                          >

                            {getNotificationIcon(
                              notification.type
                            )}

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p className="text-sm font-semibold text-slate-800">

                                  {
                                    notification.title
                                  }

                                </p>

                                {!notification.read && (

                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                                )}

                              </div>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">

                                {
                                  notification.description
                                }

                              </p>

                              <p className="mt-2 text-[11px] text-slate-400">

                                {
                                  notification.time
                                }

                              </p>

                            </div>

                          </button>

                        )
                      )

                    )}

                  </div>

                  <div className="border-t border-slate-200 p-3">

                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(
                          false
                        );

                        router.push(
                          "/notifications"
                        );
                      }}
                      className="w-full rounded-xl py-2.5 text-sm font-semibold text-[#0B4EA2] transition hover:bg-blue-50"
                    >

                      Lihat Semua Notifikasi

                    </button>

                  </div>

                </div>

              )}

          </div>

          {/* ============================================================ */}
          {/* PROFILE */}
          {/* ============================================================ */}

          <div
            ref={profileRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() => {
                setShowProfile(
                  (current) =>
                    !current
                );

                setShowNotifications(
                  false
                );
              }}
              className={`group flex items-center gap-3 rounded-2xl border bg-white px-3 py-2 transition ${
                showProfile
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >

              {avatarUrl ? (

                <img
                  src={avatarUrl}
                  alt={
                    user?.name ??
                    "User"
                  }
                  className="h-11 w-11 rounded-2xl object-cover shadow"
                />

              ) : (

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B4EA2] font-semibold text-white shadow">

                  {initial}

                </div>

              )}

              <div className="hidden text-left xl:block">

                <p className="text-sm font-semibold text-slate-800">

                  {user?.name ??
                    "User"}

                </p>

                <p className="text-xs capitalize text-slate-500">

                  {user?.role ??
                    "-"}

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

            {showProfile && (

              <div className="absolute right-0 top-[58px] z-50 w-[250px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                <div className="border-b border-slate-100 px-4 py-4">

                  <div className="flex items-center gap-3">

                    {avatarUrl ? (

                      <img
                        src={avatarUrl}
                        alt={
                          user?.name ??
                          "User"
                        }
                        className="h-12 w-12 rounded-xl object-cover"
                      />

                    ) : (

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B4EA2] font-semibold text-white">

                        {initial}

                      </div>

                    )}

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-800">

                        {user?.name ??
                          "User"}

                      </p>

                      <p className="mt-1 text-xs capitalize text-slate-400">

                        {user?.role ??
                          "-"}

                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-2">

                  <button
                    type="button"
                    onClick={
                      openProfile
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >

                    <User
                      size={18}
                      className="text-slate-400"
                    />

                    Profile

                  </button>

                  <button
                    type="button"
                    onClick={
                      openSettings
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >

                    <Settings
                      size={18}
                      className="text-slate-400"
                    />

                    Settings

                  </button>

                </div>

                <div className="border-t border-slate-100 p-2">

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >

                    <LogOut
                      size={18}
                    />

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