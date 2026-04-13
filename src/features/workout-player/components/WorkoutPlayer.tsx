"use client";

import type { Workout } from "@/features/workouts/types/workout";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

type ScrollMode = "vertical" | "horizontal";

type WorkoutPlayerProps = {
  date: string;
  workouts: Workout[];
  onFinish: (payload: { skipped: number; date: string }) => void;
};

const SWIPE_OFFSET_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 500;

function ConfirmModal({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="h-11 flex-1 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="h-11 flex-1 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function WorkoutPlayer({ date, workouts, onFinish }: WorkoutPlayerProps) {
  const [mode, setMode] = useState<ScrollMode>("vertical");
  const [index, setIndex] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [completedThisSession, setCompletedThisSession] = useState<Record<string, boolean>>({});
  const [showDesc, setShowDesc] = useState(false);
  const [clipIndex, setClipIndex] = useState(0);
  const [confirmNext, setConfirmNext] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);

  const safeIndex = workouts.length ? Math.min(index, workouts.length - 1) : 0;
  const current = workouts[safeIndex];
  const isLast = safeIndex >= workouts.length - 1;
  const legacyVideo =
    current && "video" in (current as unknown as Record<string, unknown>)
      ? ((current as unknown as { video?: string }).video ?? "")
      : "";
  const currentVideos = current?.videos?.length
    ? current.videos
    : legacyVideo
      ? [legacyVideo]
      : [];
  const currentVideo = currentVideos[clipIndex] ?? currentVideos[0];

  const markCompletedForCurrent = useCallback(() => {
    if (!current) return;
    setCompletedThisSession((m) => ({ ...m, [current.id]: true }));
  }, [current]);

  const goNext = useCallback(() => {
    setShowDesc(false);
    setClipIndex(0);
    setIndex((i) => (workouts.length ? Math.min(i + 1, workouts.length - 1) : 0));
  }, [workouts.length]);

  const goPrev = useCallback(() => {
    setShowDesc(false);
    setClipIndex(0);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const completeCurrent = () => {
    markCompletedForCurrent();
    if (isLast) {
      setFinishOpen(true);
    } else {
      goNext();
    }
  };

  const requestNext = () => {
    if (!current) return;
    if (completedThisSession[current.id]) {
      if (isLast) setFinishOpen(true);
      else goNext();
      return;
    }
    setConfirmNext(true);
  };

  const confirmSkipNext = () => {
    setSkipped((s) => s + 1);
    setConfirmNext(false);
    if (isLast) setFinishOpen(true);
    else goNext();
  };

  const exerciseDots = useMemo(
    () =>
      workouts.map((w, i) => ({
        id: w.id,
        active: i === safeIndex,
        done: !!completedThisSession[w.id],
      })),
    [workouts, safeIndex, completedThisSession],
  );

  const goNextClip = useCallback(() => {
    if (currentVideos.length < 2) return;
    setClipIndex((i) => (i + 1) % currentVideos.length);
  }, [currentVideos.length]);

  const goPrevClip = useCallback(() => {
    if (currentVideos.length < 2) return;
    setClipIndex((i) => (i - 1 + currentVideos.length) % currentVideos.length);
  }, [currentVideos.length]);

  const shouldSwipeNext = (offset: number, velocity: number) =>
    offset < -SWIPE_OFFSET_THRESHOLD || velocity < -SWIPE_VELOCITY_THRESHOLD;

  const shouldSwipePrev = (offset: number, velocity: number) =>
    offset > SWIPE_OFFSET_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD;

  if (!current) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No exercises scheduled for this day.</p>
        <Link href="/workouts" className="text-sm font-semibold text-emerald-600">
          Back to workouts
        </Link>
      </div>
    );
  }

  const weightLabel =
    current.weight === "custom" ? "Custom load" : `${current.weight} kg`;

  return (
    <div className="relative flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-black">
      <div className="relative h-[86dvh] max-h-[920px] min-h-[520px] w-full max-w-[520px] overflow-hidden rounded-2xl bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            drag={mode === "vertical" ? "y" : "x"}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (mode === "vertical") {
                if (shouldSwipeNext(info.offset.y, info.velocity.y)) {
                  if (isLast) setFinishOpen(true);
                  else goNext();
                  return;
                }
                if (shouldSwipePrev(info.offset.y, info.velocity.y)) {
                  goPrev();
                }
                return;
              }
              if (shouldSwipeNext(info.offset.x, info.velocity.x)) goNextClip();
              if (shouldSwipePrev(info.offset.x, info.velocity.x)) goPrevClip();
            }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative h-full"
          >
            <video
              key={`${current.id}-${clipIndex}`}
              className="h-full w-full bg-black object-contain"
              src={currentVideo ?? ""}
              controls
              playsInline
              preload="metadata"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/80 to-transparent px-3 pb-6 pt-3">
              <div className="pointer-events-auto flex items-center justify-between">
                <Link
                  href="/workouts"
                  className="text-sm font-medium text-zinc-200 underline-offset-4 hover:text-white hover:underline"
                >
                  ← Back
                </Link>
                <span className="text-xs text-zinc-300">
                  {new Date(date + "T12:00:00").toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-12 z-20 flex justify-center gap-1.5 py-1">
              {currentVideos.map((videoUrl, i) => (
                <span
                  key={`${current.id}-${videoUrl}-${i}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === clipIndex ? "w-6 bg-emerald-400" : "w-2 bg-white/35"
                  }`}
                />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-3">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                    {current.category}
                  </p>
                  <h2 className="text-2xl font-bold text-white">{current.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                      {current.sets} sets
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                      {weightLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDesc((v) => !v)}
                    className="mt-2 rounded-full border border-white/40 bg-black/30 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {showDesc ? "Hide description" : "Show description"}
                  </button>
                  {showDesc ? (
                    <p className="mt-2 max-w-[80vw] text-xs leading-relaxed text-zinc-200">
                      {current.description}
                    </p>
                  ) : null}
                </div>

                <div className="pointer-events-auto flex shrink-0 flex-col items-center gap-3 pb-2">
                  <button
                    type="button"
                    onClick={goNextClip}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-xl text-white shadow-lg backdrop-blur"
                    title="Next clip in this exercise"
                  >
                    🎬
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMode((m) => (m === "vertical" ? "horizontal" : "vertical"))
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-xl text-white shadow-lg backdrop-blur"
                    title={
                      mode === "vertical"
                        ? "Vertical: exercise swipe (TikTok-like)"
                        : "Horizontal: clip swipe"
                    }
                  >
                    {mode === "vertical" ? "↕" : "↔"}
                  </button>
                  <button
                    type="button"
                    onClick={completeCurrent}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl text-white shadow-lg"
                    title="Complete exercise"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={requestNext}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-xl text-white shadow-lg backdrop-blur"
                    title="Next exercise"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Shared with trainer (demo).")}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-xl text-white shadow-lg backdrop-blur"
                    title="Share with trainer"
                  >
                    ⤴
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinishOpen(true)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-xl text-white shadow-lg backdrop-blur"
                    title="Finish workout"
                  >
                    ■
                  </button>
                </div>
              </div>
              {currentVideos.length > 1 ? (
                <div className="pointer-events-none mt-2 flex gap-1">
                  {currentVideos.map((_, i) => (
                    <span
                      key={`${current.id}-clip-${i}`}
                      className={`h-1.5 rounded-full ${
                        i === clipIndex ? "w-5 bg-white" : "w-2 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
              <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-300/90">
                <span>
                  Clip {clipIndex + 1}/{Math.max(currentVideos.length, 1)}
                </span>
                <span>
                  Exercise {safeIndex + 1}/{workouts.length}
                </span>
              </div>
              <div className="pointer-events-none mt-1 flex justify-center gap-1">
                {exerciseDots.map((d) => (
                  <span
                    key={`exercise-${d.id}`}
                    className={`h-1 rounded-full ${
                      d.active ? "w-4 bg-emerald-300" : d.done ? "w-2 bg-emerald-300/70" : "w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <ConfirmModal
        open={confirmNext}
        title="Skip this exercise?"
        body="You have not marked this exercise complete. Continuing will count it as skipped."
        confirmLabel="Skip & next"
        onCancel={() => setConfirmNext(false)}
        onConfirm={confirmSkipNext}
      />

      <ConfirmModal
        open={finishOpen}
        title="Finish workout"
        body={`You skipped ${skipped} exercise${skipped === 1 ? "" : "s"} this session. Mark this day as completed?`}
        confirmLabel="Confirm"
        onCancel={() => setFinishOpen(false)}
        onConfirm={() => {
          setFinishOpen(false);
          onFinish({ skipped, date });
        }}
      />
    </div>
  );
}
