"use client";

import { Bell } from "lucide-react";

export default function NotificationDropdown() {
  return (
    <div className="relative">
      <button className="relative rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50">
        <Bell size={18} />

        <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500" />
      </button>
    </div>
  );
}