"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Send,
  Loader2,
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

    // Cegah submit dua kali
    if (loading) return;

    if (!title.trim() || !description.trim()) {
      toast.error("Semua field wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // HANYA SATU KALI POST
      const response = await createApprovalRequest({
        title: title.trim(),
        description: description.trim(),
      });

      toast.success("Draft berhasil dibuat.");

      // Ambil ID dari response
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
    <div className="space-y-6">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Buat Request
        </h1>

        <p className="mt-2 text-slate-500">
          Isi formulir berikut untuk membuat approval request.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="space-y-6">

          {/* Title */}
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
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh : Pembelian Laptop Baru"
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-[#0B4EA2] disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-semibold">
              Deskripsi
            </label>

            <textarea
              rows={7}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan alasan request..."
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-[#0B4EA2] disabled:bg-slate-100"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-6 py-3 font-semibold text-white hover:bg-[#083d83] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Simpan Draft
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}