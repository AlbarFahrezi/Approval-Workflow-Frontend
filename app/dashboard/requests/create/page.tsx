  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import {
    ArrowLeft,
    FileText,
    Send,
    Loader2,
    ClipboardList,
    Info,
    CheckCircle2,
    ChevronRight,
  } from "lucide-react";
  import { toast } from "sonner";

  import { createApprovalRequest } from "@/services/approvalRequest";

  export default function CreateRequestPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (loading) return;

      if (!title.trim() || !description.trim()) {
        toast.error("Judul dan deskripsi wajib diisi.");
        return;
      }

      try {
        setLoading(true);

        const response = await createApprovalRequest({
          title: title.trim(),
          description: description.trim(),
        });

        toast.success("Draft berhasil dibuat.");

        const id = response.data.id;

        router.push(`/dashboard/requests/${id}`);
      } catch (error) {
        console.error(error);
        toast.error("Gagal membuat request.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
        <div className="mx-auto w-full max-w-[1240px] px-5 py-6 sm:px-8 lg:px-10">

          {/* TOP BAR */}
          <div className="mb-7 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#1557a6]"
            >
              <ArrowLeft
                size={17}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Kembali
            </button>

            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span>Requests</span>
              <ChevronRight size={13} />
              <span className="text-slate-600">Buat Request</span>
            </div>
          </div>

          {/* PAGE INTRO */}
          <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-[#1557a6]">
                  <ClipboardList size={17} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Approval Management
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Buat Request
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Ajukan kebutuhan baru untuk diproses melalui alur approval.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Draft
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">

            {/* FORM */}
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">

              {/* FORM HEADER */}
              <div className="border-b border-slate-200 px-6 py-5 sm:px-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                    <FileText size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Informasi Request
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Isi informasi berikut sebelum menyimpan pengajuan.
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-7 px-6 py-7 sm:px-7">

                  {/* TITLE */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium text-slate-800"
                      >
                        Judul Request
                      </label>

                      <span className="text-[11px] font-medium text-slate-400">
                        Wajib
                      </span>
                    </div>

                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Pengadaan Laptop"
                      disabled={loading}
                      className="
                        h-11 w-full rounded-md
                        border border-slate-300
                        bg-white px-3.5
                        text-sm text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        hover:border-slate-400
                        focus:border-[#1557a6]
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:bg-slate-50
                      "
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Gunakan judul yang singkat dan mudah dipahami.
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-slate-800"
                      >
                        Deskripsi
                      </label>

                      <span className="text-[11px] font-medium text-slate-400">
                        Wajib
                      </span>
                    </div>

                    <textarea
                      id="description"
                      rows={9}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Jelaskan kebutuhan, alasan pengajuan, tujuan, dan informasi pendukung lainnya..."
                      disabled={loading}
                      className="
                        w-full resize-y rounded-md
                        border border-slate-300
                        bg-white px-3.5 py-3
                        text-sm leading-6 text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        hover:border-slate-400
                        focus:border-[#1557a6]
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:bg-slate-50
                      "
                    />

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        Pastikan informasi cukup jelas untuk proses approval.
                      </p>

                      <span className="text-xs tabular-nums text-slate-400">
                        {description.length} karakter
                      </span>
                    </div>
                  </div>
                </div>

                {/* FORM ACTION */}
                <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <p className="text-xs text-slate-400">
                    Request akan disimpan sebagai draft.
                  </p>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => router.back()}
                      className="
                        h-10 rounded-md
                        border border-slate-300
                        bg-white px-5
                        text-sm font-medium text-slate-600
                        transition
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        inline-flex h-10 items-center
                        justify-center gap-2
                        rounded-md
                        bg-[#1557a6]
                        px-5
                        text-sm font-medium text-white
                        transition
                        hover:bg-[#104887]
                        active:bg-[#0d3c73]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Simpan Draft
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </section>

            {/* SIDEBAR */}
            <aside className="space-y-5">

              {/* WORKFLOW */}
              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Workflow Approval
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Tahapan request setelah dibuat.
                  </p>
                </div>

                <div className="px-5 py-5">

                  {/* STEP 1 */}
                  <div className="relative flex gap-3 pb-7">
                    <div className="relative flex shrink-0 justify-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                        1
                      </div>

                      <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-slate-200" />
                    </div>

                    <div className="pt-0.5">
                      <p className="text-sm font-semibold text-slate-800">
                        Draft
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Request dibuat dan masih dapat diedit.
                      </p>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className="relative flex gap-3 pb-7">
                    <div className="relative flex shrink-0 justify-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-[#1557a6] ring-1 ring-blue-100">
                        2
                      </div>

                      <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-slate-200" />
                    </div>

                    <div className="pt-0.5">
                      <p className="text-sm font-semibold text-slate-800">
                        Submitted
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Request dikirim untuk diproses.
                      </p>
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-100">
                      3
                    </div>

                    <div className="pt-0.5">
                      <p className="text-sm font-semibold text-slate-800">
                        Approval
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Manager melakukan approve atau reject.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* INFORMATION */}
              <section className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#1557a6]">
                    <Info size={16} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Sebelum menyimpan
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      Pastikan judul dan deskripsi sudah menjelaskan kebutuhan
                      request dengan jelas.
                    </p>
                  </div>
                </div>
              </section>

              {/* DRAFT STATUS */}
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Disimpan sebagai Draft
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      Data belum masuk proses approval dan masih dapat
                      diperbarui.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          {/* FOOTER */}
          <footer className="flex flex-col gap-2 py-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Approval Management System</span>
            <span>Request Creation</span>
          </footer>
        </div>
      </div>
    );
  } 