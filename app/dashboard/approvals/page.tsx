"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { getApprovalRequests } from "@/services/approvalRequest";
import type { ApprovalRequest } from "@/types/approvalRequest";

export default function ApprovalsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);

  async function loadData() {
    try {
      setLoading(true);

      const data = await getApprovalRequests();

      // Hanya tampilkan request yang statusnya submitted
      setRequests(
        data.filter((item) => item.status === "submitted")
      );
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data approval.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Approval Request
          </h1>

          <p className="mt-1 text-slate-500">
            Semua request yang menunggu approval.
          </p>
        </div>

        <button
          onClick={loadData}
          className="rounded-xl border border-slate-200 p-3 hover:bg-slate-100"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2
            size={30}
            className="animate-spin text-[#0B4EA2]"
          />
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold">
            Tidak ada request yang menunggu approval.
          </h2>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {requests.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b p-6 last:border-none"
            >
              <div>
                <h2 className="text-lg font-bold">
                  {item.title}
                </h2>

                <p className="text-sm text-slate-500">
                  {item.description}
                </p>
              </div>

              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                Submitted
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}