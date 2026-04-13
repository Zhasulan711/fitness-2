"use client";

import { getStatusForDate, useTrainingStore } from "@/stores/useTrainingStore";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function ProfileStats() {
  const profile = useTrainingStore((s) => s.profile);
  const dayStatusByDate = useTrainingStore((s) => s.dayStatusByDate);
  const weekDays = useTrainingStore((s) => s.weekDays);

  const stats = useMemo(() => {
    const days = weekDays.map((d) => ({
      ...d,
      status: getStatusForDate(d.date, dayStatusByDate),
    }));
    const completed = days.filter((d) => d.status === "completed").length;
    const missed = days.filter((d) => d.status === "missed").length;
    const pending = days.filter((d) => d.status === "pending").length;
    const totalWorkouts = days.reduce((acc, d) => acc + d.workouts.length, 0);
    const weeklyProgress = days.length ? Math.round((completed / days.length) * 100) : 0;
    return { completed, missed, pending, totalWorkouts, weeklyProgress, totalDays: days.length };
  }, [dayStatusByDate, weekDays]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Your stats</h2>
        {profile ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {profile.name} ({profile.nickname}) · {profile.email}
          </p>
        ) : (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Demo profile</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          layout
          className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total exercises</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{stats.totalWorkouts}</p>
          <p className="mt-1 text-xs text-zinc-500">Across the mock week</p>
        </motion.div>
        <motion.div
          layout
          className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Weekly progress</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{stats.weeklyProgress}%</p>
          <p className="mt-1 text-xs text-zinc-500">
            {stats.completed}/{stats.totalDays} days completed
          </p>
        </motion.div>
      </div>
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Completed vs missed</p>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
          <motion.div
            className="bg-emerald-500"
            initial={false}
            animate={{ width: `${stats.totalDays ? (stats.completed / stats.totalDays) * 100 : 0}%` }}
          />
          <motion.div
            className="bg-rose-500"
            initial={false}
            animate={{ width: `${stats.totalDays ? (stats.missed / stats.totalDays) * 100 : 0}%` }}
          />
          <motion.div
            className="bg-zinc-300 dark:bg-zinc-700"
            initial={false}
            animate={{ width: `${stats.totalDays ? (stats.pending / stats.totalDays) * 100 : 0}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Completed {stats.completed}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Missed {stats.missed}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            Pending {stats.pending}
          </span>
        </div>
      </div>
    </div>
  );
}
