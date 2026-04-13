"use client";

import type { DayStatus } from "@/features/calendar/types/week";
import { getStatusForDate, useTrainingStore } from "@/stores/useTrainingStore";
import { motion } from "framer-motion";
import { useMemo } from "react";

function statusStyles(status: DayStatus) {
  switch (status) {
    case "completed":
      return "border-emerald-500/60 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100";
    case "missed":
      return "border-rose-500/60 bg-rose-500/15 text-rose-900 dark:text-rose-100";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200";
  }
}

function statusDot(status: DayStatus) {
  switch (status) {
    case "completed":
      return "bg-emerald-500";
    case "missed":
      return "bg-rose-500";
    default:
      return "bg-zinc-400 dark:bg-zinc-600";
  }
}

type WeekCalendarProps = {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

export function WeekCalendar({ selectedDate, onSelectDate }: WeekCalendarProps) {
  const dayStatusByDate = useTrainingStore((s) => s.dayStatusByDate);
  const weekDays = useTrainingStore((s) => s.weekDays);

  const days = useMemo(
    () =>
      weekDays.map((d) => ({
        ...d,
        status: getStatusForDate(d.date, dayStatusByDate),
      })),
    [dayStatusByDate, weekDays],
  );

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">This week</h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Trainer plan</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const label = new Date(d.date + "T12:00:00").toLocaleDateString(undefined, {
            weekday: "short",
          });
          const dayNum = new Date(d.date + "T12:00:00").getDate();
          const active = selectedDate === d.date;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => onSelectDate(d.date)}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-[10px] font-medium uppercase text-zinc-500 dark:text-zinc-400">
                {label}
              </span>
              <motion.div
                layout
                className={`relative flex h-12 w-full max-w-[52px] flex-col items-center justify-center rounded-xl border text-xs font-semibold transition ${statusStyles(d.status)} ${
                  active ? "ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-950" : ""
                }`}
              >
                <span className="text-sm">{dayNum}</span>
                <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${statusDot(d.status)}`} />
              </motion.div>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> completed
        </span>
        {" · "}
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500" /> missed
        </span>
        {" · "}
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-600" /> pending
        </span>
      </p>
    </div>
  );
}
