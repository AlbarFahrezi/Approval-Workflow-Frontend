"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  getApprovalRequests,
  getApprovalHistory,
} from "@/services/approvalRequest";

import type { ApprovalRequest } from "@/types/approvalRequest";

type Activity = {
  id: number;
  title: string;
  description: string;
  time: string;
  color: string;
  created_at: string;
};

export default function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const requests: ApprovalRequest[] =
          await getApprovalRequests();

        const historyResults = await Promise.all(
          requests.map(async (request) => {
            try {
              const history =
                await getApprovalHistory(request.id);

              return history.map((item: any) => ({
                id: item.id,
                title: getActivityTitle(item.to_status),
                description: buildDescription(
                  item,
                  request
                ),
                time: formatTime(item.created_at),
                color: getActivityColor(
                  item.to_status
                ),
                created_at: item.created_at,
              }));
            } catch (error) {
              console.error(
                `Gagal mengambil history request ${request.id}`,
                error
              );

              return [];
            }
          })
        );

        const mergedActivities =
          historyResults
            .flat()
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .slice(0, 5);

        setActivities(mergedActivities);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 p-6">

        <h2 className="text-xl font-bold text-slate-900">
          Aktivitas Hari Ini
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Timeline terbaru
        </p>

      </div>

      <div className="p-6">

        {loading ? (

          <div className="flex h-60 items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-[#0B4EA2]"
            />
          </div>

        ) : activities.length === 0 ? (

          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Belum ada aktivitas approval.
          </div>

        ) : (

          <div className="space-y-6">

            {activities.map((item, index) => (

              <div
                key={item.id}
                className="flex gap-4"
              >

                <div className="flex flex-col items-center">

                  <div
                    className={`h-3 w-3 rounded-full ${item.color}`}
                  />

                  {index !== activities.length - 1 && (
                    <div className="mt-2 h-12 w-px bg-slate-200" />
                  )}

                </div>

                <div className="min-w-0">

                  <h3 className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {item.time}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

function getActivityTitle(status: string) {
  switch (status) {
    case "submitted":
      return "Request Submitted";

    case "approved":
      return "Request Approved";

    case "rejected":
      return "Request Rejected";

    default:
      return "Request Updated";
  }
}

function getActivityColor(status: string) {
  switch (status) {
    case "submitted":
      return "bg-amber-500";

    case "approved":
      return "bg-emerald-500";

    case "rejected":
      return "bg-red-500";

    default:
      return "bg-blue-500";
  }
}

function buildDescription(
  item: any,
  request: ApprovalRequest
) {
  const userName =
    item.user?.name ?? "User";

  switch (item.to_status) {
    case "submitted":
      return `${userName} mengirim pengajuan "${request.title}".`;

    case "approved":
      return `${userName} menyetujui pengajuan "${request.title}".`;

    case "rejected":
      return `${userName} menolak pengajuan "${request.title}".${
        item.comment
          ? ` Alasan: ${item.comment}`
          : ""
      }`;

    default:
      return `${userName} mengubah status pengajuan "${request.title}".`;
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString);

  const now = new Date();

  const diffMs =
    now.getTime() - date.getTime();

  const diffMinutes = Math.floor(
    diffMs / 60000
  );

  if (diffMinutes < 1) {
    return "Baru saja";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} menit lalu`;
  }

  const diffHours = Math.floor(
    diffMinutes / 60
  );

  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  const diffDays = Math.floor(
    diffHours / 24
  );

  return `${diffDays} hari lalu`;
}