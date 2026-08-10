"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getApprovalRequests } from "@/services/approvalRequest";
import type { ApprovalRequest } from "@/types/approvalRequest";

type ChartData = {
  month: string;
  total: number;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function StatisticsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChart() {
      try {
        const requests: ApprovalRequest[] =
          await getApprovalRequests();

        const currentYear = new Date().getFullYear();

        const monthlyData: ChartData[] =
          monthNames.map((month, index) => ({
            month,
            total: requests.filter((request) => {
              const date = new Date(request.created_at);

              return (
                date.getFullYear() === currentYear &&
                date.getMonth() === index
              );
            }).length,
          }));

        setData(monthlyData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadChart();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Approval Statistics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Total approval request per bulan
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#0B4EA2]">
          {new Date().getFullYear()}
        </span>

      </div>

      <div className="mt-6 h-[320px]">

        {loading ? (

          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Memuat statistik...
          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={data}>

              <defs>
                <linearGradient
                  id="approvalGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#0B4EA2"
                    stopOpacity={0.45}
                  />

                  <stop
                    offset="100%"
                    stopColor="#0B4EA2"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis dataKey="month" />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#0B4EA2"
                strokeWidth={3}
                fill="url(#approvalGradient)"
              />

            </AreaChart>
          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}