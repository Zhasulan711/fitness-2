"use client";

import { WeekCalendar } from "@/features/calendar/components/WeekCalendar";
import { AppShell } from "@/features/home/components/AppShell";
import { DayActions } from "@/features/home/components/DayActions";
import { useState } from "react";

export default function WorkoutsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Client Workouts</h1>
        <WeekCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <DayActions selectedDate={selectedDate} />
      </div>
    </AppShell>
  );
}
