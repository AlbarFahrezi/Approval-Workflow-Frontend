"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  CalendarDays,
  FileText,
  CheckCircle2,
  Clock3,
  XCircle,
  Pencil,
  Trash2,
  Send,
  Loader2,
  X,
  AlertTriangle,
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
import type { ApprovalRequest } from "@/types/approvalRequest";

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<ApprovalRequest | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const [confirmAction, setConfirmAction] = useState<
    "submit" | "approve" | "delete" | null
  >(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const currentUser = getStoredUser();
  const currentUserRole = String(currentUser?.role ?? "")
    .trim()
    .toLowerCase();

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);

        const id = Number(params.id);
        if (!id) throw new Error("ID request tidak valid.");

        const [requestData, timelineData, historyData] = await Promise.all([
          getApprovalRequest(id),
          getApprovalTimeline(id),
          getApprovalHistory(id),
        ]);

        setRequest(requestData);
        setTimeline(timelineData);
        setHistory(historyData);
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil detail request.");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) loadDetail();
  }, [params.id]);

  async function refreshRequest(id: number) {
    const [updatedRequest, updatedTimeline, updatedHistory] =
      await Promise.all([
        getApprovalRequest(id),
        getApprovalTimeline(id),
        getApprovalHistory(id),
      ]);

    setRequest(updatedRequest);
    setTimeline(updatedTimeline);
    setHistory(updatedHistory);
  }

  async function handleDelete() {
    if (!request) return;

    try {
      setConfirmLoading(true);
      await deleteApprovalRequest(request.id);
      toast.success("Request berhasil dihapus.");
      router.push("/dashboard/requests");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus request.");
    } finally {
      setConfirmLoading(false);
      setConfirmAction(null);
    }
  }

  async function handleSubmit() {
    if (!request) return;

    try {
      setConfirmLoading(true);
      await submitApprovalRequest(request.id);
      await refreshRequest(request.id);
      toast.success("Request berhasil disubmit.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal submit request.");
    } finally {
      setConfirmLoading(false);
      setConfirmAction(null);
    }
  }

  async function handleApprove() {
    if (!request) return;

    try {
      setConfirmLoading(true);
      await approveApprovalRequest(request.id);
      await refreshRequest(request.id);
      toast.success("Request berhasil diapprove.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal approve request.");
    } finally {
      setConfirmLoading(false);
      setConfirmAction(null);
    }
  }

  async function handleReject() {
    if (!request) return;

    if (!rejectComment.trim()) {
      toast.error("Alasan reject wajib diisi.");
      return;
    }

    try {
      setRejectLoading(true);
      await rejectApprovalRequest(request.id, rejectComment.trim());
      await refreshRequest(request.id);
      setRejectComment("");
      setShowRejectModal(false);
      toast.success("Request berhasil direject.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal reject request.");
    } finally {
      setRejectLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f5f7fa] font-sans">
        <div className="flex items-center gap-3 rounded-xl border border-[#e1e8ef] bg-white px-5 py-4 text-sm text-[#60768a] shadow-sm">
          <Loader2 size={20} className="animate-spin text-[#0b5eb8]" />
          Memuat detail request...
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f5f7fa] font-sans">
        <div className="rounded-2xl border border-[#dfe7ef] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef5fc] text-[#0b5eb8]">
            <FileText size={22} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#17324d]">
            Data tidak ditemukan
          </h2>
          <p className="mt-1 text-sm text-[#718599]">
            Request yang kamu buka tidak tersedia.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/requests")}
            className="mt-5 rounded-lg bg-[#0b5eb8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084b95]"
          >
            Kembali ke Request
          </button>
        </div>
      </div>
    );
  }

  const normalizedStatus = String(request.status ?? "")
    .trim()
    .toLowerCase();

  const canManageDraft =
    (currentUserRole === "employee" || currentUserRole === "manager") &&
    normalizedStatus === "draft";

  const canApprove =
    currentUserRole === "manager" && normalizedStatus === "submitted";

  const statusMeta = {
    draft: {
      label: "Draft",
      icon: <FileText size={15} />,
      className: "border-[#dbe4ec] bg-[#f3f6f9] text-[#53687c]",
    },
    submitted: {
      label: "Submitted",
      icon: <Clock3 size={15} />,
      className: "border-[#f3df9f] bg-[#fff9e8] text-[#96700d]",
    },
    approved: {
      label: "Approved",
      icon: <CheckCircle2 size={15} />,
      className: "border-[#bde4cd] bg-[#eefaf3] text-[#197342]",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle size={15} />,
      className: "border-[#f0c5c5] bg-[#fff2f2] text-[#b53b3b]",
    },
  } as const;

  const currentStatus =
    statusMeta[normalizedStatus as keyof typeof statusMeta] ??
    statusMeta.draft;

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const timelineStatusClass = (status?: string) => {
    const value = String(status ?? "").toLowerCase();
    if (value === "approved") return "bg-[#16a36a] ring-[#e6f7ef]";
    if (value === "rejected") return "bg-[#d94a4a] ring-[#fff0f0]";
    if (value === "submitted") return "bg-[#0b5eb8] ring-[#eaf3fb]";
    return "bg-[#8a9aaa] ring-[#f0f3f6]";
  };

  return (
    <div className="min-h-full bg-[#f5f7fa] font-sans text-[#17324d]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/requests")}
              className="mb-4 inline-flex h-9 items-center gap-2 rounded-lg border border-[#d9e2ec] bg-white px-3.5 text-xs font-semibold text-[#36526b] shadow-sm transition hover:border-[#b9cddd] hover:bg-[#f8fafc]"
            >
              <ArrowLeft size={16} />
              Kembali ke Request
            </button>

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8495a5]">
              Request Management
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#17324d] sm:text-[28px]">
                Detail Request
              </h1>
              <span className="rounded-md bg-[#edf4fb] px-2 py-1 text-[11px] font-semibold text-[#0b5eb8]">
                #{request.id}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#718599]">
              Informasi lengkap dan riwayat proses approval request.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {canManageDraft && (
              <>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/requests/${request.id}/edit`)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#b9d7f5] bg-white px-4 text-sm font-semibold text-[#0b5eb8] transition hover:bg-[#eef6ff]"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAction("submit")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0b5eb8] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084b95]"
                >
                  <Send size={16} />
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAction("delete")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#efc3c3] bg-white px-4 text-sm font-semibold text-[#c53b3b] transition hover:bg-[#fff5f5]"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            )}

            {canApprove && (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmAction("approve")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0b5eb8] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084b95]"
                >
                  <CheckCircle2 size={16} />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#efc3c3] bg-white px-4 text-sm font-semibold text-[#c53b3b] transition hover:bg-[#fff5f5]"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>

        {/* MAIN REQUEST CARD */}
        <section className="overflow-hidden rounded-2xl border border-[#dce5ed] bg-white shadow-[0_3px_14px_rgba(27,61,91,0.05)]">
          <div className="flex flex-col gap-4 border-b border-[#e7edf3] px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8495a5]">
                Approval Request
              </p>
              <h2 className="truncate text-xl font-bold text-[#17324d] sm:text-2xl">
                {request.title}
              </h2>
              <p className="mt-1 text-xs text-[#7a8d9f]">
                Request ID #{request.id}
              </p>
            </div>

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold ${currentStatus.className}`}
            >
              {currentStatus.icon}
              {currentStatus.label}
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
            {/* DESCRIPTION */}
            <div className="rounded-xl border border-[#e1e8ef] bg-[#f8fafc] p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf3fb] text-[#0b5eb8]">
                  <FileText size={16} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8495a5]">
                    Deskripsi
                  </p>
                  <p className="text-sm font-semibold text-[#17324d]">
                    Detail pengajuan
                  </p>
                </div>
              </div>

              <div className="mt-5 min-h-[150px] rounded-lg border border-[#e4ebf1] bg-white p-4 sm:min-h-[175px]">
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#52697d]">
                  {request.description || "Tidak ada deskripsi."}
                </p>
              </div>
            </div>

            {/* METADATA */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <InfoCard
                icon={<User size={16} />}
                label="Dibuat Oleh"
                value={request.user?.name ?? "-"}
                secondary={request.user?.email ?? "-"}
              />
              <InfoCard
                icon={<CalendarDays size={16} />}
                label="Dibuat Pada"
                value={formatDate(request.created_at)}
              />
              <InfoCard
                icon={<Clock3 size={16} />}
                label="Submitted"
                value={formatDate(request.submitted_at)}
              />
              <InfoCard
                icon={<CheckCircle2 size={16} />}
                label="Approved"
                value={formatDate(request.approved_at)}
              />
              <InfoCard
                icon={<XCircle size={16} />}
                label="Rejected"
                value={formatDate(request.rejected_at)}
                iconClassName="text-[#d34a4a] bg-[#fff1f1]"
                className="sm:col-span-2 lg:col-span-1"
              />
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#dce5ed] bg-white shadow-[0_3px_14px_rgba(27,61,91,0.04)]">
          <SectionHeader
            eyebrow="Workflow"
            title="Approval Timeline"
            count={`${timeline.length} aktivitas`}
          />

          {timeline.length === 0 ? (
            <EmptyState text="Belum ada aktivitas pada timeline." />
          ) : (
            <div className="px-5 py-5 sm:px-7 sm:py-6">
              <div className="relative">
                {timeline.map((item: any, index: number) => {
                  const isLast = index === timeline.length - 1;
                  const status = String(item.status ?? "").toLowerCase();

                  return (
                    <div
                      key={item.id ?? index}
                      className={`relative flex gap-3.5 ${isLast ? "pb-0" : "pb-4"}`}
                    >
                      <div className="relative flex w-5 shrink-0 justify-center">
                        {!isLast && (
                          <span className="absolute left-1/2 top-5 h-[calc(100%+2px)] w-px -translate-x-1/2 bg-[#dbe4ec]" />
                        )}
                        <span
                          className={`relative z-10 mt-1.5 h-3.5 w-3.5 rounded-full ring-4 ${timelineStatusClass(status)}`}
                        />
                      </div>

                      <div className="-mt-0.5 min-w-0 flex-1 rounded-xl border border-[#e1e8ef] bg-[#fbfcfd] px-4 py-3.5 sm:px-5">
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-bold capitalize text-[#17324d]">
                              {item.status || "Aktivitas"}
                            </p>
                            <p className="mt-1 text-xs text-[#718599]">
                              {item.user?.name || "-"}
                            </p>
                          </div>
                          <span className="whitespace-nowrap text-[11px] text-[#8495a5]">
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        <p className="mt-3 rounded-lg bg-white px-3 py-2.5 text-sm leading-5 text-[#60768a] ring-1 ring-[#edf1f5]">
                          {item.comment ||
                            (status === "submitted"
                              ? "Request submitted"
                              : "Status request diperbarui.")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* HISTORY */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#dce5ed] bg-white shadow-[0_3px_14px_rgba(27,61,91,0.04)]">
          <SectionHeader
            eyebrow="Audit Trail"
            title="Approval History"
            count={`${history.length} aktivitas`}
          />

          {history.length === 0 ? (
            <EmptyState text="Belum ada approval history." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-[#e3eaf1] bg-[#f8fafc]">
                    {[
                      "Dari",
                      "Ke",
                      "Oleh",
                      "Komentar",
                      "Waktu",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#718599] sm:px-6"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#edf1f5] last:border-0 hover:bg-[#fbfcfe]"
                    >
                      <td className="px-5 py-4 text-sm capitalize text-[#50677d] sm:px-6">
                        {item.from_status || "-"}
                      </td>
                      <td className="px-5 py-4 sm:px-6">
                        <span className="inline-flex rounded-md border border-[#dce7f1] bg-[#f3f7fb] px-2.5 py-1 text-[11px] font-bold capitalize text-[#45647f]">
                          {item.to_status || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#29465f] sm:px-6">
                        {item.user?.name || "-"}
                      </td>
                      <td className="max-w-[320px] px-5 py-4 text-sm leading-5 text-[#60768a] sm:px-6">
                        {item.comment || "-"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#7d8f9f] sm:px-6">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* CONFIRM MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#dce5ed] bg-white shadow-[0_24px_70px_rgba(20,55,90,0.2)]">
            <div className="p-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff6dc] text-[#b77b00]">
                  <AlertTriangle size={21} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#17324d]">Konfirmasi</h2>
                  <p className="mt-1.5 text-sm leading-5 text-[#718599]">
                    {confirmAction === "submit" &&
                      "Yakin ingin submit request ini?"}
                    {confirmAction === "approve" &&
                      "Yakin ingin approve request ini?"}
                    {confirmAction === "delete" &&
                      "Yakin ingin menghapus request ini? Data yang dihapus tidak dapat dikembalikan."}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#e2e9f0] bg-[#f7f9fb] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a9aaa]">
                  Request
                </p>
                <p className="mt-1 text-sm font-bold text-[#17324d]">
                  {request.title}
                </p>
                <p className="mt-1 text-xs text-[#718599]">
                  Request ID #{request.id}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#e7edf3] bg-[#fbfcfd] px-6 py-4">
              <button
                type="button"
                disabled={confirmLoading}
                onClick={() => {
                  setConfirmAction(null);
                  setConfirmLoading(false);
                }}
                className="h-10 rounded-lg border border-[#d7e1ea] bg-white px-4 text-sm font-semibold text-[#53687c] transition hover:bg-[#f5f8fb] disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={confirmLoading}
                onClick={() => {
                  if (confirmAction === "submit") handleSubmit();
                  if (confirmAction === "approve") handleApprove();
                  if (confirmAction === "delete") handleDelete();
                }}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  confirmAction === "delete"
                    ? "bg-[#c53b3b] hover:bg-[#b53232]"
                    : "bg-[#0b5eb8] hover:bg-[#084b95]"
                }`}
              >
                {confirmLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    {confirmAction === "submit" && (
                      <>
                        <Send size={16} />
                        Ya, Submit
                      </>
                    )}
                    {confirmAction === "approve" && (
                      <>
                        <CheckCircle2 size={16} />
                        Ya, Approve
                      </>
                    )}
                    {confirmAction === "delete" && (
                      <>
                        <Trash2 size={16} />
                        Ya, Hapus
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#dce5ed] bg-white shadow-[0_24px_70px_rgba(20,55,90,0.2)]">
            <div className="flex items-start justify-between border-b border-[#e7edf3] px-6 py-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#c53b3b]">
                  <XCircle size={21} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#17324d]">Tolak Request</h2>
                  <p className="mt-1 text-sm text-[#718599]">
                    Berikan alasan mengapa request ini ditolak.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectComment("");
                }}
                className="rounded-lg p-2 text-[#8a9aaa] transition hover:bg-[#f3f6f9] hover:text-[#53687c]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-xl border border-[#e2e9f0] bg-[#f7f9fb] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a9aaa]">
                  Request
                </p>
                <p className="mt-1 text-sm font-bold text-[#17324d]">
                  {request.title}
                </p>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="reject-comment"
                    className="text-sm font-semibold text-[#36526b]"
                  >
                    Alasan Penolakan
                  </label>
                  <span className="text-[11px] text-[#8a9aaa]">
                    {rejectComment.length}/500
                  </span>
                </div>

                <textarea
                  id="reject-comment"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  rows={5}
                  maxLength={500}
                  placeholder="Tulis alasan penolakan..."
                  className="w-full resize-none rounded-xl border border-[#d7e1ea] bg-white p-4 text-sm text-[#27445f] outline-none transition placeholder:text-[#9aa9b7] focus:border-[#c53b3b] focus:ring-2 focus:ring-[#fdeaea]"
                  autoFocus
                />
                <p className="mt-2 text-xs text-[#8a9aaa]">
                  Alasan akan disimpan pada approval history.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#e7edf3] bg-[#fbfcfd] px-6 py-4">
              <button
                type="button"
                disabled={rejectLoading}
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectComment("");
                }}
                className="h-10 rounded-lg border border-[#d7e1ea] bg-white px-4 text-sm font-semibold text-[#53687c] transition hover:bg-[#f5f8fb] disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={rejectLoading || !rejectComment.trim()}
                onClick={handleReject}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#c53b3b] px-4 text-sm font-semibold text-white transition hover:bg-[#b53232] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rejectLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Menolak...
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    Tolak Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  secondary,
  className = "",
  iconClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[#e1e8ef] bg-white px-4 py-3.5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf3fb] text-[#0b5eb8] ${iconClassName}`}
        >
          {icon}
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8495a5]">
            {label}
          </p>
          <p className="mt-1 truncate text-sm font-bold text-[#17324d]">
            {value}
          </p>
          {secondary && (
            <p className="mt-0.5 truncate text-xs text-[#718599]">
              {secondary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-[#e5ebf1] px-5 py-4 sm:px-7">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8495a5]">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-bold text-[#17324d]">{title}</h2>
      </div>
      <span className="rounded-full bg-[#f2f6fa] px-2.5 py-1 text-[11px] font-semibold text-[#718599]">
        {count}
      </span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="px-5 py-6 sm:px-7">
      <div className="rounded-xl border border-dashed border-[#cbd8e4] bg-[#f8fafc] px-5 py-8 text-center text-sm text-[#718599]">
        {text}
      </div>
    </div>
  );
}