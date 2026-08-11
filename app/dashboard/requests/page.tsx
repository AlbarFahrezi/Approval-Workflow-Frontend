"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  RefreshCw,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import { getApprovalRequests } from "@/services/approvalRequest";

import type { ApprovalRequest } from "@/types/approvalRequest";

import RequestFilter from "@/components/dashboard/requests/RequestFilter";
import RequestTable from "@/components/dashboard/requests/RequestTable";

export default function RequestsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<
    ApprovalRequest[]
  >([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const loadRequests = async () => {
    try {
      setLoading(true);

      const data = await getApprovalRequests();

      console.log("DATA DARI API");
      console.log(data);

      setRequests(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal mengambil data requests."
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
      const keyword = search.toLowerCase();

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

      return matchSearch && matchStatus;
    });
  }, [requests, search, status]);

  const totalRequests = requests.length;

  const draftRequests = requests.filter(
    (request) => request.status === "draft"
  ).length;

  const submittedRequests = requests.filter(
    (request) => request.status === "submitted"
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === "approved"
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === "rejected"
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">

      {/* ============================= */}
      {/* TOP NAVIGATION */}
      {/* ============================= */}

      <div>
        <button
          onClick={() =>
            router.push("/dashboard")
          }
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#0B4EA2] hover:bg-blue-50 hover:text-[#0B4EA2]"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-0.5"
          />

          Dashboard
        </button>
      </div>

      {/* ============================= */}
      {/* PAGE HEADER */}
      {/* ============================= */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B4EA2]">
            <FileText size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Daftar Requests
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Kelola seluruh pengajuan approval yang tersedia.
            </p>
          </div>

        </div>

        <button
          onClick={() =>
            router.push(
              "/dashboard/requests/create"
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B4EA2] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#083d83]"
        >
          <Plus size={18} />

          Buat Request
        </button>

      </div>

      {/* ============================= */}
{/* STATISTICS */}
{/* ============================= */}

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

  {/* Total Request */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Total Request
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-900">
      {totalRequests}
    </p>
  </div>

  {/* Draft */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Draft
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-900">
      {draftRequests}
    </p>
  </div>

  {/* Menunggu Approval */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Menunggu Approval
    </p>

    <p className="mt-2 text-3xl font-bold text-yellow-600">
      {submittedRequests}
    </p>
  </div>

  {/* Approved */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Approved
    </p>

    <p className="mt-2 text-3xl font-bold text-green-600">
      {approvedRequests}
    </p>
  </div>

  {/* Rejected */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">
      Rejected
    </p>

    <p className="mt-2 text-3xl font-bold text-red-600">
      {rejectedRequests}
    </p>
  </div>

</div>

      {/* ============================= */}
      {/* SEARCH + FILTER */}
      {/* ============================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}

          <div className="relative w-full lg:max-w-xl">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari berdasarkan judul atau deskripsi..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0B4EA2] focus:bg-white"
            />

          </div>

          {/* Filter */}

          <div className="flex items-center gap-3">

            <RequestFilter
              value={status}
              onChange={setStatus}
            />

            <button
              onClick={loadRequests}
              title="Refresh data"
              className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-100 hover:text-[#0B4EA2]"
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

        {/* Result info */}

        <div className="mt-4 border-t border-slate-100 pt-4">

          <p className="text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-semibold text-slate-700">
              {filteredRequests.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-700">
              {requests.length}
            </span>{" "}
            request
          </p>

        </div>

      </div>

      {/* ============================= */}
      {/* TABLE */}
      {/* ============================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

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

    </div>
  );
} 