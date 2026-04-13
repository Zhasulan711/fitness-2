"use client";

import { AUTH_COPY } from "@/features/auth/constants/copy";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { motion } from "framer-motion";

export default function AuthPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-gradient-to-b from-emerald-50/80 via-zinc-50 to-zinc-50 px-4 py-10 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          {AUTH_COPY.subtitle}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {AUTH_COPY.title}
        </h1>
      </motion.div>
      <LoginForm />
    </div>
  );
}
