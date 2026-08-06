"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { createApprovalRequest } from "@/services/approvalRequest";

export default function CreateRequestPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error(
        "Semua field wajib diisi."
      );
      return;
    }

    try {
      setLoading(true);

      await createApprovalRequest({
        title,
        description,
      });

      toast.success(
        "Pengajuan berhasil dibuat."
      );

    const response = await createApprovalRequest({
  title,
  description,
});

toast.success("Draft berhasil dibuat.");

router.push(
  `/dashboard/requests/${response.data.id}`
);
    } catch (err) {
      console.error(err);

      toast.error(
        "Gagal membuat pengajuan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      <div>

        <h1 className="text-3xl font-bold">
          Buat Pengajuan
        </h1>

        <p className="mt-2 text-slate-500">
          Isi formulir berikut untuk membuat approval request.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >

        <div className="space-y-6">

          <div>

            <label className="mb-2 block font-semibold">
              Judul
            </label>

            <div className="relative">

              <FileText
                size={18}
                className="absolute left-4 top-4 text-slate-400"
              />

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Contoh : Pembelian Laptop Baru"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-[#0B4EA2]"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Deskripsi
            </label>

            <textarea
              rows={7}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Tuliskan alasan pengajuan..."
              className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-[#0B4EA2]"
            />

          </div>

          <div className="flex justify-end">

            <button
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-6 py-3 font-semibold text-white hover:bg-[#083d83] disabled:opacity-60"
            >
              <Send size={18} />

              {loading
                ? "Menyimpan..."
                : "Simpan Draft"}
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}