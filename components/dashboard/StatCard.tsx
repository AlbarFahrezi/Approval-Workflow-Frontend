"use client";

import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  description?: string;
  onClick?: () => void;
};

export default function StatCard({
  title,
  value,
  icon,
  description,
  onClick,
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8cde2] hover:shadow-md"
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF5FF] text-[#0B4EA2] transition group-hover:bg-[#dcecff]">
          {icon}
        </div>

      </div>

      {description && (
        <p className="mt-3 text-xs leading-5 text-slate-400">
          {description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-400 transition group-hover:text-[#0B4EA2]">
          Klik untuk melihat
        </span>

        <ArrowRight
          size={15}
          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0B4EA2]"
        />
      </div>
    </button>
  );
}