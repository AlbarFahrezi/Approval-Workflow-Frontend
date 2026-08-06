"use client";

import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import type { ApprovalRequest } from "@/types/approvalRequest";

type Props = {
  requests: ApprovalRequest[];
};

export default function PendingApproval({
  requests,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Menunggu Approval
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Request yang membutuhkan persetujuan manager.
          </p>

        </div>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
          {requests.length} Request
        </span>

      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">

          <Clock
            size={36}
            className="mx-auto mb-3 text-slate-300"
          />

          <p className="text-slate-500">
            Tidak ada request yang menunggu approval.
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {requests.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/requests/${item.id}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-[#0B4EA2] hover:bg-slate-50"
            >

              <div>

                <h3 className="font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.user?.name}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <span className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">

                  <Clock size={14} />

                  Submitted

                </span>

                <ChevronRight
                  size={18}
                  className="text-slate-400"
                />

              </div>

            </Link>
          ))}

        </div>
      )}

    </div>
  );
}