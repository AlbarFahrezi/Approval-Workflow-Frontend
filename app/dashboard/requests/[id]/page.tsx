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
  CircleDot,
  History,
  ShieldCheck,
  ClipboardList,
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

  const params =
    useParams<{ id: string }>();

  const [loading, setLoading] =
    useState(true);

  const [request, setRequest] =
    useState<ApprovalRequest | null>(
      null
    );

  const [timeline, setTimeline] =
    useState<any[]>([]);

  const [history, setHistory] =
    useState<any[]>([]);

  const [
    showRejectModal,
    setShowRejectModal,
  ] = useState(false);

  const [
    rejectComment,
    setRejectComment,
  ] = useState("");

  const [
    rejectLoading,
    setRejectLoading,
  ] = useState(false);

  const [
    confirmAction,
    setConfirmAction,
  ] = useState<
    "submit" |
    "approve" |
    "delete" |
    null
  >(null);

  const [
    confirmLoading,
    setConfirmLoading,
  ] = useState(false);

  const currentUser =
    getStoredUser();

  const currentUserRole =
    String(
      currentUser?.role ?? ""
    )
      .trim()
      .toLowerCase();

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);

        const id =
          Number(params.id);

        if (!id) {
          throw new Error(
            "ID request tidak valid."
          );
        }

        const [
          requestData,
          timelineData,
          historyData,
        ] = await Promise.all([
          getApprovalRequest(id),
          getApprovalTimeline(id),
          getApprovalHistory(id),
        ]);

        setRequest(requestData);

        setTimeline(timelineData);

        setHistory(historyData);
      } catch (error) {
        console.error(error);

        toast.error(
          "Gagal mengambil detail request."
        );
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      void loadDetail();
    }
  }, [params.id]);

  async function refreshRequest(
    id: number
  ) {
    const [
      updatedRequest,
      updatedTimeline,
      updatedHistory,
    ] = await Promise.all([
      getApprovalRequest(id),
      getApprovalTimeline(id),
      getApprovalHistory(id),
    ]);

    setRequest(updatedRequest);

    setTimeline(updatedTimeline);

    setHistory(updatedHistory);
  }

  async function handleDelete() {
    if (!request) {
      return;
    }

    try {
      setConfirmLoading(true);

      await deleteApprovalRequest(
        request.id
      );

      toast.success(
        "Request berhasil dihapus."
      );

      router.push(
        "/dashboard/requests"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal menghapus request."
      );
    } finally {
      setConfirmLoading(false);

      setConfirmAction(null);
    }
  }

  async function handleSubmit() {
    if (!request) {
      return;
    }

    try {
      setConfirmLoading(true);

      await submitApprovalRequest(
        request.id
      );

      await refreshRequest(
        request.id
      );

      toast.success(
        "Request berhasil disubmit."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal submit request."
      );
    } finally {
      setConfirmLoading(false);

      setConfirmAction(null);
    }
  }

  async function handleApprove() {
    if (!request) {
      return;
    }

    try {
      setConfirmLoading(true);

      await approveApprovalRequest(
        request.id
      );

      await refreshRequest(
        request.id
      );

      toast.success(
        "Request berhasil diapprove."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal approve request."
      );
    } finally {
      setConfirmLoading(false);

      setConfirmAction(null);
    }
  }

  async function handleReject() {
    if (!request) {
      return;
    }

    if (!rejectComment.trim()) {
      toast.error(
        "Alasan reject wajib diisi."
      );

      return;
    }

    try {
      setRejectLoading(true);

      await rejectApprovalRequest(
        request.id,
        rejectComment.trim()
      );

      await refreshRequest(
        request.id
      );

      setRejectComment("");

      setShowRejectModal(false);

      toast.success(
        "Request berhasil direject."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal reject request."
      );
    } finally {
      setRejectLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="flex flex-col items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center bg-[#EDF5FF]">

            <Loader2
              size={28}
              className="animate-spin text-[#0B4EA2]"
            />

          </div>

          <div className="text-center">

            <p className="font-bold text-slate-800">
              Memuat Detail Request
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Mengambil informasi request
              dan approval history.
            </p>

          </div>

        </div>

      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="max-w-md border border-slate-200 bg-white p-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#EDF5FF] text-[#0B4EA2]">

            <FileText size={25} />

          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Request Tidak Ditemukan
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Data request yang kamu buka
            mungkin sudah dihapus atau
            tidak tersedia.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/requests"
              )
            }
            className="mt-6 inline-flex h-11 items-center gap-2 bg-[#0B4EA2] px-5 text-sm font-bold text-white transition hover:bg-[#083D82]"
          >

            <ArrowLeft size={17} />

            Kembali ke Request

          </button>

        </div>

      </div>
    );
  }

  const normalizedStatus =
    String(
      request.status ?? ""
    )
      .trim()
      .toLowerCase();

  const canManageDraft =
    (
      currentUserRole ===
        "employee" ||
      currentUserRole ===
        "manager"
    ) &&
    normalizedStatus === "draft";

  const canApprove =
    currentUserRole ===
      "manager" &&
    normalizedStatus ===
      "submitted";

  const statusMeta = {
    draft: {
      label: "Draft",
      icon: <FileText size={15} />,
      badge:
        "border-slate-300 bg-slate-100 text-slate-600",
    },

    submitted: {
      label: "Menunggu Approval",
      icon: <Clock3 size={15} />,
      badge:
        "border-amber-200 bg-amber-50 text-amber-700",
    },

    approved: {
      label: "Approved",
      icon: <CheckCircle2 size={15} />,
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    rejected: {
      label: "Rejected",
      icon: <XCircle size={15} />,
      badge:
        "border-red-200 bg-red-50 text-red-700",
    },
  } as const;

  const currentStatus =
    statusMeta[
      normalizedStatus as
        keyof typeof statusMeta
    ] ??
    statusMeta.draft;

  const formatDate = (
    value?: string | null
  ) => {
    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "-";
    }

    return date.toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const timelineStatusClass = (
    status?: string
  ) => {
    const value =
      String(
        status ?? ""
      ).toLowerCase();

    if (
      value === "approved"
    ) {
      return "bg-emerald-500";
    }

    if (
      value === "rejected"
    ) {
      return "bg-red-500";
    }

    if (
      value === "submitted"
    ) {
      return "bg-[#0B4EA2]";
    }

    return "bg-slate-400";
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-10">

      {/* HERO HEADER */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* subtle brand accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[#0B4EA2]" />
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#0B4EA2]/[0.035] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#5BA8D8]/[0.04] blur-3xl" />

        <div className="relative min-h-[300px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">

          {/* TOP BAR */}
          <div className="flex items-start justify-between gap-4">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/requests"
                )
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#0B4EA2]/30 hover:bg-[#F5F9FF] hover:text-[#0B4EA2]"
            >
              <ArrowLeft size={15} />
              Kembali ke Request
            </button>

            <div className="flex flex-wrap justify-end gap-2">

              {canManageDraft && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/requests/${request.id}/edit`
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition hover:border-[#0B4EA2]/30 hover:bg-[#F5F9FF] hover:text-[#0B4EA2]"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmAction("submit")
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0B4EA2] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#083D82]"
                  >
                    <Send size={15} />
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmAction("delete")
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </>
              )}

              {canApprove && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmAction("approve")
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={15} />
                    Approve Request
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowRejectModal(true)
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </>
              )}

            </div>
          </div>

          {/* CENTERED HEADING */}
          <div className="mx-auto mt-8 max-w-4xl text-center sm:mt-10">

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#F4B400]" />

              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0B4EA2]">
                Request Detail
              </span>

              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                #{request.id}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-[#18324B] sm:text-4xl lg:text-[42px]">
              {request.title}
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Tinjau detail request, status approval, aktivitas, dan riwayat perubahan pada pengajuan ini.
            </p>

            <div
              className={`mx-auto mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold ${currentStatus.badge}`}
            >
              {currentStatus.icon}
              {currentStatus.label}
            </div>

          </div>

        </div>

      </section>

      {/* STATUS STRIP */}

      <section className="grid border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">

        <StatusStep
          label="Draft"
          active={
            normalizedStatus ===
              "draft"
          }
          completed={
            [
              "submitted",
              "approved",
              "rejected",
            ].includes(
              normalizedStatus
            )
          }
          icon={
            <FileText size={17} />
          }
        />

        <StatusStep
          label="Submitted"
          active={
            normalizedStatus ===
              "submitted"
          }
          completed={
            [
              "approved",
              "rejected",
            ].includes(
              normalizedStatus
            )
          }
          icon={
            <Send size={17} />
          }
        />

        <StatusStep
          label="Approved"
          active={
            normalizedStatus ===
              "approved"
          }
          completed={false}
          icon={
            <CheckCircle2
              size={17}
            />
          }
          success
        />

        <StatusStep
          label="Rejected"
          active={
            normalizedStatus ===
              "rejected"
          }
          completed={false}
          icon={
            <XCircle size={17} />
          }
          danger
        />

      </section>

      {/* MAIN GRID */}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">

        <div className="space-y-6">

          <section className="border border-slate-200 bg-white">

            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">

              <div className="flex h-10 w-10 items-center justify-center bg-[#EDF5FF] text-[#0B4EA2]">

                <ClipboardList
                  size={20}
                />

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Request Information
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Deskripsi Request
                </h2>

              </div>

            </div>

            <div className="p-6">

              <div className="min-h-[230px] border-l-4 border-[#0B4EA2] bg-slate-50 p-5">

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {request.description ||
                    "Tidak ada deskripsi request."}
                </p>

              </div>

            </div>

          </section>

          <section className="border border-slate-200 bg-white">

            <SectionHeader
              icon={
                <Clock3 size={19} />
              }
              eyebrow="Workflow Activity"
              title="Approval Timeline"
              count={`${timeline.length} aktivitas`}
            />

            {timeline.length ===
            0 ? (

              <EmptyState
                text="Belum ada aktivitas pada timeline."
              />

            ) : (

              <div className="p-6">

                <div className="relative">

                  {timeline.map(
                    (
                      item: any,
                      index: number
                    ) => {
                      const isLast =
                        index ===
                        timeline.length -
                          1;

                      const status =
                        String(
                          item.status ??
                            ""
                        ).toLowerCase();

                      return (

                        <div
                          key={
                            item.id ??
                            index
                          }
                          className={`relative flex gap-4 ${
                            isLast
                              ? ""
                              : "pb-7"
                          }`}
                        >

                          <div className="relative flex w-5 shrink-0 justify-center">

                            {!isLast && (

                              <span className="absolute top-5 h-[calc(100%+12px)] w-px bg-slate-200" />

                            )}

                            <span
                              className={`relative z-10 mt-1 flex h-4 w-4 items-center justify-center border-4 border-white ${timelineStatusClass(
                                status
                              )}`}
                            />

                          </div>

                          <div className="min-w-0 flex-1 border border-slate-200 bg-slate-50">

                            <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                              <div>

                                <p className="text-sm font-bold capitalize text-slate-800">
                                  {item.status ||
                                    "Aktivitas"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {item.user
                                    ?.name ||
                                    "-"}
                                </p>

                              </div>

                              <span className="text-xs text-slate-400">
                                {formatDate(
                                  item.created_at
                                )}
                              </span>

                            </div>

                            <div className="px-4 py-4">

                              <p className="text-sm leading-6 text-slate-600">

                                {item.comment ||
                                  (
                                    status ===
                                    "submitted"
                                      ? "Request berhasil disubmit dan menunggu proses review."
                                      : "Status request diperbarui."
                                  )}

                              </p>

                            </div>

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

              </div>

            )}

          </section>

          <section className="overflow-hidden border border-slate-200 bg-white">

            <SectionHeader
              icon={
                <History size={19} />
              }
              eyebrow="Audit Trail"
              title="Approval History"
              count={`${history.length} aktivitas`}
            />

            {history.length ===
            0 ? (

              <EmptyState
                text="Belum ada approval history."
              />

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[760px]">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50">

                      {[
                        "Status Sebelumnya",
                        "Status Baru",
                        "Dilakukan Oleh",
                        "Komentar",
                        "Waktu",
                      ].map(
                        (heading) => (

                          <th
                            key={heading}
                            className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
                          >

                            {heading}

                          </th>

                        )
                      )}

                    </tr>

                  </thead>

                  <tbody>

                    {history.map(
                      (item: any) => (

                        <tr
                          key={item.id}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">

                            <StatusLabel
                              value={
                                item.from_status ||
                                "-"
                              }
                            />

                          </td>

                          <td className="px-6 py-4">

                            <StatusLabel
                              value={
                                item.to_status ||
                                "-"
                              }
                              highlight
                            />

                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-slate-700">

                            {item.user
                              ?.name ||
                              "-"}

                          </td>

                          <td className="max-w-[300px] px-6 py-4 text-sm leading-6 text-slate-500">

                            {item.comment ||
                              "-"}

                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-400">

                            {formatDate(
                              item.created_at
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

        <aside className="space-y-6">

          <section className="border border-slate-200 bg-white">

            <div className="border-b border-slate-200 bg-[#263f5f] px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center bg-white/10 text-white">

                  <ShieldCheck
                    size={18}
                  />

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
                    Request Data
                  </p>

                  <h2 className="mt-1 text-base font-bold text-white">
                    Informasi Request
                  </h2>

                </div>

              </div>

            </div>

            <div className="divide-y divide-slate-100">

              <InfoRow
                icon={
                  <User size={17} />
                }
                label="Dibuat Oleh"
                value={
                  request.user
                    ?.name ?? "-"
                }
                secondary={
                  request.user
                    ?.email
                }
              />

              <InfoRow
                icon={
                  <CalendarDays
                    size={17}
                  />
                }
                label="Tanggal Dibuat"
                value={formatDate(
                  request.created_at
                )}
              />

              <InfoRow
                icon={
                  <Send size={17} />
                }
                label="Submitted"
                value={formatDate(
                  request.submitted_at
                )}
              />

              <InfoRow
                icon={
                  <CheckCircle2
                    size={17}
                  />
                }
                label="Approved"
                value={formatDate(
                  request.approved_at
                )}
                success
              />

              <InfoRow
                icon={
                  <XCircle size={17} />
                }
                label="Rejected"
                value={formatDate(
                  request.rejected_at
                )}
                danger
              />

            </div>

          </section>

          <section className="border border-slate-200 bg-white p-5">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Current Status
            </p>

            <div className="mt-4 flex items-center gap-4">

              <div
                className={`flex h-12 w-12 items-center justify-center border ${currentStatus.badge}`}
              >

                {currentStatus.icon}

              </div>

              <div>

                <p className="text-base font-bold text-slate-900">
                  {currentStatus.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">

                  {normalizedStatus ===
                    "submitted" &&
                    "Request sedang menunggu keputusan dari Manager."}

                  {normalizedStatus ===
                    "approved" &&
                    "Request telah disetujui dan proses selesai."}

                  {normalizedStatus ===
                    "rejected" &&
                    "Request ditolak dan keputusan telah dicatat."}

                  {normalizedStatus ===
                    "draft" &&
                    "Request masih dalam tahap draft dan belum disubmit."}

                </p>

              </div>

            </div>

          </section>

        </aside>

      </section>

      {/* CONFIRM MODAL */}

      {confirmAction && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl">

            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-amber-50 text-amber-600">

                  <AlertTriangle
                    size={21}
                  />

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Konfirmasi Aksi
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Apakah kamu yakin?
                  </h2>

                </div>

              </div>

            </div>

            <div className="p-6">

              <p className="text-sm leading-6 text-slate-600">

                {confirmAction ===
                  "submit" &&
                  "Request akan dikirim untuk menunggu proses approval."}

                {confirmAction ===
                  "approve" &&
                  "Request akan disetujui dan status approval akan diperbarui."}

                {confirmAction ===
                  "delete" &&
                  "Request akan dihapus secara permanen dan tidak dapat dikembalikan."}

              </p>

              <div className="mt-5 border border-slate-200 bg-slate-50 p-4">

                <p className="text-xs font-bold text-slate-900">
                  {request.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Request ID #{request.id}
                </p>

              </div>

            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                disabled={
                  confirmLoading
                }
                onClick={() =>
                  setConfirmAction(
                    null
                  )
                }
                className="h-10 border border-slate-300 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
              >

                Batal

              </button>

              <button
                type="button"
                disabled={
                  confirmLoading
                }
                onClick={() => {

                  if (
                    confirmAction ===
                    "submit"
                  ) {
                    void handleSubmit();
                  }

                  if (
                    confirmAction ===
                    "approve"
                  ) {
                    void handleApprove();
                  }

                  if (
                    confirmAction ===
                    "delete"
                  ) {
                    void handleDelete();
                  }

                }}
                className={`inline-flex h-10 items-center gap-2 px-4 text-sm font-bold text-white transition disabled:opacity-60 ${
                  confirmAction ===
                  "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#0B4EA2] hover:bg-[#083D82]"
                }`}
              >

                {confirmLoading ? (

                  <>

                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Memproses...

                  </>

                ) : (

                  <>

                    {confirmAction ===
                      "submit" &&
                      "Ya, Submit"}

                    {confirmAction ===
                      "approve" &&
                      "Ya, Approve"}

                    {confirmAction ===
                      "delete" &&
                      "Ya, Hapus"}

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* REJECT MODAL */}

      {showRejectModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 items-center justify-center bg-red-50 text-red-600">

                  <XCircle
                    size={22}
                  />

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-red-500">
                    Reject Request
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Tolak Request
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Berikan alasan penolakan
                    request.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(
                    false
                  );

                  setRejectComment(
                    ""
                  );
                }}
                className="p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >

                <X size={19} />

              </button>

            </div>

            <div className="p-6">

              <div className="border border-slate-200 bg-slate-50 p-4">

                <p className="text-xs font-bold text-slate-900">
                  {request.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Request ID #{request.id}
                </p>

              </div>

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="reject-comment"
                    className="text-sm font-bold text-slate-700"
                  >
                    Alasan Penolakan
                  </label>

                  <span className="text-xs text-slate-400">
                    {rejectComment.length}
                    /500
                  </span>

                </div>

                <textarea
                  id="reject-comment"
                  value={
                    rejectComment
                  }
                  onChange={(event) =>
                    setRejectComment(
                      event.target.value
                    )
                  }
                  rows={5}
                  maxLength={500}
                  placeholder="Tulis alasan mengapa request ini ditolak..."
                  className="w-full resize-none border border-slate-300 bg-white p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  autoFocus
                />

              </div>

            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                disabled={
                  rejectLoading
                }
                onClick={() => {
                  setShowRejectModal(
                    false
                  );

                  setRejectComment(
                    ""
                  );
                }}
                className="h-10 border border-slate-300 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
              >

                Batal

              </button>

              <button
                type="button"
                disabled={
                  rejectLoading ||
                  !rejectComment.trim()
                }
                onClick={() =>
                  void handleReject()
                }
                className="inline-flex h-10 items-center gap-2 bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {rejectLoading ? (

                  <>

                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Menolak...

                  </>

                ) : (

                  <>

                    <XCircle
                      size={16}
                    />

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

/* ================================
   STATUS STEP
================================ */

function StatusStep({
  label,
  active,
  completed,
  icon,
  success = false,
  danger = false,
}: {
  label: string;
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
  success?: boolean;
  danger?: boolean;
}) {
  const activeClass =
    danger
      ? "border-red-500 bg-red-50 text-red-600"
      : success
      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
      : "border-[#0B4EA2] bg-[#EDF5FF] text-[#0B4EA2]";

  return (
    <div className="flex min-h-[100px] items-center gap-4 border-b border-slate-200 px-6 py-5 last:border-b-0 sm:border-r lg:border-b-0">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center border ${
          active
            ? activeClass
            : completed
            ? "border-[#0B4EA2] bg-[#0B4EA2] text-white"
            : "border-slate-200 bg-slate-50 text-slate-400"
        }`}
      >

        {completed ? (
          <CheckCircle2
            size={18}
          />
        ) : (
          icon
        )}

      </div>

      <div>

        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
          Workflow Step
        </p>

        <p
          className={`mt-1 text-sm font-bold ${
            active
              ? "text-slate-900"
              : "text-slate-500"
          }`}
        >
          {label}
        </p>

      </div>

    </div>
  );
}

/* ================================
   INFO ROW
================================ */

function InfoRow({
  icon,
  label,
  value,
  secondary,
  success = false,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
  success?: boolean;
  danger?: boolean;
}) {
  const iconClass =
    danger
      ? "bg-red-50 text-red-500"
      : success
      ? "bg-emerald-50 text-emerald-600"
      : "bg-[#EDF5FF] text-[#0B4EA2]";

  return (
    <div className="flex gap-3 px-5 py-4">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-slate-800">
          {value}
        </p>

        {secondary && (

          <p className="mt-1 truncate text-xs text-slate-500">
            {secondary}
          </p>

        )}

      </div>

    </div>
  );
}

/* ================================
   SECTION HEADER
================================ */

function SectionHeader({
  icon,
  eyebrow,
  title,
  count,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  count: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center bg-[#EDF5FF] text-[#0B4EA2]">
          {icon}
        </div>

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {title}
          </h2>

        </div>

      </div>

      <span className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">
        {count}
      </span>

    </div>
  );
}

/* ================================
   STATUS LABEL
================================ */

function StatusLabel({
  value,
  highlight = false,
}: {
  value: string;
  highlight?: boolean;
}) {
  const status =
    value.toLowerCase();

  const color =
    status === "approved"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "rejected"
      ? "border-red-200 bg-red-50 text-red-700"
      : status === "submitted"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : highlight
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex border px-2.5 py-1 text-[11px] font-bold capitalize ${color}`}
    >
      {value}
    </span>
  );
}

/* ================================
   EMPTY STATE
================================ */

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-6">

      <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">

        <CircleDot
          size={24}
          className="text-slate-400"
        />

        <p className="mt-3 text-sm text-slate-500">
          {text}
        </p>

      </div>

    </div>
  );
}