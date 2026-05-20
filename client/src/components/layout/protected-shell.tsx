"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Info,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/candidates",
    label: "Candidates",
    icon: Users,
  },
  {
    href: "/about",
    label: "About",
    icon: Info,
  },
];

export function ProtectedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isReady, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, router, user]);

  if (!isReady || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="h-9 w-9 animate-spin border-2 border-slate-600 border-t-cyan-300 rounded-lg" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-premium text-slate-950">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white/95 px-5 py-5 shadow-sm transition-transform lg:translate-x-0",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <Image
              src="/VeriSure_logo.png"
              alt="VeriSure"
              width={42}
              height={42}
              className="rounded-md"
              priority
            />
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-950">
                VeriSure
              </p>
              <p className="text-xs text-slate-500">
                Verification OS
              </p>
            </div>
          </Link>
          <button
            className="p-2 text-slate-500 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-9 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition rounded-md",
                  active
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-slate-900 text-sm font-semibold text-white rounded-md">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="btn-secondary mt-4 w-full px-3 py-2 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {isOpen ? (
        <button
          aria-label="Close overlay"
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between">
            <button
              className="p-2 text-slate-600 lg:hidden"
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex">
              <ShieldCheck className="h-4 w-4 text-cyan-700" />
              Secure enterprise verification workspace
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">
                  {user.email}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center bg-slate-900 text-sm font-semibold text-white rounded-md">
                {user.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
