import type { Workout } from "@/features/workouts/types/workout";

export type DayStatus = "completed" | "missed" | "pending";

export type WeekDay = {
  date: string;
  workouts: Workout[];
  status: DayStatus;
};

export type MockWeek = {
  weekId: string;
  days: WeekDay[];
};
