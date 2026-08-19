"use client";

import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import StatCard from "./StatCard";

type StatusFilter =
  | "all"
  | "draft"
  | "submitted"
  | "approved"
  | "rejected";

type Props = {
  summary: any;
  role: string;
  onFilter: (status: StatusFilter) => void;
};

export default function SummaryCards({
  summary,
  role,
  onFilter,
}: Props) {
  if (!summary) return null;

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

      {/* =========================================================
          TOTAL REQUEST
      ========================================================= */}

      <StatCard
        title={
          role === "employee"
            ? "Total Request Saya"
            : "Total Request"
        }
        value={summary.total_requests}
        icon={<FileText size={22} />}
        description={
          role === "employee"
            ? "Semua request yang saya buat"
            : "Semua request"
        }
        onClick={() =>
          onFilter("all")
        }
      />

      {/* =========================================================
          DRAFT
      ========================================================= */}

      <StatCard
        title="Draft"
        value={summary.draft_requests}
        icon={<Clock3 size={22} />}
        description="Request yang masih berupa draft"
        onClick={() =>
          onFilter("draft")
        }
      />

      {/* =========================================================
          SUBMITTED
      ========================================================= */}

      <StatCard
        title={
          role === "employee"
            ? "Disubmit"
            : "Menunggu Approval"
        }
        value={summary.submitted_requests}
        icon={<Clock3 size={22} />}
        description="Request yang menunggu approval"
        onClick={() =>
          onFilter("submitted")
        }
      />

      {/* =========================================================
          APPROVED
      ========================================================= */}

      <StatCard
        title="Disetujui"
        value={summary.approved_requests}
        icon={<CheckCircle2 size={22} />}
        description="Request yang sudah disetujui"
        onClick={() =>
          onFilter("approved")
        }
      />

      {/* =========================================================
          REJECTED
      ========================================================= */}

      <StatCard
        title="Ditolak"
        value={summary.rejected_requests}
        icon={<XCircle size={22} />}
        description="Request yang ditolak"
        onClick={() =>
          onFilter("rejected")
        }
      />

    </section>
  );
}