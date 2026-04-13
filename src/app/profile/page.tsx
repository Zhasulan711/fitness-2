"use client";

import { AppShell } from "@/features/home/components/AppShell";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { motion } from "framer-motion";

export default function ProfilePage() {
  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <ProfileStats />
      </motion.div>
    </AppShell>
  );
}
