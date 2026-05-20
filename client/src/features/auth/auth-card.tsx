"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/features/auth/auth-context";
import { getErrorMessage } from "@/lib/errors";
import {
  loginUser,
  registerUser,
} from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthCard({
  mode,
}: {
  mode: "login" | "register";
}) {
  const router = useRouter();
  const { signIn, user, isReady } = useAuth();
  const [showPassword, setShowPassword] =
    useState(false);

  const isLogin = mode === "login";
  const schema = isLogin
    ? loginSchema
    : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
      ...(isLogin ? {} : { name: "" }),
    },
  });

  useEffect(() => {
    if (isReady && user) {
      router.replace("/dashboard");
    }
  }, [isReady, router, user]);

  async function onSubmit(
    values: LoginValues | RegisterValues
  ) {
    try {
      if (isLogin) {
        const result = await loginUser({
          email: values.email,
          password: values.password,
        });
        toast.success("Welcome back to VeriSure");
        signIn(result.token, result.user);
        return;
      }

      await registerUser({
        name: (values as RegisterValues).name,
        email: values.email,
        password: values.password,
      });
      toast.success(
        "Account created. You can sign in now."
      );
      router.push("/login");
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Authentication failed"
        )
      );
    }
  }

  return (
    <main className="min-h-screen bg-premium p-4 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden border border-slate-200 bg-white shadow-2xl md:grid-cols-[0.85fr_1fr] rounded-lg">
        <section className="hidden bg-slate-950 p-9 text-white md:flex md:flex-col md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/VeriSure_logo.png"
              alt="VeriSure"
              width={52}
              height={52}
              className="rounded-md bg-white"
              priority
            />
            <div>
              <p className="text-lg font-bold">
                VeriSure
              </p>
              <p className="text-sm text-slate-400">
                Enterprise Background Verification
              </p>
            </div>
          </div>

          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 rounded-lg">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="max-w-sm text-4xl font-semibold tracking-tight">
              Verify candidates with confidence.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
              Secure access to candidate checks, audit
              trails, and verification reports.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Create candidate profiles",
                "Run Aadhaar and PAN checks",
                "Preview and download reports",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-white/10 bg-white/5 p-3 text-sm text-slate-200 rounded-md"
                >
                  <span className="flex h-7 w-7 items-center justify-center bg-white/10 text-xs font-bold text-cyan-100 rounded-md">
                    {index + 1}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Production-ready verification workspace
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-9 md:hidden">
              <Image
                src="/VeriSure_logo.png"
                alt="VeriSure"
                width={46}
                height={46}
                className="rounded-md"
              />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
              {isLogin ? "Secure login" : "Create access"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {isLogin
                ? "Sign in to VeriSure"
                : "Create your VeriSure account"}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {isLogin
                ? "Use your workspace credentials to continue."
                : "Set up an evaluator-ready verification workspace."}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              {!isLogin ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Full name
                  </span>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      className="input !pl-[52px]"
                      placeholder="Priya Sharma"
                      {...register("name" as const)}
                    />
                  </div>

                  {"name" in errors ? (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name?.message as string}
                    </p>
                  ) : null}
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="input !pl-[52px]"
                    placeholder="admin@verisure.com"
                    {...register("email")}
                  />
                </div>
                <p className="mt-1 text-xs text-red-600">
                  {errors.email?.message}
                </p>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    className="input !pl-[52px] pr-12"
                    placeholder="Minimum 6 characters"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-red-600">
                  {errors.password?.message}
                </p>
              </label>

              {isLogin ? (
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-slate-300 accent-slate-950 rounded"
                    {...register("remember")}
                  />
                  Remember this workspace
                </label>
              ) : null}

              <button
                disabled={isSubmitting}
                className="btn-primary h-12 w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Please wait..."
                  : isLogin
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              {isLogin
                ? "Need an account?"
                : "Already registered?"}{" "}
              <Link
                href={
                  isLogin ? "/register" : "/login"
                }
                className="font-semibold text-slate-950 hover:text-cyan-700"
              >
                {isLogin ? "Create one" : "Sign in"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
