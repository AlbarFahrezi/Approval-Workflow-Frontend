"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import {
  getApprovalRequests,
} from "@/services/approvalRequest";

import type { ApprovalRequest } from "@/types/approvalRequest";

export default function ApprovalsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);

  async function loadData() {
    try {
      setLoading(true);

      const data = await getApprovalRequests();

      setRequests(
        data.filter(
          (item) => item.status === "submitted"
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal mengambil data approval."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Approval Request
          </h1>

          <p className="mt-1 text-slate-500">
            Request yang menunggu persetujuan Manager.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:bg-slate-100 disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />
        </button>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="flex h-72 items-center justify-center">

          <Loader2
            size={32}
            className="animate-spin text-[#0B4EA2]"
          />

        </div>

      ) : requests.length === 0 ? (

        /* Empty State */
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">

            <CheckCircle
              size={30}
              className="text-green-600"
            />

          </div>

          <h2 className="text-xl font-semibold">
            Tidak ada request pending
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Semua request sudah diproses.
          </p>

        </div>

      ) : (

        /* Approval List */
        <div className="space-y-4">

          {requests.map((item) => (

            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              <div className="flex items-start justify-between gap-6">

                {/* Request Info */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-3">

                    <h2 className="text-lg font-bold">
                      {item.title}
                    </h2>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold capitalize text-yellow-700">
                      {item.status}
                    </span>

                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">

                    <span>
                      Dibuat oleh:{" "}
                      <span className="font-semibold text-slate-700">
                        {item.user?.name ?? "-"}
                      </span>
                    </span>

                    <span>
                      Request ID:{" "}
                      <span className="font-semibold text-slate-700">
                        #{item.id}
                      </span>
                    </span>

                  </div>

                </div>

                {/* Action */}
                <div className="flex shrink-0 items-center gap-2">

                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/requests/${item.id}`
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <Eye size={17} />
                    Detail
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}