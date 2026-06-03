import type { Metadata } from "next";
import Link from "next/link";
import { Zap, TrendingUp, Lightbulb, Users, ArrowRight, Check, Play } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav";

export const metadata: Metadata = {
  title: "FocusAI — Test Before You Publish",
  description:
    "AI-powered pre-publication content review. Know if your content will hook, retain, and convert before you hit publish. Get your score in under 60 seconds.",
  openGraph: {
    title: "FocusAI — Test Before You Publish",
    description:
      "AI-powered pre-publication content review. Know if your content will hook, retain, and convert before you hit publish.",
    type: "website",
    url: "https://focusai.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "FocusAI — Test Before You Publish",
    description:
      "AI-powered pre-publication content review. Get your content score in under 60 seconds.",
  },
};

const features = [
  {
    icon: Zap,
    title: "Hook Expert",
    description:
      "Analyzes first impressions, curiosity triggers, and scroll-stopping power. Know if your opening grabs attention.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: TrendingUp,
    title: "Retention Expert",
    description:
      "Identifies pacing issues, attention drop points, and flow breaks before they cost you watch time.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Lightbulb,
    title: "Clarity Expert",
    description:
      "Checks message clarity, audience understanding, and communication effectiveness end-to-end.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Users,
    title: "AudienceLab",
    description:
      "Three synthetic personas — Skeptical, Busy, and Enthusiastic — each react to your content independently.",
    color: "text-brand-primary",
    bg: "bg-brand-primary/10",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your content",
    description: "Drop in a video, image, or text. Supported formats: MP4, JPG, PNG, plain text.",
  },
  {
    number: "02",
    title: "AI experts analyze",
    description: "Hook, Retention, and Clarity experts each run independently, then three audience personas react.",
  },
  {
    number: "03",
    title: "Get your report",
    description: "Receive a final score, per-expert breakdown, top strengths, top risks, and actionable recommendations.",
  },
];

const stats = [
  { value: "< 60s", label: "analysis time" },
  { value: "3", label: "AI experts" },
  { value: "3", label: "audience personas" },
  { value: "1", label: "final score" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28 text-center">
        {/* Glow blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-brand-primary/10 to-transparent dark:from-brand-primary/5"
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            AI-Powered Content Analysis
          </div>

          <h1 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-gray-900 dark:text-white">
            Know if your content<br />
            <span className="text-brand-primary">will perform</span> — before<br />
            you publish.
          </h1>

          <p className="text-xl text-gray-500 dark:text-dark-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            FocusAI runs your content through expert AI analysis and three synthetic audience
            personas, then delivers an actionable score in under 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="btn-primary text-base px-8 py-3 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/pricing"
              className="btn-secondary text-base px-8 py-3 flex items-center justify-center gap-2"
            >
              <Play size={16} />
              See Pricing
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-400 dark:text-dark-muted/70">
            Free plan includes 3 analyses/month — no credit card required.
          </p>
        </div>

        {/* Mock score card */}
        <div className="relative max-w-lg mx-auto mt-16">
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card shadow-xl dark:shadow-none p-6 text-left">
            <p className="text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-widest mb-4">
              Sample Analysis Result
            </p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: "Hook", score: 8.5, color: "text-yellow-500" },
                { label: "Retention", score: 7.2, color: "text-blue-400" },
                { label: "Clarity", score: 9.1, color: "text-green-400" },
              ].map(({ label, score, color }) => (
                <div key={label} className="text-center">
                  <p className={`text-3xl font-black ${color}`}>{score}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-brand-primary/10 rounded-xl px-4 py-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-dark-text">Final Score</span>
              <span className="text-2xl font-black text-brand-primary">8.3</span>
            </div>
            <ul className="mt-4 space-y-1.5">
              {[
                "Strong opening hook — keeps viewers past 3 seconds",
                "Consider tightening the mid-section (seconds 12–18)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-500 dark:text-dark-muted">
                  <Check size={13} className="text-brand-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section className="border-y border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-black text-brand-primary">{value}</p>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-primary font-semibold text-sm uppercase tracking-widest mb-3">
              What FocusAI analyzes
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Four perspectives. One verdict.
            </h2>
            <p className="text-gray-500 dark:text-dark-muted max-w-xl mx-auto">
              Each expert operates independently, then a Moderator synthesizes their findings into
              a single, actionable final report.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-dark-card p-6 hover:border-brand-primary/30 transition-colors"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${bg} mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-dark-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="px-6 py-24 bg-gray-50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-primary font-semibold text-sm uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              From upload to insight in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map(({ number, title, description }) => (
              <div key={number} className="text-center sm:text-left">
                <p className="text-5xl font-black text-brand-primary/20 dark:text-brand-primary/15 mb-4 leading-none">
                  {number}
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-dark-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-6 py-28 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-5">
            Ready to test your content?
          </h2>
          <p className="text-gray-500 dark:text-dark-muted mb-8 text-lg">
            Start free — no credit card required. Your first 3 analyses are on us.
          </p>
          <Link
            href="/sign-up"
            className="btn-primary text-base px-10 py-3.5 inline-flex items-center gap-2"
          >
            Start for Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-dark-muted/60">
          <p>© {new Date().getFullYear()} FocusAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-gray-600 dark:hover:text-dark-muted transition-colors">
              Pricing
            </Link>
            <Link href="/sign-in" className="hover:text-gray-600 dark:hover:text-dark-muted transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-gray-600 dark:hover:text-dark-muted transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
