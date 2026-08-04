"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

type User = {
  name: string;
  role: string;
};

type HeaderProps = {
  user?: User;
  onOpenSidebar: () => void;
  search: string;
  onSearch: (value: string) => void;
};

export default function Header({
  user,
  onOpenSidebar,
  search,
  onSearch,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";

    return "Selamat Malam";
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-[82px] items-center justify-between px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-5">
          <button
            onClick={onOpenSidebar}
            className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

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

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
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
          </div>

          {/* NOTIFICATION */}
          <button className="relative rounded-2xl border border-slate-200 bg-white p-3 transition hover:bg-slate-100">
            <Bell size={19} />

            <span className="absolute right-3 top-3 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          </button>

          {/* PROFILE */}
          <button className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B4EA2] font-semibold text-white shadow">
              {user?.name?.charAt(0).toUpperCase() ??
                "U"}
            </div>

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
              className="text-slate-400 transition group-hover:rotate-180"
            />
          </button>
        </div>
      </div>
    </header>
  );
}