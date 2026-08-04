"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import {
  getApprovalRequest,
  updateApprovalRequest,
} from "@/services/approvalRequest";

export default function EditRequestPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadRequest();
  }, []);

  async function loadRequest() {
    try {
      setLoading(true);

      const data =
        await getApprovalRequest(id);

      setTitle(data.title);
      setDescription(data.description);
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal mengambil data request."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Judul wajib diisi.");
      return;
    }

    if (!description.trim()) {
      toast.error("Deskripsi wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      await updateApprovalRequest(id, {
        title,
        description,
      });

      toast.success(
        "Request berhasil diperbarui."
      );

      router.push(
        `/dashboard/requests/${id}`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Gagal memperbarui request."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <RefreshCw
          size={28}
          className="animate-spin text-[#0B4EA2]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <button
        onClick={() =>
          router.back()
        }
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Edit Pengajuan
        </h1>

        <p className="mt-2 text-slate-500">
          Perbarui data pengajuan approval.
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Masukkan judul..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-[#0B4EA2]"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Deskripsi
            </label>

            <textarea
              rows={8}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Masukkan deskripsi..."
              className="w-full rounded-xl border border-slate-200 p-4 outline-none transition focus:border-[#0B4EA2]"
            />

          </div>

          <div className="flex justify-end">

            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-6 py-3 font-semibold text-white transition hover:bg-[#083d83] disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Simpan Perubahan
                </>
              )}
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}