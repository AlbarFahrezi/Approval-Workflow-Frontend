"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  User,
} from "lucide-react";

import type {
  ApprovalRequest,
} from "@/types/approvalRequest";

type Props = {
  request: ApprovalRequest;
  onReview: () => void;
};

export default function ApprovalQueueItem({
  request,
  onReview,
}: Props) {
  const formatDate =(
    date?: string | null
  ) => {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(date)
    );
  };

  return (
    <article className="group relative overflow-hidden border-b border-slate-200 bg-white transition hover:bg-slate-50 last:border-b-0">

      {/* LEFT ACCENT */}

      <div className="absolute bottom-0 left-0 top-0 w-1 bg-amber-400 transition group-hover:w-1.5" />

      <div className="grid gap-6 px-7 py-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">

        {/* ICON */}

        <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-blue-100 bg-blue-50 text-[#0B4EA2]">

          <FileText
            size={24}
            strokeWidth={1.8}
          />

        </div>

        {/* CONTENT */}

        <div className="min-w-0">

          {/* TOP */}

          <div className="flex flex-wrap items-center gap-3">

            <span className="font-mono text-xs font-bold tracking-wider text-[#0B4EA2]">

              REQ-
              {String(
                request.id
              ).padStart(
                4,
                "0"
              )}

            </span>

            <span className="h-1 w-1 bg-slate-300" />

            <span className="inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-[0.08em] text-amber-700">

              <span className="h-1.5 w-1.5 bg-amber-500" />

              PENDING REVIEW

            </span>

          </div>

          {/* TITLE */}

          <h3 className="mt-3 text-lg font-bold text-slate-900 transition group-hover:text-[#0B4EA2]">

            {request.title}

          </h3>

          {/* DESCRIPTION */}

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">

            {request.description ||
              "Tidak ada deskripsi untuk request ini."}

          </p>

          {/* META */}

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-4 text-xs">

            <div className="flex items-center gap-2 text-slate-500">

              <User
                size={15}
                className="text-[#0B4EA2]"
              />

              <span>

                Employee:

              </span>

              <span className="font-semibold text-slate-700">

                {request.user?.name ??
                  "Unknown User"}

              </span>

            </div>

            <div className="flex items-center gap-2 text-slate-500">

              <CalendarDays
                size={15}
                className="text-[#0B4EA2]"
              />

              <span>

                Submitted:

              </span>

              <span className="font-semibold text-slate-700">

                {formatDate(
                  request.submitted_at ??
                    request.created_at
                )}

              </span>

            </div>

            <div className="flex items-center gap-2 text-amber-700">

              <Clock3
                size={15}
              />

              <span className="font-medium">

                Menunggu keputusan Manager

              </span>

            </div>

          </div>

        </div>

        {/* ACTION */}

        <div className="flex shrink-0 flex-col items-stretch gap-2 lg:w-[190px]">

          <span className="text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">

            Action Required

          </span>

          <button
            onClick={onReview}
            className="group/button flex h-12 items-center justify-center gap-3 bg-[#0B4EA2] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#083D82] hover:shadow-lg active:scale-[0.98]"
          >

            Review Request

            <ArrowRight
              size={18}
              className="transition-transform group-hover/button:translate-x-1"
            />

          </button>

          <p className="text-center text-[10px] leading-4 text-slate-400">

            Periksa detail dan
            berikan keputusan

          </p>

        </div>

      </div>

    </article>
  );
}