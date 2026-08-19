"use client";

import {
  Clock3,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

import type { ApprovalRequest } from "@/types/approvalRequest";

type Props = {
  requests: ApprovalRequest[];
};

type StatusConfig = {
  key:
    | "draft"
    | "submitted"
    | "approved"
    | "rejected";

  label: string;

  icon: React.ReactNode;

  iconClass: string;

  bgClass: string;

  barClass: string;
};

const statusConfig: StatusConfig[] = [
  {
    key: "draft",
    label: "Draft",
    icon: <FileText size={17} />,
    iconClass: "text-slate-600",
    bgClass: "bg-slate-100",
    barClass: "bg-slate-400",
  },

  {
    key: "submitted",
    label: "Disubmit",
    icon: <Clock3 size={17} />,
    iconClass: "text-amber-600",
    bgClass: "bg-amber-50",
    barClass: "bg-amber-400",
  },

  {
    key: "approved",
    label: "Disetujui",
    icon: <CheckCircle2 size={17} />,
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    barClass: "bg-emerald-500",
  },

  {
    key: "rejected",
    label: "Ditolak",
    icon: <XCircle size={17} />,
    iconClass: "text-red-600",
    bgClass: "bg-red-50",
    barClass: "bg-red-500",
  },
];

export default function StatusDistribution({
  requests,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | HITUNG STATUS
  |--------------------------------------------------------------------------
  */

  const total = requests.length;

  const getStatusCount = (
    status: StatusConfig["key"]
  ) => {
    return requests.filter(
      (request) =>
        request.status === status
    ).length;
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}

      <div className="flex items-start justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Status Distribution
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Distribusi status seluruh request
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF5FF] text-[#0B4EA2]">
          <FileText size={19} />
        </div>

      </div>

      {/* ================================================================ */}
      {/* TOTAL */}
      {/* ================================================================ */}

      <div className="mt-6 rounded-xl bg-slate-50 p-4">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Request
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {total}
            </p>
          </div>

          <FileText
            size={25}
            className="text-slate-300"
          />

        </div>

      </div>

      {/* ================================================================ */}
      {/* STATUS LIST */}
      {/* ================================================================ */}

      <div className="mt-5 space-y-4">

        {statusConfig.map(
          (status) => {
            const count =
              getStatusCount(
                status.key
              );

            const percentage =
              total > 0
                ? Math.round(
                    (count / total) *
                      100
                  )
                : 0;

            return (
              <div
                key={status.key}
                className="group"
              >

                {/* ---------------------------------------------------- */}
                {/* LABEL */}
                {/* ---------------------------------------------------- */}

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${status.bgClass} ${status.iconClass}`}
                    >
                      {status.icon}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {status.label}
                      </p>

                      <p className="text-xs text-slate-400">
                        {percentage}% dari total
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="text-sm font-bold text-slate-900">
                      {count}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        window.location.href =
                          `/dashboard/requests?status=${status.key}`;
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-300 opacity-0 transition-all hover:bg-slate-100 hover:text-[#0B4EA2] group-hover:opacity-100"
                      title={`Lihat request ${status.label}`}
                    >
                      <ArrowRight
                        size={15}
                      />
                    </button>

                  </div>

                </div>

                {/* ---------------------------------------------------- */}
                {/* PROGRESS BAR */}
                {/* ---------------------------------------------------- */}

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${status.barClass}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* ================================================================ */}
      {/* FOOTER */}
      {/* ================================================================ */}

      {total > 0 && (
        <button
          type="button"
          onClick={() =>
            (window.location.href =
              "/dashboard/requests")
          }
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-[#0B4EA2] transition hover:border-[#0B4EA2] hover:bg-[#EDF5FF]"
        >
          Lihat Semua Request

          <ArrowRight size={16} />
        </button>
      )}

    </section>
  );
}