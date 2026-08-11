"use client";

import { useCallback, useEffect, useState } from "react";
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

export default function DashboardPage() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [recentRequests, setRecentRequests] =
    useState<ApprovalRequest[]>([]);

  const [approvalRequests, setApprovalRequests] =
    useState<ApprovalRequest[]>([]);

  const pendingCount = approvalRequests.filter(
    (item) => item.status === "submitted"
  ).length;

  const [loading, setLoading] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [
        dashboardSummary,
        approvalRequestsData,
      ] = await Promise.all([
        getDashboardSummary(),
        getApprovalRequests(),
      ]);

      setSummary(dashboardSummary);
      setApprovalRequests(approvalRequestsData);

      setRecentRequests(
        [...approvalRequestsData]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5)
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal mengambil data dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      queueMicrotask(() => {
        void loadDashboard();
      });
    }
  }, [authLoading, user, loadDashboard]);

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

  if (!user) {
    return null;
  }

  const filteredRequests = recentRequests.filter(
    (request) => {
      const keyword = search.toLowerCase();

      return (
        request.title
          .toLowerCase()
          .includes(keyword) ||
        request.description
          .toLowerCase()
          .includes(keyword) ||
        request.status
          .toLowerCase()
          .includes(keyword)
      );
    }
  );

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <Sidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingCount={pendingCount}
         
      />

      <div className="lg:pl-72">
        <Header
          user={user}
          search={search}
          onSearch={setSearch}
          onOpenSidebar={() =>
            setSidebarOpen(true)
          }
        />

        <main className="space-y-7 p-6 lg:p-8">

          {/* Welcome */}
          <section>
            <p className="text-sm text-slate-500">
              Selamat datang kembali,
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {user.name}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Pantau seluruh aktivitas approval,
              requests, dan proses persetujuan
              secara realtime.
            </p>
          </section>

          {/* Summary */}
          <SummaryCards
            summary={summary}
            role={user.role}
          />

          {user.role === "manager" && (
            <PendingApproval
              requests={approvalRequests.filter(
                (r) => r.status === "submitted"
              )}
            />
          )}

          {/* Chart + Timeline */}
          <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">

            <StatisticsChart />

            <ActivityTimeline />

          </section>

          {/* Recent Requests */}
          <RecentRequests
            loading={loading}
            requests={filteredRequests}
            onRefresh={loadDashboard}
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

          {/* Quick Action */}
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