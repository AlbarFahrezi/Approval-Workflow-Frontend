"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { login } from "@/services/auth";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values);

      if (!response.success) {
        toast.error(response.message || "Login gagal.");
        return;
      }

      const token =
        response.data?.token ||
        response.data?.access_token ||
        (response.data as { accessToken?: string })?.accessToken;

      if (!token) {
        toast.error("Token login tidak ditemukan.");
        return;
      }

      localStorage.setItem("approval_token", token);
      localStorage.setItem(
        "approval_user",
        JSON.stringify(response.data.user)
      );
      localStorage.setItem(
        "approval_remember_me",
        String(rememberMe)
      );

      toast.success(response.message || "Login berhasil.");
      router.replace("/dashboard");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      toast.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Tidak dapat terhubung ke server."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-5">
        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[13px] font-semibold text-[#18324a]"
          >
            Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              strokeWidth={1.8}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8aa0b2]"
            />

            <input
              id="email"
              type="email"
              placeholder="nama@dahana.co.id"
              autoComplete="email"
              disabled={isSubmitting}
              {...register("email")}
              className={`h-[54px] w-full border bg-white pl-11 pr-4 text-sm text-[#1b3042] outline-none transition ${
                errors.email
                  ? "border-red-400"
                  : "border-[#cfdbe5] hover:border-[#9eb2c2] focus:border-[#1e63a1]"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-[#18324a]"
            >
              Password
            </label>

            <button
              type="button"
              onClick={() =>
                toast.info("Fitur reset password belum tersedia.")
              }
              className="text-[12px] font-medium text-[#1e63a1] hover:underline"
            >
              Lupa password?
            </button>
          </div>

          <div className="relative">
            <LockKeyhole
              size={18}
              strokeWidth={1.8}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8aa0b2]"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              autoComplete="current-password"
              disabled={isSubmitting}
              {...register("password")}
              className={`h-[54px] w-full border bg-white pl-11 pr-11 text-sm text-[#1b3042] outline-none transition ${
                errors.password
                  ? "border-red-400"
                  : "border-[#cfdbe5] hover:border-[#9eb2c2] focus:border-[#1e63a1]"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8aa0b2] hover:text-[#1e63a1]"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* REMEMBER */}
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#62778a]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 accent-[#1e63a1]"
          />

          Ingat saya
        </label>

        {/* LOGIN */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex h-[54px] w-full items-center justify-center gap-2 bg-[#1763a6] text-sm font-semibold text-white transition hover:bg-[#12558d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </div>

      {/* DIVIDER */}
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[#dce4eb]" />
        <span className="text-[11px] text-[#93a4b2]">atau</span>
        <span className="h-px flex-1 bg-[#dce4eb]" />
      </div>

      {/* SSO */}
      <button
        type="button"
        onClick={() =>
          toast.info("Single Sign-On belum diaktifkan.")
        }
        className="group flex h-[54px] w-full items-center border border-[#cfdbe5] bg-white px-4 text-sm font-semibold text-[#1e63a1] transition hover:border-[#aebfcd] hover:bg-[#fbfdff]"
      >
        <ShieldCheck size={18} />

        <span className="ml-3">Masuk dengan SSO</span>

        <ArrowRight
          size={17}
          className="ml-auto transition-transform group-hover:translate-x-1"
        />
      </button>
{/* AKHLAK VALUES */}
<div className="mt-6 border-y border-[#e1e8ee] py-4">
  <div className="mb-3 flex items-center justify-between">
    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a9cab]">
      Core Values
    </span>

    <span className="text-[10px] font-semibold tracking-[0.08em] text-[#1d62a1]">
      AKHLAK
    </span>
  </div>

  <div className="grid grid-cols-3 gap-x-3 gap-y-2">
    {[
      ["A", "Aku"],
      ["K", "Kompeten"],
      ["H", "Harmonis"],
      ["L", "Loyal"],
      ["A", "Adaptif"],
      ["K", "Kolaboratif"],
    ].map(([letter, value]) => (
      <div
        key={value}
        className="group flex items-center gap-2"
      >
        <span className="flex h-6 w-6 items-center justify-center border border-[#cbd9e4] text-[10px] font-bold text-[#1d62a1] transition group-hover:border-[#1d62a1] group-hover:bg-[#1d62a1] group-hover:text-white">
          {letter}
        </span>

        <span className="text-[10px] text-[#6e8191]">
          {value}
        </span>
      </div>
    ))}
  </div>
</div>
      {/* SECURITY */}
      <div className="mt-6 flex justify-center">
        <p className="text-center text-[11px] leading-5 text-[#8b9daa]">
          Akses terbatas untuk pengguna yang berwenang.
        </p>
      </div>
    </form>
  );
}