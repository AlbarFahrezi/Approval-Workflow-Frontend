"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import {
  getApprovalRequest,
  updateApprovalRequest,
} from "@/services/approvalRequest";

import type {
  ApprovalRequest,
} from "@/types/approvalRequest";

export default function EditRequestPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [request, setRequest] =
    useState<ApprovalRequest | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    async function loadRequest() {
      try {
        setLoading(true);

        const data =
          await getApprovalRequest(id);

        /*
         * Request hanya boleh diedit
         * ketika status masih draft.
         */
        if (data.status !== "draft") {
          toast.error(
            "Request yang sudah disubmit tidak dapat diedit."
          );

          router.replace(
            `/dashboard/requests/${id}`
          );

          return;
        }

        setRequest(data);
        setTitle(data.title);
        setDescription(data.description);

      } catch (error) {
        console.error(error);

        toast.error(
          "Gagal mengambil data request."
        );

        router.replace(
          "/dashboard/requests"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadRequest();
    }
  }, [id, router]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!request) return;

    /*
     * Double protection di frontend.
     */
    if (request.status !== "draft") {
      toast.error(
        "Request yang sudah disubmit tidak dapat diedit."
      );

      router.replace(
        `/dashboard/requests/${request.id}`
      );

      return;
    }

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

      await updateApprovalRequest(
        request.id,
        {
          title: title.trim(),
          description: description.trim(),
        }
      );

      toast.success(
        "Request berhasil diperbarui."
      );

      router.replace(
        `/dashboard/requests/${request.id}`
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
        <Loader2
          size={30}
          className="animate-spin text-[#0B4EA2]"
        />
      </div>
    );
  }

  if (!request) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* Back */}

      <button
        onClick={() =>
          router.push(
            `/dashboard/requests/${request.id}`
          )
        }
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Edit Request
        </h1>

        <p className="mt-1 text-slate-500">
          Perbarui data request approval.
        </p>
      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >

        {/* Title */}

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
                setTitle(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-[#0B4EA2]"
              placeholder="Masukkan judul request"
            />

          </div>
        </div>

        {/* Description */}

        <div>
          <label className="mb-2 block font-semibold">
            Deskripsi
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={8}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B4EA2]"
            placeholder="Masukkan deskripsi request"
          />
        </div>

        {/* Action */}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/requests/${request.id}`
              )
            }
            className="rounded-xl border border-slate-200 px-6 py-3 hover:bg-slate-100"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B4EA2] px-6 py-3 font-semibold text-white hover:bg-[#083d83] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
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

      </form>

    </div>
  );
}