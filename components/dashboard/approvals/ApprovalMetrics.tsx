"use client";

import {
  Clock3,
  Search,
} from "lucide-react";

type Props = {
  totalPending: number;
  totalDisplayed: number;
};

export default function ApprovalMetrics({
  totalPending,
  totalDisplayed,
}: Props) {
  return (
    <section className="grid border border-slate-300 bg-white md:grid-cols-2">

      {/* METRIC 1 */}

      <div className="flex items-center justify-between border-b border-slate-300 px-6 py-6 md:border-b-0 md:border-r">

        <div>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">

            Menunggu Approval

          </p>

          <p className="mt-3 text-4xl font-bold text-[#193b61]">

            {totalPending}

          </p>

          <p className="mt-2 text-sm text-slate-500">

            Request siap untuk ditinjau.

          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center border border-[#F2C66D] bg-[#FFF8E8] text-[#D88900]">

          <Clock3 size={22} />

        </div>

      </div>

      {/* METRIC 2 */}

      <div className="flex items-center justify-between px-6 py-6">

        <div>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">

            Request Ditampilkan

          </p>

          <p className="mt-3 text-4xl font-bold text-[#193b61]">

            {totalDisplayed}

          </p>

          <p className="mt-2 text-sm text-slate-500">

            Berdasarkan hasil pencarian.

          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center border border-[#B9CCE0] bg-[#EDF4FA] text-[#1E5A92]">

          <Search size={22} />

        </div>

      </div>

    </section>
  );
}