"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { RefreshCw } from "lucide-react";

import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

import {
  getDashboardSummary,
} from "@/services/dashboard";

import type {
  DashboardSummary,
} from "@/services/dashboard";

import {
  getApprovalRequests,
} from "@/services/approvalRequest";

import type {
  ApprovalRequest,
} from "@/types/approvalRequest";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import SummaryCards from "@/components/dashboard/SummaryCards";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import RecentRequests from "@/components/dashboard/RecentRequests";
import QuickAction from "@/components/dashboard/QuickAction";
import PendingApproval from "@/components/dashboard/PendingApproval";
import StatusDistribution from "@/components/dashboard/StatusDistribution";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [recentRequests, setRecentRequests] =
    useState<ApprovalRequest[]>([]);

  const [approvalRequests, setApprovalRequests] =
    useState<ApprovalRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | PENDING APPROVAL COUNT
  |--------------------------------------------------------------------------
  */

  const pendingCount =
    approvalRequests.filter(
      (item) =>
        item.status === "submitted"
    ).length;

  /*
  |--------------------------------------------------------------------------
  | LOAD DASHBOARD
  |--------------------------------------------------------------------------
  */

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);

        const [
          dashboardSummary,
          approvalRequestsData,
        ] = await Promise.all([
          getDashboardSummary(),
          getApprovalRequests(),
        ]);

        /*
        |----------------------------------------------------------------------
        | SUMMARY
        |----------------------------------------------------------------------
        */

        setSummary(
          dashboardSummary
        );

        /*
        |----------------------------------------------------------------------
        | ALL REQUESTS
        |----------------------------------------------------------------------
        */

        setApprovalRequests(
          approvalRequestsData
        );

        /*
        |----------------------------------------------------------------------
        | RECENT REQUESTS
        |----------------------------------------------------------------------
        */

        const sortedRequests =
          [...approvalRequestsData].sort(
            (a, b) =>
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
          );

        setRecentRequests(
          sortedRequests.slice(0, 5)
        );
      } catch (error) {
        console.error(
          "[DASHBOARD] Gagal mengambil data:",
          error
        );

        toast.error(
          "Gagal mengambil data dashboard."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA AFTER AUTH READY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !authLoading &&
      user
    ) {
      queueMicrotask(() => {
        void loadDashboard();
      });
    }
  }, [
    authLoading,
    user,
    loadDashboard,
  ]);

  /*
  |--------------------------------------------------------------------------
  | AUTH LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <RefreshCw
            size={18}
            className="animate-spin"
          />

          Memuat Dashboard...
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | USER NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const keyword =
    search
      .trim()
      .toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | FILTER RECENT REQUESTS
  |--------------------------------------------------------------------------
  |
  | Kalau user melakukan pencarian:
  | tampilkan request berdasarkan keyword.
  |
  | Kalau tidak ada pencarian:
  | tampilkan 5 request terbaru.
  |
  */

  const filteredRequests =
    keyword
      ? approvalRequests.filter(
          (request) =>
            request.title
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            request.description
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            request.status
              ?.toLowerCase()
              .includes(
                keyword
              )
        )
      : recentRequests;

  /*
  |--------------------------------------------------------------------------
  | STATUS FILTER
  |--------------------------------------------------------------------------
  |
  | Digunakan oleh SummaryCards.
  |
  | all       -> semua request
  | draft     -> request draft
  | submitted -> request disubmit
  | approved  -> request disetujui
  | rejected  -> request ditolak
  |
  */

  const handleStatusFilter =
    (
      status:
        | "all"
        | "draft"
        | "submitted"
        | "approved"
        | "rejected"
    ) => {
      if (status === "all") {
        router.push(
          "/dashboard/requests"
        );

        return;
      }

      router.push(
        `/dashboard/requests?status=${status}`
      );
    };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#f4f7fa]">

      {/* ================================================================ */}
      {/* SIDEBAR */}
      {/* ================================================================ */}

      <Sidebar
        user={user}
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        pendingCount={
          pendingCount
        }
      />

      {/* ================================================================ */}
      {/* MAIN CONTENT */}
      {/* ================================================================ */}

      <div className="lg:pl-72">

        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}

        <Header
          user={user}
          search={search}
          onSearch={setSearch}
          onOpenSidebar={() =>
            setSidebarOpen(true)
          }
          approvalRequests={
            approvalRequests
          }
        />

        {/* ============================================================ */}
        {/* DASHBOARD CONTENT */}
        {/* ============================================================ */}

        <main className="space-y-7 pt-6 pr-6 pb-8 pl-0 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-0">

          {/* ======================================================== */}
          {/* SUMMARY CARDS */}
          {/* ======================================================== */}

          <SummaryCards
            summary={summary}
            role={user.role}
            onFilter={
              handleStatusFilter
            }
          />

          {/* ======================================================== */}
          {/* PENDING APPROVAL - MANAGER */}
          {/* ======================================================== */}

          {user.role === "manager" && (
            <PendingApproval
              requests={approvalRequests.filter(
                (request) =>
                  request.status ===
                  "submitted"
              )}
            />
          )}

          {/* ======================================================== */}
          {/* RECENT REQUESTS + ACTIVITY */}
          {/* ======================================================== */}

          <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">

            {/* ------------------------------------------------------ */}
            {/* DAFTAR REQUEST */}
            {/* ------------------------------------------------------ */}

            <RecentRequests
              loading={loading}
              requests={
                filteredRequests
              }
              onRefresh={
                loadDashboard
              }
              onViewAll={() =>
                router.push(
                  "/dashboard/requests"
                )
              }
              onDetail={(id) =>
                router.push(
                  `/dashboard/requests/${id}`
                )
              }
            />

            {/* ------------------------------------------------------ */}
            {/* AKTIVITAS HARI INI */}
            {/* ------------------------------------------------------ */}

            <ActivityTimeline />

          </section>

          {/* ======================================================== */}
          {/* STATISTICS + STATUS DISTRIBUTION */}
          {/* ======================================================== */}

          <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">

            {/* ------------------------------------------------------ */}
            {/* APPROVAL STATISTICS */}
            {/* ------------------------------------------------------ */}

            <StatisticsChart />

            {/* ------------------------------------------------------ */}
            {/* STATUS DISTRIBUTION */}
            {/* ------------------------------------------------------ */}

            <StatusDistribution
              requests={
                approvalRequests
              }
            />

          </section>

          {/* ======================================================== */}
          {/* QUICK ACTION */}
          {/* ======================================================== */}

          <QuickAction
            onCreate={() =>
              router.push(
                "/dashboard/requests/create"
              )
            }
            onRequests={() =>
              router.push(
                "/dashboard/requests"
              )
            }
          />

        </main>

      </div>

    </div>
  );
}