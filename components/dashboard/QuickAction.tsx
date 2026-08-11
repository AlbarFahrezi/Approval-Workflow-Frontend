"use client";

import { FileText, Plus } from "lucide-react";

type Props = {
  onCreate: () => void;
  onRequests: () => void;
};

export default function QuickAction({
  onCreate,
  onRequests,
}: Props) {
  return (
    <section className="grid gap-5 md:grid-cols-2">

      <button
        onClick={onCreate}
        className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-[#0B4EA2]"
      >
        <div>
          <p className="text-xs uppercase text-slate-400">
            Quick Action
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            Buat Request
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Membuat request approval baru.
          </p>
        </div>

        <Plus
          size={22}
          className="text-[#0B4EA2]"
        />
      </button>

      <button
        onClick={onRequests}
        className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-[#0B4EA2]"
      >
        <div>
          <p className="text-xs uppercase text-slate-400">
            Overview
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            Semua Request
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Lihat seluruh request.
          </p>
        </div>

        <FileText
          size={22}
          className="text-[#0B4EA2]"
        />
      </button>

    </section>
  );
}