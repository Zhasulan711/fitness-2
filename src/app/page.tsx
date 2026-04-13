"use client";

import { useTrainingStore } from "@/stores/useTrainingStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const isLoggedIn = useTrainingStore((s) => s.isLoggedIn);
  const role = useTrainingStore((s) => s.role);
  const [hydrated, setHydrated] = useState(() =>
    typeof window !== "undefined" ? useTrainingStore.persist.hasHydrated() : false,
  );

  useEffect(() => {
    return useTrainingStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn) {
      router.replace("/auth");
      return;
    }
    router.replace(role === "admin" ? "/admin" : "/workouts");
  }, [hydrated, isLoggedIn, role, router]);

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <p className="text-sm text-zinc-500">Loading…</p>
    </div>
  );
}
