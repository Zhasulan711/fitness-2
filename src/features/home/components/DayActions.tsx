"use client";

import { getStatusForDate, useTrainingStore } from "@/stores/useTrainingStore";
import Link from "next/link";

export function DayActions({ selectedDate }: { selectedDate: string | null }) {
  const dayStatusByDate = useTrainingStore((s) => s.dayStatusByDate);
  const weekDays = useTrainingStore((s) => s.weekDays);
  if (!selectedDate) return null;

  const day = weekDays.find((d) => d.date === selectedDate);
  if (!day) return null;

  const status = getStatusForDate(selectedDate, dayStatusByDate);
  const count = day.workouts.length;

  return (
    <div className="mt-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Selected day</p>
      <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {new Date(selectedDate + "T12:00:00").toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Status: <span className="font-medium capitalize text-zinc-800 dark:text-zinc-200">{status}</span> ·{" "}
        {count} exercise{count === 1 ? "" : "s"}
      </p>
      {count > 0 ? (
        <Link
          href={`/workout/${selectedDate}`}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Start session
        </Link>
      ) : (
        <p className="mt-3 text-xs text-zinc-500">Rest day — nothing scheduled.</p>
      )}
    </div>
  );
}
