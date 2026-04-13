"use client";

import { WorkoutPlayer } from "@/features/workout-player/components/WorkoutPlayer";
import { useTrainingStore } from "@/stores/useTrainingStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function WorkoutDatePage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;
  const setDayStatus = useTrainingStore((s) => s.setDayStatus);
  const pushNotification = useTrainingStore((s) => s.pushNotification);
  const weekDays = useTrainingStore((s) => s.weekDays);
  const profile = useTrainingStore((s) => s.profile);
  const isLoggedIn = useTrainingStore((s) => s.isLoggedIn);

  const workouts = useMemo(() => {
    return weekDays.find((d) => d.date === date)?.workouts ?? [];
  }, [date, weekDays]);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/auth");
  }, [isLoggedIn, router]);

  return (
    <div className="flex h-[100dvh] flex-1 flex-col overflow-hidden bg-zinc-50 px-4 pb-2 pt-2 dark:bg-zinc-950">
      <WorkoutPlayer
        date={date}
        workouts={workouts}
        onFinish={({ skipped, date: d }) => {
          const clientName = profile?.name || "Client User";
          setDayStatus(d, "completed", clientName);
          const label = new Date(d + "T12:00:00").toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
          pushNotification(`Workout on ${label} completed (${skipped} skipped)`, {
            clientName,
            workoutDate: d,
          });
          router.push("/workouts");
        }}
      />
    </div>
  );
}
