"use client";

import type { AuthProfile } from "@/features/auth/types/auth";
import { useTrainingStore } from "@/stores/useTrainingStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm() {
  const router = useRouter();
  const setProfile = useTrainingStore((s) => s.setProfile);
  const submitAuth = useTrainingStore((s) => s.submitAuth);
  const [form, setForm] = useState<AuthProfile>({
    name: "",
    nickname: "",
    phone: "",
    email: "",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nickname = form.nickname.trim() || form.name.split(" ")[0] || "Client";
    setProfile({ ...form, nickname });
    submitAuth();
    router.push("/workouts");
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/70"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Join your program
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          This is a demo signup — no data leaves your device.
        </p>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        Name
        <input
          required
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none ring-emerald-500/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Alex Trainer"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        Nickname (optional)
        <input
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none ring-emerald-500/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          value={form.nickname}
          onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
          placeholder="Alex"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        Phone
        <input
          required
          type="tel"
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none ring-emerald-500/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="+1 (555) 000-0000"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        Email
        <input
          required
          type="email"
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none ring-emerald-500/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="you@example.com"
        />
      </label>
      <button
        type="submit"
        className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 active:scale-[0.99]"
      >
        Continue
      </button>
    </motion.form>
  );
}
