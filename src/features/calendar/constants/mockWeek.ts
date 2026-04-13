import { WORKOUTS } from "@/features/workouts/constants/workouts";
import type { MockWeek } from "../types/week";

const [w1, w2, w3, w4, w5] = WORKOUTS;

export const MOCK_WEEK: MockWeek = {
  weekId: "week-2026-04-12",
  days: [
    {
      date: "2026-04-07",
      workouts: [w1, w2],
      status: "completed",
    },
    {
      date: "2026-04-08",
      workouts: [w3],
      status: "missed",
    },
    {
      date: "2026-04-09",
      workouts: [w4, w5],
      status: "pending",
    },
    {
      date: "2026-04-10",
      workouts: [w1, w3, w5],
      status: "pending",
    },
    {
      date: "2026-04-11",
      workouts: [w2, w4],
      status: "pending",
    },
    {
      date: "2026-04-12",
      workouts: WORKOUTS,
      status: "pending",
    },
    {
      date: "2026-04-13",
      workouts: [w3, w4],
      status: "pending",
    },
  ],
};
