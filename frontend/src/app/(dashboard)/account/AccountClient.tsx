"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Loader2, Pencil, CreditCard, Zap, ShieldCheck } from "lucide-react";

interface UserPlan {
  plan: string;
  credits_remaining: number;
  is_admin: boolean;
}

export default function AccountClient() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [planData, setPlanData] = useState<UserPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) setPlanData(await res.json());
      } finally {
        setPlanLoading(false);
      }
    }
    load();
  }, [getToken]);

  if (!isLoaded) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 size={24} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  const initials =
    ((user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")).toUpperCase() ||
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
    "U";

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "—";

  const email = user?.emailAddresses?.[0]?.emailAddress ?? "—";
  const isPro = planData?.plan === "pro";

  return (
    <div className="p-6 sm:p-8 max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">My Account</h1>
        <p className="text-gray-500 dark:text-dark-muted text-sm mt-1">
          Your profile and subscription at a glance.
        </p>
      </div>

      {/* ── Profile card ─────────────────────────────── */}
      <section className="card">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <span className="w-20 h-20 rounded-2xl bg-brand-primary/20 text-brand-primary text-3xl font-bold flex items-center justify-center shrink-0 uppercase">
            {initials}
          </span>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
                {fullName}
              </h2>
              {planData?.is_admin && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={11} /> Admin
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-dark-muted text-sm mt-0.5 truncate">{email}</p>

            {/* Plan badge */}
            <div className="mt-3">
              {planLoading ? (
                <span className="inline-block w-16 h-5 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isPro
                      ? "bg-brand-primary/15 text-brand-primary"
                      : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-dark-muted"
                  }`}
                >
                  <CreditCard size={11} />
                  {isPro ? "Pro plan" : "Free plan"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/5">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 btn-primary text-sm py-2"
          >
            <Pencil size={14} /> Edit Profile
          </Link>
        </div>
      </section>

      {/* ── Credits card ─────────────────────────────── */}
      <section className="card space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-dark-text">Credits &amp; Usage</h2>

        {planLoading ? (
          <div className="flex items-center gap-2 text-gray-500 dark:text-dark-muted text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Zap size={22} className="text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                  {planData?.credits_remaining ?? 0}
                  <span className="text-base font-normal text-gray-500 dark:text-dark-muted ml-1">
                    / {isPro ? "100" : "3"} credits left
                  </span>
                </p>
                <p className="text-xs text-gray-400 dark:text-dark-muted/70 mt-0.5">
                  Resets on your monthly billing date
                </p>
              </div>
            </div>

            {/* Credit bar */}
            {planData && (
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (planData.credits_remaining / (isPro ? 100 : 3)) * 100
                    )}%`,
                  }}
                />
              </div>
            )}

            {!isPro && (
              <Link
                href="/billing"
                className="block text-center btn-secondary text-sm py-2"
              >
                Upgrade to Pro — 100 credits/month
              </Link>
            )}
          </>
        )}
      </section>
    </div>
  );
}
