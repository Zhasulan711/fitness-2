"use client";

import { APP_NAV } from "@/features/home/constants/nav";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTrainingStore } from "@/stores/useTrainingStore";
import { useEffect } from "react";

export function AppShell({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = useTrainingStore((s) => s.isLoggedIn);
  const role = useTrainingStore((s) => s.role);
  const logout = useTrainingStore((s) => s.logout);
  const visibleNav = APP_NAV.filter((item) =>
    item.href === "/admin" ? role === "admin" : true,
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/auth");
      return;
    }
    if (requiredRole && role !== requiredRole) {
      router.replace(role === "admin" ? "/admin" : "/workouts");
    }
  }, [isLoggedIn, requiredRole, role, router]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Link href={role === "admin" ? "/admin" : "/workouts"} className="text-sm font-semibold tracking-tight">
            Train<span className="text-emerald-600">Flow</span>
          </Link>
          <nav className="flex items-center gap-1 rounded-full bg-zinc-200/60 p-1 dark:bg-zinc-800/70">
            {visibleNav.map((l) => {
              const active = pathname?.startsWith(l.href);
              return (
                <Link key={l.href} href={l.href} className="relative px-3 py-1.5 text-xs font-medium">
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-zinc-900"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 pb-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="capitalize">{role ?? "guest"} account</span>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/auth");
            }}
            className="rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-24 pt-4">
        {children}
      </main>
    </div>
  );
}
