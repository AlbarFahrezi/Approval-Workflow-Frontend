"use client";

import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import { useRef } from "react";

const akhlakValues = [
  "Amanah",
  "Kompeten",
  "Harmonis",
  "Loyal",
  "Adaptif",
  "Kolaboratif",
];

export default function LoginPage() {
  const bgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    const element = bgRef.current;

    if (!element) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
        rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
        rect.height -
      0.5;

    element.style.transform = `
      translate3d(${x * 4}px, ${y * 3}px, 0)
      scale(1.025)
    `;
  };

  const handleMouseLeave = () => {
    if (!bgRef.current) return;

    bgRef.current.style.transform =
      "translate3d(0, 0, 0) scale(1.025)";
  };

  return (
    <main
      className="h-screen overflow-hidden bg-[#f5f7f9]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid h-screen lg:grid-cols-[57%_43%]">

        {/* =====================================================
            LEFT
        ====================================================== */}

        <section className="relative hidden h-screen overflow-hidden lg:block">

          {/* BACKGROUND */}

          <div
            ref={bgRef}
            className="absolute inset-[-14px] transition-transform duration-700 ease-out"
          >
            <Image
              src="/dahana-login-bg 2.jpeg"
              alt="PT DAHANA"
              fill
              priority
              quality={100}
              sizes="57vw"
              className="object-cover object-[center_42%]"
            />
          </div>

          {/* OVERLAY */}

          <div className="absolute inset-0 bg-[#072c45]/25" />

          <div className="absolute inset-0 bg-gradient-to-br from-[#0c5478]/10 via-transparent to-[#031723]/35" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#031723]/95 via-[#031723]/5 to-transparent" />

          {/* LOGO */}

          <div className="absolute left-10 top-8 z-30 xl:left-14">
            <Image
              src="/dahana-logo.png"
              alt="PT DAHANA"
              width={160}
              height={54}
              priority
              className="w-[145px] brightness-0 invert"
            />
          </div>

          {/* INTERNAL SYSTEM */}

          <div className="absolute right-10 top-9 z-30 xl:right-14">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-white/25" />

              <span className="text-[10px] tracking-[0.2em] text-white/60">
                INTERNAL SYSTEM
              </span>

              <span className="h-px w-7 bg-white/25" />
            </div>
          </div>

          {/* =================================================
              AKHLAK
          ================================================== */}

          <div className="absolute left-10 right-10 top-[21%] z-30 xl:left-14 xl:right-14">

            <div>

              <div className="flex items-center gap-3">

                

              </div>

              <div className="mt-4">

                <h2 className="dahana-akhlak-title">
                  {"AKHLAK".split("").map(
                    (letter, index) => (
                      <span
                        key={`${letter}-${index}`}
                        className="dahana-akhlak-letter"
                        style={{
                          animationDelay: `${
                            0.4 +
                            index * 0.08
                          }s`,
                        }}
                      >
                        {letter}
                      </span>
                    )
                  )}

                  <span className="dahana-akhlak-underline" />
                </h2>

              </div>

              <div className="mt-6 grid max-w-[650px] grid-cols-3 gap-x-8 gap-y-4">

                {akhlakValues.map(
                  (value, index) => (
                    <div
                      key={value}
                      className="dahana-value-item"
                      style={{
                        animationDelay: `${
                          0.9 +
                          index * 0.08
                        }s`,
                      }}
                    >
                      <p className="dahana-value-text">
                        {value}
                      </p>

                      <span className="dahana-value-line" />
                    </div>
                  )
                )}

              </div>

              

            </div>
          </div>

          {/* =================================================    BOTTOM================================================== */}
          <div className="absolute bottom-0 left-0 right-0 z-30 px-10 pb-9 xl:px-14">
            <div className="max-w-2xl">
              {/* SECTION LABEL */}
              <div className="mb-3 flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8fd8f5]/80">
                  Approval Workflow
                </span>
                <span className="h-px w-8 bg-[#73c3e8]/45" />
              </div>
              {/* MAIN TITLE */}
              <h1 className="dahana-title text-[40px] font-semibold leading-[1.03] tracking-[-0.04em] text-[#e4f1f7] xl:text-[52px]">
                Serving The Nation{" "}
                <span className="text-[#6fc7ef]">
                  Better
                </span>
              </h1>
              {/* DESCRIPTION */}
              <p className="dahana-description mt-3 max-w-lg text-[13px] leading-6 text-white/60">
                Platform internal untuk mengelola request,
                persetujuan, dan riwayat proses secara
                terintegrasi.
              </p>
              {/* META */}
              <div className="dahana-meta mt-5 flex items-center gap-4 text-[9px] uppercase tracking-[0.15em] text-white/35">
                <span>PT DAHANA</span>
                <span className="h-3 w-px bg-white/20" />
                <span>
                  Authorized Personnel
                </span>
              </div>
            </div>
            {/* FOOTER */}
            <div className="mt-5 border-t border-white/10 pt-4 text-[9px] uppercase tracking-[0.12em] text-white/30">
              Internal Enterprise System
            </div>
          </div>

        </section>

        {/* =====================================================    RIGHT====================================================== */}
        <section className="relative h-screen overflow-y-auto bg-[#f7f9fb]">
          {/* Soft background accent */}
          <div className="pointer-events-none absolute right-[-120px] top-[-100px] h-[300px] w-[300px] rounded-full bg-[#1d62a1]/[0.035] blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-[250px] w-[250px] rounded-full bg-[#65aee0]/[0.035] blur-3xl" />
          <div className="flex min-h-full items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
            <div className="relative z-10 w-full max-w-[430px]">
              {/* =================================================          MOBILE LOGO      ================================================== */}
              <div className="mb-12 lg:hidden">
                <Image
                  src="/dahana-logo.png"
                  alt="PT DAHANA"
                  width={150}
                  height={50}
                  className="mx-auto w-[135px]"
                />
              </div>
              {/* =================================================          LOGIN INTRO      ================================================== */}
              <div className="mb-9 text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                 
                </div>
                <h2 className="text-[40px] font-semibold tracking-[-0.04em] text-[#14283a]">
                  Sign In
                </h2>
                <p className="mx-auto mt-3 max-w-[350px] text-[13px] leading-6 text-[#728697]">
                  Masuk menggunakan akun perusahaan Anda
                  untuk melanjutkan ke sistem.
                </p>
              </div>
              {/* =================================================          FORM      ================================================== */}
              <div className="w-full">
                <LoginForm />
              </div>
              {/* =================================================          FOOTER      ================================================== */}
              <div className="mt-9 border-t border-[#dfe7ee] pt-4">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.12em] text-[#98a7b3]">
                  <span>
                    PT DAHANA
                  </span>
                  <span>
                    Internal Use Only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}