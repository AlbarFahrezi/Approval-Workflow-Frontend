"use client";

import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import StatCard from "./StatCard";

type Props = {
  summary: {
    total_requests: number;
    submitted_requests: number;
    approved_requests: number;
    rejected_requests: number;
  } | null;
};

export default function SummaryCards({
  summary,
}: Props) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Pengajuan"
        value={summary?.total_requests ?? 0}
        icon={<FileText size={22} />}
      />

      <StatCard
        title="Menunggu Approval"
        value={summary?.submitted_requests ?? 0}
        icon={<Clock3 size={22} />}
      />

      <StatCard
        title="Disetujui"
        value={summary?.approved_requests ?? 0}
        icon={<CheckCircle2 size={22} />}
      />

      <StatCard
        title="Ditolak"
        value={summary?.rejected_requests ?? 0}
        icon={<XCircle size={22} />}
      />

    </section>
  );
}