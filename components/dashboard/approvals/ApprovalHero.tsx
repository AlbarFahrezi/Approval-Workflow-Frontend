
"use client";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

type Props = {
  totalPending: number;
  onRefresh: () => void;
  loading: boolean;
};

export default function ApprovalHero({
  onRefresh,
  loading,
}: Props) {
  const router = useRouter();

  return (
    <section className="bg-[#263f5f]">

      {/* 
        MOBILE:
        Semua dibuat vertikal supaya refresh
        tidak nabrak heading.

        DESKTOP:
        Konten tetap di tengah dan refresh
        berada di kanan.
      */}

      <div className="relative min-h-[300px] px-6 py-6 sm:px-8 md:min-h-[280px] lg:min-h-[240px] lg:px-10 lg:py-8">

        {/* BACK BUTTON */}

        <div className="absolute left-6 top-6 z-10 sm:left-8 sm:top-8 lg:left-10 lg:top-8">

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="
              inline-flex
              h-10
              items-center
              gap-2
              border
              border-white/20
              bg-white/10
              px-4
              text-xs
              font-bold
              uppercase
              tracking-[0.14em]
              text-white
              transition-all
              duration-200
              hover:border-white/40
              hover:bg-white
              hover:text-[#263f5f]
            "
          >
            <ArrowLeft size={16} />

            Dashboard

          </button>

        </div>


        {/* HERO CONTENT */}

        <div
          className="
            flex
            min-h-[210px]
            flex-col
            items-center
            justify-center
            pt-12
            text-center
            lg:min-h-[220px]
            lg:pt-0
          "
        >

          {/* LABEL */}

          <div className="flex items-center justify-center gap-2">

            <span className="h-2 w-2 bg-amber-400" />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-slate-300
                sm:text-xs
              "
            >
              Approval Center
            </span>

          </div>


          {/* TITLE */}

          <h1
            className="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            Approval Management
          </h1>


          {/* DESCRIPTION */}

          <p
            className="
              mt-3
              max-w-xl
              px-2
              text-center
              text-sm
              leading-6
              text-slate-300
              sm:text-base
            "
          >
            Kelola dan tinjau seluruh request yang membutuhkan
            persetujuan sebelum melanjutkan ke proses berikutnya.
          </p>

        </div>


        {/* REFRESH BUTTON */}

        <div
          className="
            flex
            justify-center
            pt-2
            lg:absolute
            lg:right-10
            lg:top-1/2
            lg:-translate-y-1/2
            lg:pt-0
          "
        >

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="
              flex
              h-12
              w-full
              max-w-[260px]
              items-center
              justify-center
              gap-2
              border
              border-white/20
              bg-slate-100
              px-6
              text-sm
              font-bold
              text-[#263f5f]
              transition-all
              duration-200
              hover:bg-white
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:opacity-60
              lg:w-[180px]
            "
          >

            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Data

          </button>

        </div>

      </div>

    </section>
  );
}

