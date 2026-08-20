"use client";

import {
  BarChart3,
  FileClock,
  Users,
  ArrowRight,
} from "lucide-react";

import type {
  ApprovalRequest,
} from "@/types/approvalRequest";

type Props = {
  requests: ApprovalRequest[];
};

export default function ApprovalInsight({
  requests,
}: Props) {
  const uniqueUsers =
    new Set(
      requests.map(
        (item) =>
          item.user?.id ??
          item.user?.name
      )
    ).size;

  return (
    <section className="border border-slate-300 bg-white">

      {/* HEADER */}

      <div className="flex items-center gap-3 border-b border-slate-200 bg-[#F7F9FB] px-5 py-5">

        <div className="flex h-10 w-10 items-center justify-center border border-[#B9CCE0] bg-[#EDF4FA] text-[#1E5A92]">

          <BarChart3 size={20} />

        </div>

        <div>

          <h2 className="font-bold text-[#1D2D3D]">

            Approval Insight

          </h2>

          <p className="mt-1 text-xs text-slate-500">

            Ringkasan antrean approval

          </p>

        </div>

      </div>

      {/* CONTENT */}

      <div className="divide-y divide-slate-200">

        <div className="flex items-center gap-4 px-5 py-5">

          <div className="flex h-10 w-10 items-center justify-center bg-[#FFF8E8] text-[#D88900]">

            <FileClock size={19} />

          </div>

          <div className="flex-1">

            <p className="text-xs font-medium text-slate-500">

              Total Pending

            </p>

            <p className="mt-1 text-2xl font-bold text-[#193b61]">

              {requests.length}

            </p>

          </div>

          <span className="text-xs font-bold text-[#C47A00]">

            PENDING

          </span>

        </div>

        <div className="flex items-center gap-4 px-5 py-5">

          <div className="flex h-10 w-10 items-center justify-center bg-[#EDF4FA] text-[#1E5A92]">

            <Users size={19} />

          </div>

          <div>

            <p className="text-xs font-medium text-slate-500">

              Pengaju Aktif

            </p>

            <p className="mt-1 text-2xl font-bold text-[#193b61]">

              {uniqueUsers}

            </p>

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="border-t border-slate-200 bg-[#F7F9FB] px-5 py-4">

        <div className="flex items-center justify-between text-xs">

          <span className="text-slate-500">

            Workflow Status

          </span>

          <span className="flex items-center gap-1 font-bold text-[#1E5A92]">

            Active

            <ArrowRight size={13} />

          </span>

        </div>

      </div>

    </section>
  );
}