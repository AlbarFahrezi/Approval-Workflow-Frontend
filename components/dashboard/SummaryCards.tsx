"use client";

import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import StatCard from "./StatCard";

type Props = {
  summary: any;
  role: string;
};

export default function SummaryCards({
  summary,
  role,
}: Props) {
  if (!summary) return null;

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {role === "employee" ? (
        <>
          <StatCard
            title="Total Pengajuan Saya"
            value={summary.total_requests}
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Draft"
            value={summary.draft_requests}
            icon={<Clock3 size={22} />}
          />

          <StatCard
            title="Disubmit"
            value={summary.submitted_requests}
            icon={<Clock3 size={22} />}
          />

          <StatCard
            title="Disetujui"
            value={summary.approved_requests}
            icon={<CheckCircle2 size={22} />}
          />
        </>
      ) : (
        <>
          <StatCard
            title="Total Pengajuan"
            value={summary.total_requests}
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Menunggu Approval"
            value={summary.submitted_requests}
            icon={<Clock3 size={22} />}
          />

          <StatCard
            title="Disetujui"
            value={summary.approved_requests}
            icon={<CheckCircle2 size={22} />}
          />

          <StatCard
            title="Ditolak"
            value={summary.rejected_requests}
            icon={<XCircle size={22} />}
          />
        </>
      )}
    </section>
  );
}