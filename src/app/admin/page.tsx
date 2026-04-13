"use client";

import type { Workout, WorkoutCategory } from "@/features/workouts/types/workout";
import { AppShell } from "@/features/home/components/AppShell";
import { useTrainingStore } from "@/stores/useTrainingStore";
import { useMemo, useState } from "react";

const videos = ["/videos/test-1.mp4", "/videos/test-2.mp4", "/videos/test-3.mp4", "/videos/test-4.mp4", "/videos/test-5.mp4"];

type AdminTab = "database" | "assign";

type ExerciseEntry = {
  category: WorkoutCategory;
  title: string;
  description: string;
  videos: string[];
  sourceWorkout: Workout;
};

function exerciseKey(category: WorkoutCategory, title: string): string {
  return `${category}::${title.trim().toLowerCase()}`;
}

export default function AdminPage() {
  const profile = useTrainingStore((s) => s.profile);
  const waitingApproval = useTrainingStore((s) => s.waitingApproval);
  const workouts = useTrainingStore((s) => s.workoutLibrary);
  const approveClient = useTrainingStore((s) => s.approveClient);
  const renameClient = useTrainingStore((s) => s.renameClient);
  const addWorkoutToLibrary = useTrainingStore((s) => s.addWorkoutToLibrary);
  const addVideoToExercise = useTrainingStore((s) => s.addVideoToExercise);
  const assignWorkoutToDate = useTrainingStore((s) => s.assignWorkoutToDate);
  const clientWeekDays = useTrainingStore((s) => s.clientWeekDays);
  const clientDayStatusByDate = useTrainingStore((s) => s.clientDayStatusByDate);
  const [rename, setRename] = useState(profile?.name ?? "");
  const [tab, setTab] = useState<AdminTab>("database");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [selectedClient, setSelectedClient] = useState("Client User");
  const [selectedExerciseKey, setSelectedExerciseKey] = useState("");
  const [assignSets, setAssignSets] = useState("3");
  const [assignWeight, setAssignWeight] = useState("custom");
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [form, setForm] = useState({
    category: "Back" as WorkoutCategory,
    title: "",
    videos: [videos[0]],
    videosInput: videos[0],
    description: "",
  });

  const clients = useMemo(() => {
    const baseClients = Object.keys(clientWeekDays).filter(
      (name) => name.trim().toLowerCase() !== "trainer admin",
    );
    const withDefaults = [...baseClients, "Client Demo 2", "Client Demo 3"];
    return Array.from(new Set(withDefaults));
  }, [clientWeekDays]);

  const exercisesByCategory = useMemo(() => {
    const grouped = workouts.reduce<Record<WorkoutCategory, Record<string, ExerciseEntry>>>(
      (acc, w) => {
        const key = exerciseKey(w.category, w.title);
        const current = acc[w.category][key];
        const videosList = Array.isArray(w.videos) ? w.videos : [];
        if (!current) {
          acc[w.category][key] = {
            category: w.category,
            title: w.title,
            description: w.description,
            videos: videosList,
            sourceWorkout: w,
          };
          return acc;
        }
        const merged = [...current.videos];
        videosList.forEach((v) => {
          if (!merged.includes(v)) merged.push(v);
        });
        acc[w.category][key] = { ...current, videos: merged };
        return acc;
      },
      { Back: {}, Arms: {}, Legs: {} },
    );
    return grouped;
  }, [workouts]);

  const exerciseOptions = useMemo(
    () =>
      (Object.keys(exercisesByCategory) as WorkoutCategory[]).flatMap((cat) =>
        Object.values(exercisesByCategory[cat]).map((entry) => ({
          key: exerciseKey(cat, entry.title),
          label: `${cat} · ${entry.title}`,
          entry,
        })),
      ),
    [exercisesByCategory],
  );
  const selectedClientDays = clientWeekDays[selectedClient] ?? [];
  const selectedClientStatus = clientDayStatusByDate[selectedClient] ?? {};

  const monthDays = useMemo(() => {
    const start = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth(),
      1,
    );
    const end = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth() + 1,
      0,
    );
    const startWeekday = (start.getDay() + 6) % 7;
    const total = end.getDate();

    const items: { date: string; day: number; inMonth: boolean }[] = [];
    for (let i = 0; i < startWeekday; i += 1) {
      items.push({ date: `pad-start-${i}`, day: 0, inMonth: false });
    }
    for (let day = 1; day <= total; day += 1) {
      const d = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day);
      items.push({
        date: d.toISOString().slice(0, 10),
        day,
        inMonth: true,
      });
    }
    while (items.length % 7 !== 0) {
      items.push({ date: `pad-end-${items.length}`, day: 0, inMonth: false });
    }
    return items;
  }, [monthCursor]);

  return (
    <AppShell requiredRole="admin">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Trainer Admin</h1>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
          <h2 className="text-sm font-semibold">Client verification</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Nickname stays fixed: {profile?.nickname ?? "Client"}
          </p>
          <div className="mt-3 flex gap-2">
            <input value={rename} onChange={(e) => setRename(e.target.value)} className="h-10 flex-1 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900" />
            <button onClick={() => renameClient(rename)} className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white dark:bg-zinc-200 dark:text-zinc-900">Rename</button>
          </div>
          {waitingApproval ? (
            <button onClick={approveClient} className="mt-3 h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white">Confirm client</button>
          ) : null}
        </section>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setTab("database")}
            className={`h-10 rounded-lg text-sm font-semibold ${tab === "database" ? "bg-white dark:bg-zinc-800" : ""}`}
          >
            All workouts
          </button>
          <button
            type="button"
            onClick={() => setTab("assign")}
            className={`h-10 rounded-lg text-sm font-semibold ${tab === "assign" ? "bg-white dark:bg-zinc-800" : ""}`}
          >
            Add workout to client
          </button>
        </div>

        {tab === "database" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
          <h2 className="text-sm font-semibold">Create exercise</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <select className="h-10 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900" value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value as WorkoutCategory }))}>
              <option>Back</option><option>Arms</option><option>Legs</option>
            </select>
            <select className="h-10 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900" value={form.videos[0]} onChange={(e) => setForm((v) => ({ ...v, videos: [e.target.value], videosInput: e.target.value }))}>
              {videos.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <input placeholder="Workout title" className="h-10 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} />
            <div className="h-10" />
          </div>
          <input
            placeholder="Videos: /videos/test-1.mp4, /videos/test-2.mp4"
            className="mt-2 h-10 w-full rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900"
            value={form.videosInput}
            onChange={(e) =>
              setForm((v) => ({
                ...v,
                videosInput: e.target.value,
                videos: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
          />
          <input
            type="file"
            accept="video/*"
            multiple
            className="mt-2 h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:file:bg-zinc-200 dark:file:text-zinc-900"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []);
              if (!picked.length) return;
              const localUrls = picked.map((f) => URL.createObjectURL(f));
              setForm((v) => ({
                ...v,
                videos: [...v.videos, ...localUrls],
                videosInput: [...v.videos, ...localUrls].join(", "),
              }));
            }}
          />
          <textarea placeholder="Workout description" className="mt-2 min-h-20 w-full rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900" value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} />
          <button
            onClick={() => {
              addWorkoutToLibrary({
                id: `w-${Date.now()}`,
                category: form.category,
                title: form.title || "Workout",
                videos: form.videos.length > 0 ? form.videos : [videos[0]],
                description: form.description || "Trainer workout",
                sets: 3,
                weight: "custom",
                equipmentImages: [],
              });
            }}
            className="mt-2 h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white"
          >
            Create exercise
          </button>
          <div className="mt-6">
            <h2 className="text-sm font-semibold">All exercises in trainer database</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {(Object.keys(exercisesByCategory) as WorkoutCategory[]).map((cat) => (
                <div key={cat} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{cat}</p>
                  <ul className="mt-2 space-y-2">
                    {Object.values(exercisesByCategory[cat]).map((entry) => {
                      const key = exerciseKey(entry.category, entry.title);
                      return (
                        <li key={key} className="rounded-lg bg-zinc-100 p-2 text-xs dark:bg-zinc-900">
                          <p className="font-semibold">{entry.title}</p>
                          <p className="mt-0.5 text-zinc-500">{entry.videos.length} clips</p>
                          <p className="mt-1 text-[11px] text-zinc-500">
                            {entry.videos.map((v) => v.split("/").pop()).join(", ")}
                          </p>
                          <label
                            htmlFor={`upload-${key}`}
                            className="mt-2 inline-flex h-8 cursor-pointer items-center rounded-lg bg-zinc-900 px-3 text-[11px] font-semibold text-white dark:bg-zinc-200 dark:text-zinc-900"
                          >
                            Add video
                          </label>
                          <input
                            id={`upload-${key}`}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const localUrl = URL.createObjectURL(file);
                              addVideoToExercise(entry.category, entry.title, localUrl);
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        ) : null}

        {tab === "assign" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Trainer calendar</h2>
            <div className="flex items-center gap-2 text-xs">
              <button type="button" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="h-8 rounded-lg border border-zinc-200 px-2 dark:border-zinc-800">←</button>
              <span className="min-w-28 text-center font-medium">
                {monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </span>
              <button type="button" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="h-8 rounded-lg border border-zinc-200 px-2 dark:border-zinc-800">→</button>
            </div>
          </div>
          <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((cell) => {
              if (!cell.inMonth) return <div key={cell.date} className="h-20 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60" />;
              const workoutsForDay = selectedClientDays.find((d) => d.date === cell.date)?.workouts.length ?? 0;
              const status = selectedClientStatus[cell.date] ?? "pending";
              const isSelected = selectedDate === cell.date;
              const tone =
                status === "completed"
                  ? "border-emerald-500/70 bg-emerald-500/15"
                  : status === "missed"
                    ? "border-rose-500/70 bg-rose-500/15"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950";
              return (
                <button
                  type="button"
                  key={cell.date}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`h-20 rounded-xl border p-2 text-left ${tone} ${isSelected ? "ring-2 ring-emerald-500/60" : ""}`}
                >
                  <p className="text-sm font-semibold">{cell.day}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{workoutsForDay} exercises</p>
                </button>
              );
            })}
          </div>
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Add workout to one client ({selectedDate})
          </h3>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="h-10 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900">
              {clients.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={selectedExerciseKey} onChange={(e) => setSelectedExerciseKey(e.target.value)} className="h-10 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900">
              <option value="">Select exercise</option>
              {exerciseOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
            <input value={assignSets} onChange={(e) => setAssignSets(e.target.value)} placeholder="Sets" className="h-10 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900" />
            <input value={assignWeight} onChange={(e) => setAssignWeight(e.target.value)} placeholder="Weight or custom" className="h-10 rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900" />
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
            <span>Client:</span>
            <span className="font-semibold">{selectedClient}</span>
          </div>
          <button
            onClick={() => {
              const selected = exerciseOptions.find((o) => o.key === selectedExerciseKey);
              if (!selected) return;
              const source = selected.entry.sourceWorkout;
              assignWorkoutToDate(selectedDate, {
                ...source,
                id: `w-assigned-${Date.now()}`,
                sets: Number(assignSets || 0) || source.sets,
                weight: assignWeight === "custom" ? "custom" : Number(assignWeight || 0) || source.weight,
              }, selectedClient);
            }}
            className="mt-3 h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white dark:bg-zinc-200 dark:text-zinc-900"
          >
            Add to day
          </button>
        </section>
        ) : null}
      </div>
    </AppShell>
  );
}
