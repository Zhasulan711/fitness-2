"use client";

import { useTrainingStore } from "@/stores/useTrainingStore";
import { motion, AnimatePresence } from "framer-motion";

export function ApprovalBanner() {
  const waiting = useTrainingStore((s) => s.waitingApproval);
  const submitted = useTrainingStore((s) => s.submitted);

  return (
    <AnimatePresence>
      {submitted && waiting ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 overflow-hidden rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
        >
          <p className="font-medium">Waiting for trainer approval</p>
          <p className="mt-1 text-xs text-amber-900/80 dark:text-amber-100/80">
            This is simulated local state — you can still explore workouts and the calendar.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
