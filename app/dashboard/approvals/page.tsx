"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Loader2,
  Search,
} from "lucide-react";

import { toast } from "sonner";

import {
  getApprovalRequests,
} from "@/services/approvalRequest";

import type {
  ApprovalRequest,
} from "@/types/approvalRequest";

import ApprovalHero from "@/components/dashboard/approvals/ApprovalHero";

import ApprovalMetrics from "@/components/dashboard/approvals/ApprovalMetrics";

import ApprovalQueue from "@/components/dashboard/approvals/ApprovalQueue";

import ApprovalInsight from "@/components/dashboard/approvals/ApprovalInsight";

import ApprovalEmptyState from "@/components/dashboard/approvals/ApprovalEmptyState";

export default function ApprovalsPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [requests, setRequests] =
    useState<ApprovalRequest[]>([]);

  const [search, setSearch] =
    useState("");

  async function loadData() {
    try {
      setLoading(true);

      const data =
        await getApprovalRequests();

      const pendingRequests =
        data
          .filter(
            (item) =>
              item.status === "submitted"
          )
          .sort(
            (a, b) =>
              new Date(
                b.submitted_at ??
                  b.created_at
              ).getTime() -
              new Date(
                a.submitted_at ??
                  a.created_at
              ).getTime()
          );

      setRequests(
        pendingRequests
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
    void loadData();
  }, []);

  const filteredRequests =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return requests;
      }

      return requests.filter(
        (item) =>
          item.title
            ?.toLowerCase()
            .includes(keyword) ||

          item.description
            ?.toLowerCase()
            .includes(keyword) ||

          item.user?.name
            ?.toLowerCase()
            .includes(keyword) ||

          String(item.id)
            .includes(keyword)
      );
    }, [
      requests,
      search,
    ]);

  function handleReview(
    id: number
  ) {
    router.push(
      `/dashboard/requests/${id}`
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-10">

      {/* HERO */}

      <ApprovalHero
        totalPending={
          requests.length
        }
        onRefresh={() =>
          void loadData()
        }
        loading={loading}
      />

      {/* METRICS */}

      <ApprovalMetrics
        totalPending={
          requests.length
        }
        totalDisplayed={
          filteredRequests.length
        }
      />

      {/* LOADING */}

      {loading ? (

        <section className="flex min-h-[420px] items-center justify-center border border-slate-300 bg-white">

          <div className="flex flex-col items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center bg-[#EDF4FA]">

              <Loader2
                size={30}
                className="animate-spin text-[#1E5A92]"
              />

            </div>

            <div className="text-center">

              <p className="font-bold text-[#1D2D3D]">

                Memuat Approval Queue

              </p>

              <p className="mt-1 text-sm text-slate-500">

                Mengambil request yang
                membutuhkan keputusan.

              </p>

            </div>

          </div>

        </section>

      ) : requests.length === 0 ? (

        <ApprovalEmptyState
          hasSearch={false}
        />

      ) : (

        <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* MAIN */}

          <div className="min-w-0">

            <ApprovalQueue
              requests={
                filteredRequests
              }
              search={search}
              onSearch={setSearch}
              onReview={handleReview}
            />

            {/* EMPTY SEARCH */}

            {filteredRequests.length === 0 && (

              <div className="mt-6">

                <ApprovalEmptyState
                  hasSearch={true}
                />

              </div>

            )}

          </div>

          {/* SIDEBAR */}

          <aside className="space-y-6">

            <ApprovalInsight
              requests={requests}
            />

            {search.trim() !== "" && (

              <section className="border border-slate-300 bg-white">

                <div className="border-b border-slate-200 bg-[#F7F9FB] px-5 py-4">

                  <div className="flex items-center gap-2">

                    <Search
                      size={16}
                      className="text-[#1E5A92]"
                    />

                    <p className="text-xs font-bold uppercase tracking-wider text-[#36516f]">

                      Hasil Pencarian

                    </p>

                  </div>

                </div>

                <div className="px-5 py-5">

                  <p className="text-4xl font-bold text-[#193b61]">

                    {
                      filteredRequests.length
                    }

                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">

                    Request ditemukan berdasarkan
                    kata kunci:

                  </p>

                  <p className="mt-2 border-l-2 border-[#F5A623] bg-[#FFF8E8] px-3 py-2 text-sm font-bold text-[#8A5700]">

                    "{search}"

                  </p>

                </div>

              </section>

            )}

          </aside>

        </section>

      )}

    </div>
  );
}