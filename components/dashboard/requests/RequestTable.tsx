"use client";

import { RefreshCw } from "lucide-react";
import type { ApprovalRequest } from "@/types/approvalRequest";

type Props = {
  loading: boolean;
  requests: ApprovalRequest[];
  onDetail: (id: number) => void;
};

const statusColor: Record<string, string> = {
  draft:
    "bg-slate-100 text-slate-700",
  submitted:
    "bg-yellow-100 text-yellow-700",
  approved:
    "bg-green-100 text-green-700",
  rejected:
    "bg-red-100 text-red-700",
};

export default function RequestTable({
  loading,
  requests,
  onDetail,
}: Props) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <RefreshCw
          className="animate-spin"
          size={22}
        />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
        Belum ada data Request.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Judul
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Tanggal
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className="border-t border-slate-100 hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                <div className="font-medium text-slate-800">
                  {request.title}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {request.description}
                </div>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusColor[
                      request.status
                    ]
                  }`}
                >
                  {request.status}
                </span>
              </td>

              <td className="px-6 py-4 text-sm text-slate-600">
                {new Date(
                  request.created_at
                ).toLocaleDateString(
                  "id-ID"
                )}
              </td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() =>
                    onDetail(request.id)
                  }
                  className="rounded-lg bg-[#0B4EA2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#083d83]"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}