"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import {
  getApprovalRequests,
} from "@/services/approvalRequest";

import type {
  ApprovalRequest,
} from "@/types/approvalRequest";

import RequestFilter from "@/components/dashboard/requests/RequestFilter";
import RequestTable from "@/components/dashboard/requests/RequestTable";

export default function RequestsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<
    ApprovalRequest[]
  >([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState("all");

  const loadRequests = async () => {
    try {
      setLoading(true);

      const data =
        await getApprovalRequests();

        console.log("DATA DARI API");
        console.log(data);

      setRequests(data);

      
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal mengambil data pengajuan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const keyword =
        search.toLowerCase();

      const matchSearch =
        request.title
          .toLowerCase()
          .includes(keyword) ||
        request.description
          .toLowerCase()
          .includes(keyword);

      const matchStatus =
        status === "all"
          ? true
          : request.status === status;

      return (
        matchSearch && matchStatus
      );
    });
  }, [requests, search, status]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Daftar Pengajuan
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola seluruh pengajuan approval.
          </p>

        </div>

        <button
          onClick={() =>
            router.push(
              "/dashboard/requests/create"
            )
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#083d83]"
        >
          <Plus size={18} />
          Buat Pengajuan
        </button>

      </div>

      {/* Toolbar */}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full lg:max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cari judul atau deskripsi..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0B4EA2]"
          />

        </div>

        <div className="flex items-center gap-3">

          <RequestFilter
            value={status}
            onChange={setStatus}
          />

          <button
            onClick={loadRequests}
            className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100"
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

      </div>

      {/* Table */}

      <RequestTable
        loading={loading}
        requests={filteredRequests}
        onDetail={(id) =>
          router.push(
            `/dashboard/requests/${id}`
          )
        }
      />

    </div>
  );
}