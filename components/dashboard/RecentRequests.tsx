"use client";

import { RefreshCw, FileText } from "lucide-react";

import RequestRow from "./RequestRow";

import type { ApprovalRequest } from "@/types/approvalRequest";

type Props = {
  loading: boolean;
  requests: ApprovalRequest[];
  onRefresh: () => void;
  onViewAll: () => void;
  onDetail: (id: number) => void;
};

export default function RecentRequests({
  loading,
  requests,
  onRefresh,
  onViewAll,
  onDetail,
}: Props) {
  return (
    <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Requests Terbaru
          </h2>

          <p className="text-sm text-slate-500">
            {requests.length} request ditemukan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={onViewAll}
            className="text-sm font-semibold text-[#0B4EA2] hover:underline"
          >
            Lihat Semua
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500">
            <RefreshCw
              size={20}
              className="animate-spin"
            />
            <span>Memuat data...</span>
          </div>
        </div>
      ) : requests.length === 0 ? (
        /* Empty */
        <div className="flex h-56 flex-col items-center justify-center">
          <FileText
            size={42}
            className="text-slate-300"
          />

          <p className="mt-4 text-base font-medium text-slate-700">
            Tidak ada request ditemukan
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Coba gunakan kata kunci lain.
          </p>
        </div>
      ) : (
        /* List */
        <div className="divide-y divide-slate-100">
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              onClick={() => onDetail(request.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}