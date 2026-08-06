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

    const rect = event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    element.style.transform = `
      translate3d(${x * 6}px, ${y * 4}px, 0)
      scale(1.03)
    `;
  };

  const handleMouseLeave = () => {
    if (!bgRef.current) return;

    bgRef.current.style.transform =
      "translate3d(0, 0, 0) scale(1.03)";
  };

  return (
    <main
      className="h-screen overflow-hidden bg-[#f5f7f9]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid h-screen lg:grid-cols-[57%_43%]">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <section className="relative hidden h-screen overflow-hidden lg:block">

          {/* IMAGE */}
          <div
            ref={bgRef}
            className="dahana-bg absolute inset-[-16px]"
          >
            <Image
              src="/dahana-login-bg 2.jpg"
              alt="PT DAHANA"
              fill
              priority
              quality={100}
              sizes="57vw"
              className="object-cover object-[center_42%]"
            />
          </div>

          {/* IMAGE COLOR */}
          <div className="absolute inset-0 bg-[#072c45]/25" />

          <div className="absolute inset-0 bg-gradient-to-br from-[#0c5478]/10 via-transparent to-[#031723]/35" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#031723]/95 via-[#031723]/5 to-transparent" />

          {/* SOFT LIGHT */}
          <div className="dahana-glow pointer-events-none absolute right-[-100px] top-[10%] h-[330px] w-[330px] rounded-full bg-[#68c7f1]/10 blur-[90px]" />

          <div className="dahana-light-sweep pointer-events-none absolute -left-[20%] top-[-20%] h-[150%] w-[18%] rotate-[18deg] bg-white/10 blur-3xl" />

          {/* ===================================================
              LOGO
          ==================================================== */}
          <div className="dahana-logo absolute left-10 top-8 z-30 xl:left-14">
            <Image
              src="/dahana-logo.png"
              alt="PT DAHANA"
              width={160}
              height={54}
              priority
              className="w-[145px] brightness-0 invert"
            />
          </div>

          {/* SYSTEM */}
          <div className="absolute right-10 top-9 z-30 xl:right-14">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#9bd3ed]/30" />

              <span className="text-[10px] font-medium tracking-[0.2em] text-[#d9edf6]/65">
                INTERNAL SYSTEM
              </span>

              <span className="h-px w-7 bg-[#9bd3ed]/30" />
            </div>
          </div>

          {/* ===================================================
              AKHLAK
          ==================================================== */}
          <div className="absolute left-10 right-10 top-[21%] z-30 xl:left-14 xl:right-14">
            <div className="dahana-akhlak">

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#c4dce6]/55">
                  Core Values
                </span>

                <span className="h-px w-9 bg-[#72bfdf]/35" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7ccaf0]">
                  DAHANA
                </span>
              </div>

              {/* BIG AKHLAK */}
              <div className="group mt-4 inline-block cursor-default">
                <h2 className="dahana-akhlak-title relative">
                  {"AKHLAK".split("").map(
                    (letter, index) => (
                      <span
                        key={`${letter}-${index}`}
                        className="dahana-akhlak-letter"
                        style={{
                          animationDelay: `${0.5 + index * 0.09}s`,
                        }}
                      >
                        {letter}
                      </span>
                    )
                  )}

                  <span className="dahana-akhlak-underline" />
                </h2>
              </div>

              {/* VALUES */}
              <div className="mt-6 grid max-w-[650px] grid-cols-3 gap-x-8 gap-y-4">
                {akhlakValues.map((value, index) => (
                  <div
                    key={value}
                    className="dahana-value-item group/value"
                    style={{
                      animationDelay: `${1.05 + index * 0.1}s`,
                    }}
                  >
                    <p className="dahana-value-text">
                      {value}
                    </p>

                    <span className="dahana-value-line" />
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[9px] uppercase tracking-[0.2em] text-[#b5d1de]/40">
                Amanah · Kompeten · Harmonis · Loyal ·
                Adaptif · Kolaboratif
              </p>
            </div>
          </div>

          {/* ===================================================
              BOTTOM HERO
          ==================================================== */}
          <div className="absolute bottom-0 left-0 right-0 z-30 px-10 pb-9 xl:px-14 xl:pb-10">
            <div className="max-w-2xl">

              <div className="dahana-line mb-4 h-px w-12 bg-[#73c3e8]/70" />

              <p className="dahana-title text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9dfe9]/65">
                Approval Workflow
              </p>

              <h1 className="dahana-title mt-2 text-[40px] font-semibold leading-[1.03] tracking-[-0.04em] text-[#e4f1f7] xl:text-[52px]">
                Serving The Nation{" "}
                <span className="text-[#6fc7ef]">
                  Better
                </span>
              </h1>

              <p className="dahana-description mt-3 max-w-lg text-[13px] leading-6 text-[#c5d9e4]/70">
                Platform internal untuk mengelola pengajuan,
                persetujuan, dan riwayat proses secara
                terintegrasi.
              </p>

              <div className="dahana-meta mt-5 flex items-center gap-4 text-[9px] uppercase tracking-[0.15em] text-[#a6c3d1]/45">
                <span>PT DAHANA</span>

                <span className="h-3 w-px bg-white/15" />

                <span>Authorized Personnel</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[9px] uppercase tracking-[0.12em] text-white/35">
              <span>Internal Enterprise System</span>
              <span>Approval Workflow</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}
        <section className="relative h-screen overflow-y-auto bg-[#f7f9fb]">
          <div className="flex min-h-full items-center justify-center px-6 py-10 sm:px-10 lg:px-12">

            {/* DECOR */}
            <div className="pointer-events-none absolute right-[-120px] top-[-100px] h-[300px] w-[300px] rounded-full bg-[#1d62a1]/5 blur-3xl" />

            <div className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-[250px] w-[250px] rounded-full bg-[#65aee0]/5 blur-3xl" />

            <div className="relative z-10 w-full max-w-[430px]">

              {/* MOBILE */}
              <div className="mb-8 lg:hidden">
                <Image
                  src="/dahana-logo.png"
                  alt="PT DAHANA"
                  width={150}
                  height={50}
                  className="w-[135px]"
                />
              </div>

              {/* HEADING */}
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1d62a1]" />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d62a1]">
                    Approval Workflow
                  </p>
                </div>

                <h2 className="mt-2 text-[40px] font-semibold tracking-[-0.04em] text-[#14283a]">
                  Sign in
                </h2>

                <p className="mt-2 max-w-sm text-[13px] leading-6 text-[#728697]">
                  Masuk menggunakan akun perusahaan Anda
                  untuk melanjutkan ke sistem.
                </p>
              </div>

              <LoginForm />

              <div className="mt-8 border-t border-[#dfe7ee] pt-4">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.12em] text-[#98a7b3]">
                  <span>PT DAHANA</span>
                  <span>Internal Use Only</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}