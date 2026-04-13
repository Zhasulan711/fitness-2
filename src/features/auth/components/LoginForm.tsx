"use client";

import { useTrainingStore } from "@/stores/useTrainingStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEMO_CREDENTIALS = {
  admin: { email: "admin@trainflow.app", password: "admin123" },
  user: { email: "user@trainflow.app", password: "user123" },
} as const;

export function LoginForm() {
  const router = useRouter();
  const loginAs = useTrainingStore((s) => s.loginAs);
  const setProfile = useTrainingStore((s) => s.setProfile);
  const submitAuth = useTrainingStore((s) => s.submitAuth);
  const [clientEmail, setClientEmail] = useState<string>(DEMO_CREDENTIALS.user.email);
  const [clientPassword, setClientPassword] = useState<string>(DEMO_CREDENTIALS.user.password);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState<string>(DEMO_CREDENTIALS.admin.email);
  const [adminPassword, setAdminPassword] = useState<string>(DEMO_CREDENTIALS.admin.password);
  const [clientError, setClientError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [adminError, setAdminError] = useState("");

  function onClientLogin() {
    setClientError("");
    const valid =
      clientEmail === DEMO_CREDENTIALS.user.email &&
      clientPassword === DEMO_CREDENTIALS.user.password;
    if (!valid) {
      setClientError("Invalid client credentials.");
      return;
    }
    loginAs("user");
    setProfile({
      name: "Client User",
      nickname: "Client",
      phone: "+1 (555) 000-0000",
      email: clientEmail,
    });
    submitAuth();
    router.push("/workouts");
  }

  function onUserRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError("");
    if (!userName.trim() || !userPhone.trim() || !userEmail.trim()) {
      setRegisterError("Complete all required registration fields.");
      return;
    }
    loginAs("user");
    setProfile({
      name: userName.trim(),
      nickname: userName.trim().split(" ")[0],
      phone: userPhone.trim(),
      email: userEmail.trim(),
    });
    submitAuth();
    router.push("/workouts");
  }

  function onAdminLogin() {
    setAdminError("");
    const valid =
      adminEmail === DEMO_CREDENTIALS.admin.email &&
      adminPassword === DEMO_CREDENTIALS.admin.password;
    if (!valid) {
      setAdminError("Invalid admin credentials.");
      return;
    }
    loginAs("admin");
    setProfile({
      name: "Trainer Admin",
      nickname: "Coach",
      phone: "+1 (555) 100-0000",
      email: adminEmail,
    });
    router.push("/admin");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80"
    >
      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Client login</p>
        <p className="mt-1 text-[11px] text-zinc-500">Use fixed client credentials.</p>
        <input
          type="email"
          className="mt-2 h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <input
          type="password"
          className="mt-2 h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          value={clientPassword}
          onChange={(e) => setClientPassword(e.target.value)}
        />
        {clientError ? <p className="mt-2 text-xs text-rose-500">{clientError}</p> : null}
        <button
          type="button"
          onClick={onClientLogin}
          className="mt-2 h-10 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Login as client
        </button>
      </div>

      <form onSubmit={onUserRegister} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Client registration</p>
        <p className="mt-1 text-[11px] text-zinc-500">Create a local client profile.</p>
        <label className="mt-2 block text-sm font-medium">
          Name
          <input
            className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label className="mt-2 block text-sm font-medium">
          Phone Number
          <input
            className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
          />
        </label>
        <label className="mt-2 block text-sm font-medium">
          Email
          <input
            type="email"
            className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 dark:border-zinc-800 dark:bg-zinc-900"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </label>
        {registerError ? <p className="mt-2 text-xs text-rose-500">{registerError}</p> : null}
        <button className="mt-2 h-11 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500">
          Register client
        </button>
      </form>

      <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Admin login</p>
        <p className="mt-1 text-[11px] text-zinc-500">Use fixed trainer credentials.</p>
        <input
          type="email"
          className="mt-2 h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <input
          type="password"
          className="mt-2 h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        {adminError ? <p className="mt-2 text-xs text-rose-500">{adminError}</p> : null}
        <button
          type="button"
          onClick={onAdminLogin}
          className="mt-2 h-10 w-full rounded-lg bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-200 dark:text-zinc-900"
        >
          Login as admin
        </button>
      </div>
    </motion.div>
  );
}
