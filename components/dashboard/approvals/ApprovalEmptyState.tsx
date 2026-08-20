"use client";

import {
  CheckCircle2,
  SearchX,
} from "lucide-react";

type Props = {
  hasSearch: boolean;
};

export default function ApprovalEmptyState({
  hasSearch,
}: Props) {
  return (
    <section className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF5FF] text-[#0B4EA2]">

        {hasSearch ? (

          <SearchX size={30} />

        ) : (

          <CheckCircle2
            size={30}
            className="text-green-600"
          />

        )}

      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">

        {hasSearch
          ? "Request tidak ditemukan"
          : "Tidak ada request pending"}

      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">

        {hasSearch
          ? "Coba gunakan kata kunci pencarian yang berbeda."
          : "Semua request yang tersedia telah selesai diproses."}

      </p>

    </section>
  );
}