"use client";

import { ApprovalRequest } from "@/types/approvalRequest";

type Props = {
  request: ApprovalRequest;
  onClick: () => void;
};

export default function RequestRow({
  request,
  onClick,
}: Props) {
  const statusMap = {
    draft: {
      label: "Draft",
      color: "bg-slate-100 text-slate-700",
    },

    submitted: {
      label: "Submitted",
      color: "bg-yellow-100 text-yellow-700",
    },

    approved: {
      label: "Approved",
      color: "bg-green-100 text-green-700",
    },

    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-700",
    },
  };

  const status =
    statusMap[
      request.status as keyof typeof statusMap
    ];

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-slate-100 px-6 py-5 text-left transition hover:bg-slate-50"
    >
      <div className="min-w-0">

        <h3 className="truncate text-sm font-semibold text-slate-800">
          {request.title}
        </h3>

        <p className="mt-1 truncate text-xs text-slate-500">
          {request.description}
        </p>

        <p className="mt-2 text-[11px] text-slate-400">
          {new Date(
            request.created_at
          ).toLocaleDateString("id-ID")}
        </p>

      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
      >
        {status.label}
      </span>
    </button>
  );
}