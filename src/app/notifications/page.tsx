"use client";

import { AppShell } from "@/features/home/components/AppShell";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { useTrainingStore } from "@/stores/useTrainingStore";

export default function NotificationsPage() {
  const role = useTrainingStore((s) => s.role);
  const profile = useTrainingStore((s) => s.profile);
  const clientName = role === "admin" ? undefined : profile?.name;

  return (
    <AppShell>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <NotificationList clientName={clientName} />
      </div>
    </AppShell>
  );
}
