"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/auth";
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

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    values: LoginFormValues
  ) => {
    try {
      console.log(
        "========== LOGIN START =========="
      );

      console.log(
        "[LOGIN] Email:",
        values.email
      );

      const response = await login(values);

      console.log(
        "[LOGIN] API RESPONSE:",
        response
      );

      /*
      |--------------------------------------------------------------------------
      | LOGIN RESPONSE
      |--------------------------------------------------------------------------
      */

      if (!response.success) {
        console.error(
          "[LOGIN] API RETURNED SUCCESS FALSE:",
          response
        );

        toast.error(
          response.message ||
            "Login gagal."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | TOKEN
      |--------------------------------------------------------------------------
      */

      const token =
        response.data?.token ??
        response.data?.access_token ??
        null;

      if (!token) {
        console.error(
          "[LOGIN] TOKEN TIDAK DITEMUKAN:",
          response.data
        );

        toast.error(
          "Token login tidak ditemukan dari server."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | USER
      |--------------------------------------------------------------------------
      */

      const user =
        response.data?.user as
          | User
          | undefined;

      if (!user) {
        console.error(
          "[LOGIN] USER TIDAK DITEMUKAN:",
          response.data
        );

        toast.error(
          "Data user tidak ditemukan dari server."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | BERSIHKAN AUTH LAMA
      |--------------------------------------------------------------------------
      */

      window.localStorage.removeItem(
        "approval_token"
      );

      window.localStorage.removeItem(
        "approval_user"
      );

      window.localStorage.removeItem(
        "approval_remember_me"
      );

      window.sessionStorage.removeItem(
        "approval_token"
      );

      window.sessionStorage.removeItem(
        "approval_user"
      );

      window.sessionStorage.removeItem(
        "approval_remember_me"
      );

      /*
      |--------------------------------------------------------------------------
      | SIMPAN AUTH
      |--------------------------------------------------------------------------
      */

      if (rememberMe) {
        window.localStorage.setItem(
          "approval_token",
          token
        );

        window.localStorage.setItem(
          "approval_user",
          JSON.stringify(user)
        );

        window.localStorage.setItem(
          "approval_remember_me",
          "true"
        );
      } else {
        window.sessionStorage.setItem(
          "approval_token",
          token
        );

        window.sessionStorage.setItem(
          "approval_user",
          JSON.stringify(user)
        );

        window.sessionStorage.setItem(
          "approval_remember_me",
          "false"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | VERIFY STORAGE
      |--------------------------------------------------------------------------
      */

      const storage =
        rememberMe
          ? window.localStorage
          : window.sessionStorage;

      const savedToken =
        storage.getItem(
          "approval_token"
        );

      const savedUser =
        storage.getItem(
          "approval_user"
        );

      if (
        !savedToken ||
        !savedUser
      ) {
        console.error(
          "[LOGIN] AUTH DATA GAGAL DISIMPAN"
        );

        toast.error(
          "Data login gagal disimpan."
        );

        return;
      }

      console.log(
        "[LOGIN] Token tersimpan:",
        savedToken
          ? "ADA"
          : "TIDAK ADA"
      );

      console.log(
        "[LOGIN] User tersimpan:",
        savedUser
          ? "ADA"
          : "TIDAK ADA"
      );

      console.log(
        "[LOGIN] Role:",
        user.role
      );

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      toast.success(
        response.message ||
          "Login berhasil."
      );

      console.log(
        "========== LOGIN SUCCESS =========="
      );

      /*
      |--------------------------------------------------------------------------
      | REDIRECT
      |--------------------------------------------------------------------------
      */

      router.replace(
        "/dashboard"
      );
    } catch (error: unknown) {
      console.log(
        "========================================"
      );

      console.log(
        "========== LOGIN ERROR =========="
      );

      console.log(
        "========================================"
      );

      console.log(
        "[LOGIN] ERROR OBJECT:",
        error
      );

      /*
      |--------------------------------------------------------------------------
      | ERROR DETAILS
      |--------------------------------------------------------------------------
      */

      if (
        error instanceof Error
      ) {
        console.log(
          "[LOGIN] ERROR NAME:",
          error.name
        );

        console.log(
          "[LOGIN] ERROR MESSAGE:",
          error.message
        );

        console.log(
          "[LOGIN] ERROR STACK:",
          error.stack
        );
      }

      /*
      |--------------------------------------------------------------------------
      | AXIOS ERROR
      |--------------------------------------------------------------------------
      */

      const axiosError =
        error as {
          response?: {
            status?: number;
            data?: unknown;
          };

          request?: unknown;

          message?: string;

          code?: string;
        };

      console.log(
        "[LOGIN] HTTP STATUS:",
        axiosError.response
          ?.status
      );

     console.log(
  "[LOGIN] SERVER RESPONSE:",
  JSON.stringify(
    axiosError.response?.data,
    null,
    2
  )
);

      console.log(
        "[LOGIN] REQUEST:",
        axiosError.request
      );

      console.log(
        "[LOGIN] AXIOS MESSAGE:",
        axiosError.message
      );

      console.log(
        "[LOGIN] ERROR CODE:",
        axiosError.code
      );

      /*
      |--------------------------------------------------------------------------
      | USER MESSAGE
      |--------------------------------------------------------------------------
      */

      let message =
        "Tidak dapat terhubung ke server.";

      const responseData =
        axiosError.response
          ?.data as
          | {
              message?: string;
              error?: string;
              errors?: Record<
                string,
                string[]
              >;
            }
          | undefined;

      if (
        responseData?.message
      ) {
        message =
          responseData.message;
      } else if (
        responseData?.error
      ) {
        message =
          responseData.error;
      } else if (
        axiosError.message
      ) {
        message =
          axiosError.message;
      }

      /*
      |--------------------------------------------------------------------------
      | SPECIAL STATUS MESSAGE
      |--------------------------------------------------------------------------
      */

      const status =
        axiosError.response
          ?.status;

      if (status === 401) {
        message =
          responseData?.message ||
          "Email atau password salah.";
      }

      if (status === 404) {
        message =
          responseData?.message ||
          "Endpoint login tidak ditemukan.";
      }

      if (status === 422) {
        message =
          responseData?.message ||
          "Data login tidak valid.";
      }

      if (status === 500) {
        message =
          responseData?.message ||
          "Terjadi error pada server.";
      }

      /*
      |--------------------------------------------------------------------------
      | SHOW ERROR
      |--------------------------------------------------------------------------
      */

      toast.error(message);

      console.log(
        "========================================"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="w-full"
    >
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
                toast.info(
                  "Fitur reset password belum tersedia."
                )
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
              type={
                showPassword
                  ? "text"
                  : "password"
              }
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
                setShowPassword(
                  (current) =>
                    !current
                )
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

        {/* REMEMBER ME */}

        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#62778a]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) =>
              setRememberMe(
                event.target.checked
              )
            }
            disabled={isSubmitting}
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
              <Loader2
                size={17}
                className="animate-spin"
              />

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

        <span className="h-px flex-1 bg-[#dce4eb]" />
      </div>

      {/* AKHLAK */}

      <div className="mt-6 border-y border-[#e1e8ee] py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a9cab]">
            Core Values
          </span>

          <span className="text-[10px] font-semibold tracking-[0.08em] text-[#1d62a1]">
            DAHANA
          </span>
        </div>
      </div>

      {/* SECURITY */}

      <div className="mt-6 flex justify-center">
        <p className="text-center text-[11px] leading-5 text-[#8b9daa]">
          Akses terbatas untuk pengguna yang
          berwenang.
        </p>
      </div>
    </form>
  );
}