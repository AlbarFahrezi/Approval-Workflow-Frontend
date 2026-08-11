"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock3,
  Check,
} from "lucide-react";

type NotificationItem = {
  id: number;
  type: "approved" | "rejected" | "pending";
  title: string;
  description: string;
  time: string;
  read: boolean;
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

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      initialNotifications
    );

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
      )
    );
  };

  const getIcon = (
    type: NotificationItem["type"]
  ) => {
    if (type === "approved") {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
          <CheckCircle2 size={22} />
        </div>
      );
    }

    if (type === "rejected") {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <XCircle size={22} />
        </div>
      );
    }

    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
        <Clock3 size={22} />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">

      {/* HEADER */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#0B4EA2]">
              <Bell size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Notifikasi
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Semua aktivitas terbaru Approval Workflow
              </p>
            </div>

          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            <Check size={17} />

            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* SUMMARY */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Notifikasi
          </p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Belum Dibaca
          </p>

          <p className="mt-2 text-3xl font-semibold text-red-500">
            {unreadCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Sudah Dibaca
          </p>

          <p className="mt-2 text-3xl font-semibold text-green-600">
            {notifications.length - unreadCount}
          </p>
        </div>

      </div>

      {/* NOTIFICATION LIST */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Semua Notifikasi
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Riwayat aktivitas request dan approval.
          </p>

        </div>

        <div>

          {notifications.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <Bell
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Belum ada notifikasi.
              </p>

            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() =>
                  markAsRead(notification.id)
                }
                className={`flex w-full gap-4 border-b border-slate-100 px-6 py-5 text-left transition last:border-b-0 hover:bg-slate-50 ${
                  !notification.read
                    ? "bg-blue-50/40"
                    : "bg-white"
                }`}
              >

                {/* ICON */}

                {getIcon(notification.type)}

                {/* CONTENT */}

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {notification.description}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {notification.time}
                      </p>
                    </div>

                    {!notification.read && (
                      <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-600" />
                    )}

                  </div>

                </div>

              </button>
            ))
          )}

        </div>

      </div>

    </main>
  );
}