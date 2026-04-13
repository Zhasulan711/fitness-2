"use client";

import { useTrainingStore } from "@/stores/useTrainingStore";
import { motion } from "framer-motion";
import Link from "next/link";

export function NotificationList({
  limit,
  clientName,
}: {
  limit?: number;
  clientName?: string;
}) {
  const items = useTrainingStore((s) => s.notifications);
  const filtered = clientName
    ? items.filter((n) => !n.clientName || n.clientName === clientName)
    : items;
  const shown = limit ? filtered.slice(0, limit) : filtered;

  if (shown.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        No notifications yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {shown.map((n, i) => (
        <motion.li
          key={n.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70"
        >
          <p className="font-medium text-zinc-900 dark:text-zinc-50">{n.message}</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(n.date).toLocaleString()}
          </p>
          {n.workoutDate ? (
            <Link
              href={`/workout/${n.workoutDate}`}
              className="mt-2 inline-block text-xs font-semibold text-emerald-600"
            >
              Check workout
            </Link>
          ) : null}
        </motion.li>
      ))}
    </ul>
  );
}
