  "use client";

  import { useEffect, useState } from "react";
  import { useParams, useRouter } from "next/navigation";
  import {
    ArrowLeft,
    User,
    Calendar,
    FileText,
    CheckCircle2,
    Clock3,
    XCircle,
    Pencil,
    Trash2,
    Send,
    Loader2,
  } from "lucide-react";
  import { toast } from "sonner";

  import {
    getApprovalRequest,
    deleteApprovalRequest,
    submitApprovalRequest,
    approveApprovalRequest,
    rejectApprovalRequest,
    getApprovalTimeline,
    getApprovalHistory,
    
  } from "@/services/approvalRequest";
  import { getStoredUser } from "@/services/auth";

  import type {
    ApprovalRequest,
  } from "@/types/approvalRequest";

  export default function RequestDetailPage() {
    const router = useRouter();

    const params = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);

    const [request, setRequest] =
      useState<ApprovalRequest | null>(null);

    const [timeline, setTimeline] =
    useState<any[]>([]);  

    const [history, setHistory] =
    useState<any[]>([]);



  const currentUser = getStoredUser();
  const currentUserRole = currentUser?.role;

  console.log("CURRENT ROLE", currentUserRole);

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);

        const id = Number(params.id);

        const data = await getApprovalRequest(id);
        setRequest(data);

        const timelineData =
          await getApprovalTimeline(id);

        const historyData =
          await getApprovalHistory(id);

        setTimeline(timelineData);
        setHistory(historyData);

      } catch (error) {
        console.error(error);

        toast.error(
          "Gagal mengambil detail pengajuan."
        );
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadDetail();
    }
  }, [params.id]);

  async function handleDelete() {
    if (!request) return;

    if (!window.confirm("Yakin ingin menghapus request ini?")) {
      return;
    }

    try {
      await deleteApprovalRequest(request.id);

      toast.success("Request berhasil dihapus.");

      router.push("/dashboard/requests");

    } catch (error) {
      console.error(error);

      toast.error("Gagal menghapus request.");
    }
  }

  async function handleSubmit() {
    if (!request) return;

    if (!window.confirm("Submit request ini?")) {
      return;
    }

    try {
      await submitApprovalRequest(request.id);

      const id = request.id;

      setRequest(await getApprovalRequest(id));
      setTimeline(await getApprovalTimeline(id));
      setHistory(await getApprovalHistory(id));

      toast.success("Request berhasil disubmit.");

    } catch (error) {
      console.error(error);

      toast.error("Gagal submit request.");
    }
  }

  async function handleApprove() {
    if (!request) return;

    if (!window.confirm("Approve request ini?")) {
      return;
    }

    try {
      await approveApprovalRequest(request.id);

      const id = request.id;

      setRequest(await getApprovalRequest(id));
      setTimeline(await getApprovalTimeline(id));
      setHistory(await getApprovalHistory(id));

      toast.success("Request berhasil diapprove.");

    } catch (error) {
      console.error(error);

      toast.error("Gagal approve request.");
    }
  }

  async function handleReject() {
    if (!request) return;

    const comment =
      window.prompt("Alasan reject (opsional)") ?? "";

    if (!window.confirm("Reject request ini?")) {
      return;
    }

    try {
      await rejectApprovalRequest(request.id, comment);

      const id = request.id;

      setRequest(await getApprovalRequest(id));
      setTimeline(await getApprovalTimeline(id));
      setHistory(await getApprovalHistory(id));

      toast.success("Request berhasil direject.");

    } catch (error) {
      console.error(error);

      toast.error("Gagal reject request.");
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2
          size={28}
          className="animate-spin text-[#0B4EA2]"
        />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">
          Data tidak ditemukan
        </h2>

        <button
          onClick={() => router.back()}
          className="mt-6 rounded-xl bg-[#0B4EA2] px-6 py-3 text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  const statusColor = {
      draft:
        "bg-slate-100 text-slate-700",

      submitted:
        "bg-yellow-100 text-yellow-700",

      approved:
        "bg-green-100 text-green-700",

      rejected:
        "bg-red-100 text-red-700",
    };

    const statusIcon = {
      draft: <FileText size={18} />,

      submitted: <Clock3 size={18} />,

      approved: <CheckCircle2 size={18} />,

      rejected: <XCircle size={18} />,
    };

    return (
      <div className="space-y-6">

        {/* Header */}

  <div className="flex flex-wrap items-center justify-between gap-4">

    <div>

      <button
        onClick={() => router.back()}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      <h1 className="text-3xl font-bold text-slate-900">
        Detail Pengajuan
      </h1>

      <p className="mt-2 text-slate-500">
        Informasi lengkap approval request.
      </p>

    </div>

    <div className="flex flex-wrap gap-3">

    {/* Employee */}
    {currentUserRole === "employee" &&
    request.status === "draft" && (
      <>
        <button
          onClick={() =>
            router.push(`/dashboard/requests/${request.id}/edit`)
          }
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-100"
        >
          <Pencil size={18} />
          Edit
        </button>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          <Send size={18} />
          Submit
        </button>

        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </>
    )}

    {/* Manager & Admin */}
    {(currentUserRole === "manager" ||
    currentUserRole === "admin") && 
    request.status === "submitted" && (
      <>
        <button
          onClick={handleApprove}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          <CheckCircle2 size={18} />
          Approve
        </button>

        <button
          onClick={handleReject}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
        >
          <XCircle size={18} />
          Reject
        </button>
      </>
    )}

  </div>

  </div>

  {/* CARD */}

  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

    <div className="flex flex-wrap items-center justify-between gap-5">

      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          {request.title}
        </h2>

        <p className="mt-2 text-slate-500">
          Request ID #{request.id}
        </p>
      </div>

      <div
        className={`flex items-center gap-2 rounded-full px-5 py-3 font-semibold ${
          statusColor[
            request.status as keyof typeof statusColor
          ]
        }`}
      >
        {
          statusIcon[
            request.status as keyof typeof statusIcon
          ]
        }

        <span className="capitalize">
          {request.status}
        </span>
      </div>

    </div>

    <div className="mt-8 grid gap-6 lg:grid-cols-2">

      <div className="rounded-xl bg-slate-50 p-6">

        <div className="mb-4 flex items-center gap-2 font-semibold">
          <FileText size={18} />
          Deskripsi
        </div>

        <p className="leading-7 text-slate-600">
          {request.description}
        </p>

      </div>

      <div className="space-y-4">

        <div className="flex items-center gap-3 rounded-xl border p-4">
          <User
            size={20}
            className="text-[#0B4EA2]"
          />

          <div>
            <p className="text-xs text-slate-500">
              Dibuat Oleh
            </p>

            <p className="font-semibold">
              {request.user?.name ?? "-"}
            </p>

            <p className="text-xs text-slate-500">
              {request.user?.email ?? "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border p-4">
          <Calendar
            size={20}
            className="text-[#0B4EA2]"
          />

          <div>
            <p className="text-xs text-slate-500">
              Dibuat Pada
            </p>

            <p className="font-semibold">
              {new Date(
                request.created_at
              ).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border p-4">
          <Clock3
            size={20}
            className="text-[#0B4EA2]"
          />

          <div>
            <p className="text-xs text-slate-500">
              Submitted
            </p>

            <p className="font-semibold">
              {request.submitted_at
                ? new Date(
                    request.submitted_at
                  ).toLocaleString("id-ID")
                : "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border p-4">
          <CheckCircle2
            size={20}
            className="text-[#0B4EA2]"
          />

          <div>
            <p className="text-xs text-slate-500">
              Approved
            </p>

            <p className="font-semibold">
              {request.approved_at
                ? new Date(
                    request.approved_at
                  ).toLocaleString("id-ID")
                : "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border p-4">
          <XCircle
            size={20}
            className="text-[#DC2626]"
          />

          <div>
            <p className="text-xs text-slate-500">
              Rejected
            </p>

            <p className="font-semibold">
              {request.rejected_at
                ? new Date(
                    request.rejected_at
                  ).toLocaleString("id-ID")
                : "-"}
            </p>
          </div>
        </div>

      </div>

    </div>

      </div>

      {/* Timeline */}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">
          Approval Timeline
        </h2>

        {timeline.length === 0 ? (

          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Belum ada timeline.
          </div>

        ) : (

          <div className="space-y-5">

            {timeline.map((item: any, index: number) => (

              <div
                key={index}
                className="flex gap-4"
              >

                <div className="flex flex-col items-center">

                  <div className="h-4 w-4 rounded-full bg-[#0B4EA2]" />

                  {index !== timeline.length - 1 && (
                    <div className="mt-1 h-full w-[2px] bg-slate-300" />
                  )}

                </div>

                <div className="flex-1 rounded-xl border border-slate-200 p-5">

                  <div className="flex items-center justify-between">

                    <h3 className="font-semibold capitalize">
                      {item.status}
                    </h3>

                    <span className="text-xs text-slate-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("id-ID")
                        : "-"}
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.comment || "-"}
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#0B4EA2]">
                    {item.user?.name || "-"}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* History */}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">
          Approval History
        </h2>

        {history.length === 0 ? (

          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Belum ada history.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="p-3 text-left">
                    Dari
                  </th>

                  <th className="p-3 text-left">
                    Ke
                  </th>

                  <th className="p-3 text-left">
                    Oleh
                  </th>

                  <th className="p-3 text-left">
                    Komentar
                  </th>

                  <th className="p-3 text-left">
                    Waktu
                  </th>

                </tr>

              </thead>

              <tbody>

                {history.map((item: any) => (

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="p-3 capitalize">
                      {item.from_status || "-"}
                    </td>

                    <td className="p-3 capitalize">
                      {item.to_status}
                    </td>

                    <td className="p-3">
                      {item.user?.name || "-"}
                    </td>

                    <td className="p-3">
                      {item.comment || "-"}
                    </td>

                    <td className="p-3">
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </div>
    );
  }
