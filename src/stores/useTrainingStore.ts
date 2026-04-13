"use client";

import { MOCK_WEEK } from "@/features/calendar/constants/mockWeek";
import type { DayStatus, WeekDay } from "@/features/calendar/types/week";
import { MOCK_NOTIFICATIONS } from "@/features/notifications/constants/mockNotifications";
import type { NotificationItem } from "@/features/notifications/types/notification";
import type { AuthProfile } from "@/features/auth/types/auth";
import type { Workout, WorkoutCategory } from "@/features/workouts/types/workout";
import { WORKOUTS } from "@/features/workouts/constants/workouts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "admin" | "user" | null;
type StatusByDate = Record<string, DayStatus>;
type DaysByClient = Record<string, WeekDay[]>;
type StatusByClient = Record<string, StatusByDate>;

const DEFAULT_CLIENT_NAME = "Client User";

function cloneDays(days: WeekDay[]): WeekDay[] {
  return days.map((d) => ({
    ...d,
    workouts: d.workouts.map((w) => ({ ...w, videos: [...w.videos], equipmentImages: [...w.equipmentImages] })),
  }));
}

function statusMapFromDays(days: WeekDay[]): StatusByDate {
  return days.reduce<StatusByDate>((acc, day) => {
    acc[day.date] = day.status;
    return acc;
  }, {});
}

const initialWeekDays = cloneDays(MOCK_WEEK.days);
const initialStatusByDate = statusMapFromDays(initialWeekDays);

type TrainingStore = {
  isLoggedIn: boolean;
  role: Role;
  profile: AuthProfile | null;
  submitted: boolean;
  waitingApproval: boolean;
  workoutLibrary: Workout[];
  weekDays: WeekDay[];
  dayStatusByDate: StatusByDate;
  clientWeekDays: DaysByClient;
  clientDayStatusByDate: StatusByClient;
  notifications: NotificationItem[];

  loginAs: (role: Exclude<Role, null>) => void;
  logout: () => void;
  setProfile: (profile: AuthProfile) => void;
  submitAuth: () => void;
  approveClient: () => void;
  renameClient: (name: string) => void;
  addWorkoutToLibrary: (workout: Workout) => void;
  addVideoToExercise: (category: WorkoutCategory, title: string, video: string) => void;
  assignWorkoutToDate: (date: string, workout: Workout, clientName?: string) => void;
  setDayStatus: (date: string, status: DayStatus, clientName?: string) => void;
  pushNotification: (
    message: string,
    extras?: Pick<NotificationItem, "clientName" | "workoutDate">,
  ) => void;
};

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      role: null,
      profile: null,
      submitted: false,
      waitingApproval: false,
      workoutLibrary: WORKOUTS.map((w) => ({ ...w, videos: [...w.videos], equipmentImages: [...w.equipmentImages] })),
      weekDays: cloneDays(initialWeekDays),
      dayStatusByDate: { ...initialStatusByDate },
      clientWeekDays: {
        [DEFAULT_CLIENT_NAME]: cloneDays(initialWeekDays),
      },
      clientDayStatusByDate: {
        [DEFAULT_CLIENT_NAME]: { ...initialStatusByDate },
      },
      notifications: [...MOCK_NOTIFICATIONS],

      loginAs: (role) =>
        set({
          role,
          isLoggedIn: true,
          waitingApproval: role === "user",
          submitted: role === "user",
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          role: null,
          profile: null,
          submitted: false,
          waitingApproval: false,
        }),

      setProfile: (profile) =>
        set((state) => {
          const name = profile.name.trim() || DEFAULT_CLIENT_NAME;
          if (state.clientWeekDays[name]) {
            return { profile };
          }
          return {
            profile,
            clientWeekDays: {
              ...state.clientWeekDays,
              [name]: cloneDays(initialWeekDays),
            },
            clientDayStatusByDate: {
              ...state.clientDayStatusByDate,
              [name]: { ...initialStatusByDate },
            },
          };
        }),

      submitAuth: () =>
        set({
          isLoggedIn: true,
          submitted: true,
          waitingApproval: true,
        }),

      approveClient: () => set({ waitingApproval: false }),

      renameClient: (name) =>
        set((state) => {
          const nextName = name.trim();
          if (!nextName || !state.profile) return {};
          const prevName = state.profile.name || DEFAULT_CLIENT_NAME;
          const prevDays = state.clientWeekDays[prevName];
          const prevStatuses = state.clientDayStatusByDate[prevName];
          const nextClientWeekDays = { ...state.clientWeekDays };
          const nextClientStatuses = { ...state.clientDayStatusByDate };
          if (prevDays) {
            delete nextClientWeekDays[prevName];
            nextClientWeekDays[nextName] = prevDays;
          }
          if (prevStatuses) {
            delete nextClientStatuses[prevName];
            nextClientStatuses[nextName] = prevStatuses;
          }
          return {
            profile: { ...state.profile, name: nextName },
            clientWeekDays: nextClientWeekDays,
            clientDayStatusByDate: nextClientStatuses,
          };
        }),

      addWorkoutToLibrary: (workout) =>
        set((state) => ({
          workoutLibrary: [workout, ...state.workoutLibrary],
        })),

      addVideoToExercise: (category, title, video) =>
        set((state) => {
          const appendVideo = (workout: Workout): Workout => {
            if (workout.category !== category || workout.title !== title) return workout;
            if (workout.videos.includes(video)) return workout;
            return { ...workout, videos: [...workout.videos, video] };
          };

          const nextClientWeekDays = Object.fromEntries(
            Object.entries(state.clientWeekDays).map(([client, days]) => [
              client,
              days.map((day) => ({
                ...day,
                workouts: day.workouts.map(appendVideo),
              })),
            ]),
          );

          const currentClient = state.profile?.name || DEFAULT_CLIENT_NAME;

          return {
            workoutLibrary: state.workoutLibrary.map(appendVideo),
            clientWeekDays: nextClientWeekDays,
            weekDays: nextClientWeekDays[currentClient] ?? state.weekDays,
          };
        }),

      assignWorkoutToDate: (date, workout, clientName) =>
        set((state) => {
          const targetClient = clientName || state.profile?.name || DEFAULT_CLIENT_NAME;
          const clientDays = state.clientWeekDays[targetClient] ?? [];
          const nextClientDays = (() => {
            const exists = clientDays.some((d) => d.date === date);
            if (!exists) {
              return [
                ...clientDays,
                { date, workouts: [workout], status: "pending" as DayStatus },
              ];
            }
            return clientDays.map((d) =>
              d.date === date ? { ...d, workouts: [...d.workouts, workout] } : d,
            );
          })();
          const isCurrentUser = targetClient === (state.profile?.name || DEFAULT_CLIENT_NAME);
          const workoutLabel = workout.title || "Workout";
          const message = `${workoutLabel} assigned for ${date}`;
          return {
            clientWeekDays: {
              ...state.clientWeekDays,
              [targetClient]: nextClientDays,
            },
            weekDays: isCurrentUser ? nextClientDays : state.weekDays,
            notifications: [
              {
                id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                message,
                date: new Date().toISOString(),
                clientName: targetClient,
                workoutDate: date,
              },
              ...state.notifications,
            ],
          };
        }),

      setDayStatus: (date, status, clientName) =>
        set((state) => {
          const targetClient = clientName || state.profile?.name || DEFAULT_CLIENT_NAME;
          const currentClientStatuses = state.clientDayStatusByDate[targetClient] ?? {};
          const nextClientStatuses = { ...currentClientStatuses, [date]: status };
          const nextWeekDays = (state.clientWeekDays[targetClient] ?? []).map((d) =>
            d.date === date ? { ...d, status } : d,
          );
          const isCurrentUser = targetClient === (state.profile?.name || DEFAULT_CLIENT_NAME);
          const statusMessage =
            status === "completed"
              ? `Workout day ${date} marked completed`
              : status === "missed"
                ? `Workout day ${date} marked missed`
                : `Workout day ${date} set to pending`;
          return {
            clientDayStatusByDate: {
              ...state.clientDayStatusByDate,
              [targetClient]: nextClientStatuses,
            },
            dayStatusByDate: isCurrentUser
              ? { ...state.dayStatusByDate, [date]: status }
              : state.dayStatusByDate,
            clientWeekDays: {
              ...state.clientWeekDays,
              [targetClient]: nextWeekDays,
            },
            weekDays: isCurrentUser ? nextWeekDays : state.weekDays,
            notifications: [
              {
                id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                message: statusMessage,
                date: new Date().toISOString(),
                clientName: targetClient,
                workoutDate: date,
              },
              ...state.notifications,
            ],
          };
        }),

      pushNotification: (message, extras) =>
        set((state) => ({
          notifications: [
            {
              id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              message,
              date: new Date().toISOString(),
              ...extras,
            },
            ...state.notifications,
          ],
        })),
    }),
    {
      name: "training-store-v1",
    },
  ),
);

export function getStatusForDate(date: string, dayStatusByDate: StatusByDate): DayStatus {
  return dayStatusByDate[date] ?? "pending";
}
