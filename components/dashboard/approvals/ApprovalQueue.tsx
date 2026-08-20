"use client";

import {
  Search,
  SlidersHorizontal,
  ClipboardCheck,
} from "lucide-react";

import type {
  ApprovalRequest,
} from "@/types/approvalRequest";

import ApprovalQueueItem from "./ApprovalQueueItem";

type Props = {
  requests: ApprovalRequest[];
  search: string;
  onSearch: (
    value: string
  ) => void;
  onReview: (
    id: number
  ) => void;
};

export default function ApprovalQueue({
  requests,
  search,
  onSearch,
  onReview,
}: Props) {
  return (
    <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b border-slate-200 bg-slate-50">

        <div className="flex flex-col gap-6 px-7 py-6 xl:flex-row xl:items-center xl:justify-between">

          {/* TITLE */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center bg-[#0B4EA2] text-white">

                <ClipboardCheck
                  size={20}
                />

              </div>

              <div>

                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0B4EA2]">

                  Approval Queue

                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">

                  Request Menunggu Review

                </h2>

              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">

              Review request yang membutuhkan keputusan dari Manager.

            </p>

          </div>

          {/* SEARCH */}

          <div className="flex w-full gap-3 xl:w-[520px]">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  onSearch(
                    event.target.value
                  )
                }
                placeholder="Cari berdasarkan judul, employee, atau ID request..."
                className="h-12 w-full border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B4EA2] focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <button
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-slate-300 bg-white text-slate-500 transition hover:border-[#0B4EA2] hover:bg-[#EDF5FF] hover:text-[#0B4EA2]"
              title="Filter request"
            >

              <SlidersHorizontal
                size={18}
              />

            </button>

          </div>

        </div>

      </div>

      {/* STATUS BAR */}

      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-7 py-4">

        <p className="text-sm text-slate-500">

          Menampilkan{" "}

          <span className="font-bold text-slate-900">

            {requests.length}

          </span>

          {" "}request yang membutuhkan review.

        </p>

        <div className="hidden items-center gap-2 text-xs font-semibold text-amber-700 sm:flex">

          <span className="h-2 w-2 bg-amber-400" />

          STATUS: PENDING REVIEW

        </div>

      </div>

      {/* REQUEST LIST */}

      <div>

        {requests.map(
          (request) => (

            <ApprovalQueueItem
              key={request.id}
              request={request}
              onReview={() =>
                onReview(
                  request.id
                )
              }
            />

          )
        )}

      </div>

    </section>
  );
}