"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, } from "next/navigation";

import {
  Search,
  Plus,
  RefreshCw,
  ArrowLeft,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  FileEdit,
  Activity,
} from "lucide-react";

import { toast } from "sonner";

import { getApprovalRequests } from "@/services/approvalRequest";

import type { ApprovalRequest } from "@/types/approvalRequest";

import RequestFilter from "@/components/dashboard/requests/RequestFilter";
import RequestTable from "@/components/dashboard/requests/RequestTable";

export default function RequestsPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<
    ApprovalRequest[]
  >([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  useEffect(() => {
  const statusFromUrl =
    searchParams.get("status");

  const allowedStatuses = [
    "all",
    "draft",
    "submitted",
    "approved",
    "rejected",
  ];

  if (
    statusFromUrl &&
    allowedStatuses.includes(
      statusFromUrl
    )
  ) {
    setStatus(statusFromUrl);
  } else {
    setStatus("all");
  }
}, [searchParams]);

  /*
  |--------------------------------------------------------------------------
  | Load Data
  |--------------------------------------------------------------------------
  */

  const loadRequests = async () => {
    try {
      setLoading(true);

      const data = await getApprovalRequests();

      console.log("DATA DARI API:", data);

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

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredRequests = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return requests.filter((request) => {
      const title =
        request.title?.toLowerCase() ?? "";

      const description =
        request.description?.toLowerCase() ?? "";

      const matchSearch =
        !keyword ||
        title.includes(keyword) ||
        description.includes(keyword);

      const matchStatus =
        status === "all" ||
        request.status === status;

      return matchSearch && matchStatus;
    });
  }, [requests, search, status]);

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const totalRequests = requests.length;

  const draftRequests = requests.filter(
    (request) =>
      request.status === "draft"
  ).length;

  const submittedRequests = requests.filter(
    (request) =>
      request.status === "submitted"
  ).length;

  const approvedRequests = requests.filter(
    (request) =>
      request.status === "approved"
  ).length;

  const rejectedRequests = requests.filter(
    (request) =>
      request.status === "rejected"
  ).length;

  const processedRequests =
    approvedRequests +
    rejectedRequests;

  const completionPercentage =
    totalRequests > 0
      ? Math.round(
          (processedRequests /
            totalRequests) *
            100
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">

        {/* ============================================================
    TOP NAV
============================================================ */}

<div className="mb-6 flex items-center justify-between">

  <button
    type="button"
    onClick={() =>
      router.push("/dashboard")
    }
    className="group inline-flex items-center gap-2.5 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#0B4EA2] hover:bg-blue-50 hover:text-[#0B4EA2] hover:shadow-md"
  >
    <ArrowLeft
      size={18}
      className="transition-transform duration-200 group-hover:-translate-x-1"
    />

    Dashboard
  </button>

</div>

        {/* ============================================================
    PAGE TITLE
============================================================ */}

<div className="mb-6 flex flex-col gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">

  {/* LEFT */}

  <div className="shrink-0">


  </div>

  {/* CENTER */}

  <div className="text-center">

    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
      Requests
    </h1>

    <p className="mt-2 text-sm text-slate-500">
      Daftar dan status seluruh pengajuan approval.
    </p>

  </div>

  {/* RIGHT */}

  <div className="flex shrink-0 justify-center md:justify-end">

    <button
      type="button"
      onClick={() =>
        router.push(
          "/dashboard/requests/create"
        )
      }
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B4EA2] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#083d80]"
    >

      <Plus size={17} />

      Buat Request

    </button>

  </div>

</div>

        {/* ============================================================
            SUMMARY CARDS
        ============================================================ */}

        <div className="mb-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total */}

          <div className="bg-white p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Total Request
              </span>

              <FileText
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-3 flex items-end gap-2">

              <span className="text-3xl font-semibold text-slate-900">
                {totalRequests}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-400">
              Seluruh pengajuan
            </p>

          </div>

          {/* Draft */}

          <div className="bg-white p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Draft
              </span>

              <FileEdit
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-3">

              <span className="text-3xl font-semibold text-slate-800">
                {draftRequests}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-400">
              Belum disubmit
            </p>

          </div>

          {/* Submitted */}

          <div className="bg-white p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Menunggu
              </span>

              <Clock3
                size={19}
                className="text-amber-500"
              />

            </div>

            <div className="mt-3">

              <span className="text-3xl font-semibold text-amber-600">
                {submittedRequests}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-400">
              Menunggu approval
            </p>

          </div>

          {/* Approved */}

          <div className="bg-white p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Approved
              </span>

              <CheckCircle2
                size={19}
                className="text-emerald-500"
              />

            </div>

            <div className="mt-3">

              <span className="text-3xl font-semibold text-emerald-600">
                {approvedRequests}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-400">
              Telah disetujui
            </p>

          </div>

          {/* Rejected */}

          <div className="bg-white p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Rejected
              </span>

              <XCircle
                size={19}
                className="text-red-500"
              />

            </div>

            <div className="mt-3">

              <span className="text-3xl font-semibold text-red-600">
                {rejectedRequests}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-400">
              Ditolak
            </p>

          </div>

        </div>

        {/* ============================================================
            REQUEST TABLE AREA
        ============================================================ */}

        <div className="rounded-lg border border-slate-200 bg-white">

          {/* HEADER */}

          <div className="border-b border-slate-200 px-5 py-4">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-base font-semibold text-slate-900">
                  Daftar Request
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Menampilkan request sesuai filter yang dipilih.
                </p>

              </div>

              <div className="text-xs text-slate-400">

                {filteredRequests.length} dari{" "}
                {requests.length} request

              </div>

            </div>

          </div>

         {/* ============================================================
    SEARCH & FILTER
============================================================ */}

<div className="border-b border-slate-200 bg-white px-5 py-5">

  {/* SEARCH */}

  <div className="relative w-full">

    <Search
      size={19}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      type="text"
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      placeholder="Cari request berdasarkan judul atau deskripsi..."
      className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#0B4EA2] focus:bg-white focus:ring-2 focus:ring-blue-100"
    />

  </div>

  {/* FILTER ROW */}

  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    <div className="flex flex-wrap items-center gap-2">

      <RequestFilter
        value={status}
        onChange={setStatus}
      />

      {(search || status !== "all") && (

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatus("all");
          }}
          className="rounded-md px-3 py-2 text-xs font-medium text-[#0B4EA2] transition hover:bg-blue-50"
        >
          Reset filter
        </button>

      )}

    </div>

    <div className="flex items-center gap-3">

      <span className="text-xs text-slate-400">
        {filteredRequests.length} dari {requests.length} request
      </span>

      <button
        type="button"
        onClick={loadRequests}
        title="Refresh data"
        className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-500 transition hover:border-[#0B4EA2] hover:bg-blue-50 hover:text-[#0B4EA2]"
      >

        <RefreshCw
          size={17}
          className={
            loading
              ? "animate-spin"
              : ""
          }
        />

      </button>

    </div>

  </div>

</div>

          {/* TABLE */}

          <div className="overflow-x-auto">

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

        {/* ============================================================
            DATA OVERVIEW
        ============================================================ */}

        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_340px]">

          {/* STATUS DISTRIBUTION */}

          <div className="rounded-lg border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-base font-semibold text-slate-900">
                  Status Distribution
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Distribusi request berdasarkan status.
                </p>

              </div>

              <Activity
                size={19}
                className="text-slate-400"
              />

            </div>

            {/* BAR */}

            <div className="mt-6">

              <div className="flex h-3 overflow-hidden rounded-sm bg-slate-100">

                {totalRequests > 0 && (
                  <>
                    <div
                      className="bg-slate-400"
                      style={{
                        width: `${
                          (draftRequests /
                            totalRequests) *
                          100
                        }%`,
                      }}
                    />

                    <div
                      className="bg-amber-400"
                      style={{
                        width: `${
                          (submittedRequests /
                            totalRequests) *
                          100
                        }%`,
                      }}
                    />

                    <div
                      className="bg-emerald-500"
                      style={{
                        width: `${
                          (approvedRequests /
                            totalRequests) *
                          100
                        }%`,
                      }}
                    />

                    <div
                      className="bg-red-500"
                      style={{
                        width: `${
                          (rejectedRequests /
                            totalRequests) *
                          100
                        }%`,
                      }}
                    />
                  </>
                )}

              </div>

            </div>

            {/* LEGEND */}

            <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-400" />

                  <span className="text-xs text-slate-500">
                    Draft
                  </span>

                </div>

                <span className="text-xs font-semibold text-slate-700">
                  {draftRequests}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />

                  <span className="text-xs text-slate-500">
                    Submitted
                  </span>

                </div>

                <span className="text-xs font-semibold text-slate-700">
                  {submittedRequests}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />

                  <span className="text-xs text-slate-500">
                    Approved
                  </span>

                </div>

                <span className="text-xs font-semibold text-slate-700">
                  {approvedRequests}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />

                  <span className="text-xs text-slate-500">
                    Rejected
                  </span>

                </div>

                <span className="text-xs font-semibold text-slate-700">
                  {rejectedRequests}
                </span>

              </div>

            </div>

          </div>

          {/* COMPLETION */}

          <div className="rounded-lg border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-base font-semibold text-slate-900">
                  Completion Rate
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Request yang telah selesai diproses.
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0B4EA2]">

                <Activity size={18} />

              </div>

            </div>

            <div className="mt-6 flex items-end justify-between">

              <div>

                <span className="text-4xl font-semibold text-slate-900">
                  {completionPercentage}%
                </span>

              </div>

              <span className="text-xs text-slate-500">
                {processedRequests} / {totalRequests}
              </span>

            </div>

            <div className="mt-4 h-2 rounded-sm bg-slate-100">

              <div
                className="h-full rounded-sm bg-[#0B4EA2] transition-all duration-500"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <div className="flex items-center justify-between py-5 text-xs text-slate-400">

          <span>
            Approval Management System
          </span>

          <span>
            {totalRequests} total records
          </span>

        </div>

      </div>

    </div>
  );
}