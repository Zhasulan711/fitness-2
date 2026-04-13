"use client";

import { WeekCalendar } from "@/features/calendar/components/WeekCalendar";
import { ApprovalBanner } from "@/features/home/components/ApprovalBanner";
import { AppShell } from "@/features/home/components/AppShell";
import { DayActions } from "@/features/home/components/DayActions";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your week</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tap a day to see status colors, then start a session.
          </p>
        </div>
        <ApprovalBanner />
        <WeekCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <DayActions selectedDate={selectedDate} />
        <div>
          <h2 className="mb-2 text-sm font-semibold tracking-tight">Notifications</h2>
          <NotificationList limit={5} />
        </div>
      </motion.div>
    </AppShell>
  );
}
