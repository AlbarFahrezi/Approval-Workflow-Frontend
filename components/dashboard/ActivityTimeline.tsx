"use client";

export default function ActivityTimeline() {
  const activities = [
    {
      color: "bg-emerald-500",
      title: "Request Approved",
      description: "Manager menyetujui pengajuan Laptop Dell.",
      time: "5 menit lalu",
    },
    {
      color: "bg-amber-500",
      title: "Request Submitted",
      description: "Employee membuat pengajuan baru.",
      time: "18 menit lalu",
    },
    {
      color: "bg-blue-500",
      title: "User Login",
      description: "Administrator masuk ke sistem.",
      time: "35 menit lalu",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold">
          Aktivitas Hari Ini
        </h2>

        <p className="text-sm text-slate-500">
          Timeline terbaru
        </p>
      </div>

      <div className="space-y-6 p-6">
        {activities.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full ${item.color}`}
              />
              {index !== activities.length - 1 && (
                <div className="mt-2 h-12 w-px bg-slate-200" />
              )}
            </div>

            <div>
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
    </div>
  );
}