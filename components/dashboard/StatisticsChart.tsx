"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", total: 8 },
  { month: "Feb", total: 14 },
  { month: "Mar", total: 19 },
  { month: "Apr", total: 13 },
  { month: "Mei", total: 25 },
  { month: "Jun", total: 21 },
  { month: "Jul", total: 32 },
];

export default function StatisticsChart() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Approval Statistics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Total approval request per bulan
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#0B4EA2]">
          2026
        </span>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
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
      </div>
    </div>
  );
}