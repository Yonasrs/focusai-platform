"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { Check, Pencil, X, Loader2, CreditCard, Zap } from "lucide-react";

interface UserPlan {
  plan: string;
  credits_remaining: number;
  email: string;
}

export default function SettingsClient() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [planData, setPlanData] = useState<UserPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);

  // Edit-name state
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Fetch plan + credits from backend
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

  // Seed form when Clerk user loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [user]);

  function cancelEdit() {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setSaveError(null);
    setEditing(false);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    try {
      await user.update({ firstName: firstName.trim(), lastName: lastName.trim() });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Failed to update name. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const initials =
    (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
    "U";

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "—";

  const email = user?.emailAddresses?.[0]?.emailAddress ?? planData?.email ?? "—";

  const isPro = planData?.plan === "pro";

  if (!isLoaded) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 size={24} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Settings</h1>
        <p className="text-gray-500 dark:text-dark-muted text-sm mt-1">
          Manage your account details and preferences.
        </p>
      </div>

      {/* ── Profile card ──────────────────────────────── */}
      <section className="card space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-dark-text">Profile</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              <Pencil size={14} /> Edit name
            </button>
          )}
        </div>

        {/* Avatar + identity */}
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-brand-primary/20 text-brand-primary text-xl font-bold flex items-center justify-center shrink-0 uppercase">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-dark-text">{fullName}</p>
            <p className="text-sm text-gray-500 dark:text-dark-muted truncate">{email}</p>
          </div>
          {saved && (
            <span className="ml-auto flex items-center gap-1 text-green-500 text-sm font-medium">
              <Check size={15} /> Saved
            </span>
          )}
        </div>

        {/* Field rows (read-only) */}
        {!editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-xs text-gray-400 dark:text-dark-muted/70 mb-1">First name</p>
              <p className="text-sm text-gray-900 dark:text-dark-text">{user?.firstName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-dark-muted/70 mb-1">Last name</p>
              <p className="text-sm text-gray-900 dark:text-dark-text">{user?.lastName || "—"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400 dark:text-dark-muted/70 mb-1">Email</p>
              <p className="text-sm text-gray-900 dark:text-dark-text">{email}</p>
            </div>
          </div>
        )}

        {/* Edit form */}
        {editing && (
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-dark-muted mb-1.5">
                  First name
                </label>
                <input
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  disabled={saving}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-dark-muted mb-1.5">
                  Last name
                </label>
                <input
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  disabled={saving}
                />
              </div>
            </div>

            {saveError && (
              <p className="text-sm text-red-500">{saveError}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary py-2 flex items-center gap-2"
              >
                {saving ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving…</>
                ) : (
                  <><Check size={15} /> Save changes</>
                )}
              </button>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="btn-secondary py-2 flex items-center gap-2"
              >
                <X size={15} /> Cancel
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-dark-muted/60 border-t border-gray-100 dark:border-white/5 pt-4">
          Email is managed by your Clerk account and cannot be changed here.
        </p>
      </section>

      {/* ── Plan & credits card ───────────────────────── */}
      <section className="card space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-dark-text">Plan &amp; Credits</h2>

        {planLoading ? (
          <div className="flex items-center gap-2 text-gray-500 dark:text-dark-muted text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={16} className="text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-dark-muted uppercase tracking-widest font-medium">
                    Current plan
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-bold capitalize ${
                      isPro ? "text-brand-primary" : "text-gray-900 dark:text-dark-text"
                    }`}
                  >
                    {planData?.plan ?? "free"}
                  </span>
                  {isPro && (
                    <span className="text-xs font-semibold bg-brand-primary/15 text-brand-primary px-2 py-0.5 rounded-full">
                      Pro
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-dark-muted uppercase tracking-widest font-medium">
                    Credits remaining
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-dark-text">
                  {planData?.credits_remaining ?? 0}
                  <span className="text-sm font-normal text-gray-500 dark:text-dark-muted ml-1">
                    / {isPro ? "100" : "3"} this month
                  </span>
                </p>
              </div>
            </div>

            {!isPro && (
              <div className="rounded-xl bg-brand-primary/5 border border-brand-primary/20 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                    Upgrade to Pro
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
                    100 analyses/month for $29 — unlock priority processing and PDF export.
                  </p>
                </div>
                <a
                  href="/billing"
                  className="btn-primary text-sm py-2 px-4 shrink-0 whitespace-nowrap"
                >
                  Upgrade
                </a>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
