import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Start free with 3 analyses per month or go Pro for 100 analyses. No hidden fees.",
  openGraph: {
    title: "FocusAI Pricing — Simple, transparent plans",
    description: "Start free with 3 analyses/month. Upgrade to Pro for 100/month at $29.",
  },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out FocusAI before you commit.",
    credits: 3,
    highlight: false,
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    features: [
      "3 analyses per month",
      "Hook analysis",
      "Retention analysis",
      "Clarity analysis",
      "3 audience personas",
      "Final score & report",
    ],
    missing: [
      "PDF export",
      "Priority processing",
      "API access",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For creators and marketers who publish consistently.",
    credits: 100,
    highlight: true,
    cta: "Start Pro",
    ctaHref: "/sign-up?plan=pro",
    features: [
      "100 analyses per month",
      "Hook analysis",
      "Retention analysis",
      "Clarity analysis",
      "3 audience personas",
      "Final score & report",
      "PDF export",
      "Priority processing",
    ],
    missing: [
      "API access",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-dark-bg px-6 py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Link href="/" className="text-dark-muted hover:text-dark-text text-sm transition-colors inline-block mb-8">
          ← Back to home
        </Link>
        <p className="text-brand-primary font-semibold tracking-widest text-sm uppercase mb-3">
          Pricing
        </p>
        <h1 className="text-4xl font-bold text-dark-text mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-dark-muted text-lg">
          Start free. Upgrade when you need more. No hidden fees.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 flex flex-col ${
              plan.highlight
                ? "bg-brand-primary/10 border-brand-primary/50 relative"
                : "bg-dark-card border-white/5"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-brand-primary text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide uppercase">
                  Most Popular
                </span>
              </div>
            )}

            {/* Plan name & price */}
            <div className="mb-6">
              <p className="text-dark-muted text-sm font-semibold uppercase tracking-widest mb-2">
                {plan.name}
              </p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold text-dark-text">{plan.price}</span>
                <span className="text-dark-muted mb-2">{plan.period}</span>
              </div>
              <p className="text-dark-muted text-sm">{plan.description}</p>
            </div>

            {/* Credit callout */}
            <div className={`rounded-lg px-4 py-3 mb-6 text-sm font-medium ${
              plan.highlight
                ? "bg-brand-primary/20 text-brand-primary"
                : "bg-white/5 text-dark-muted"
            }`}>
              {plan.credits} {plan.credits === 1 ? "analysis" : "analyses"} / month
            </div>

            {/* CTA */}
            <Link
              href={plan.ctaHref}
              className={`text-center font-semibold py-3 px-6 rounded-lg transition-colors mb-8 ${
                plan.highlight
                  ? "bg-brand-primary hover:bg-brand-primary-hover text-white"
                  : "bg-white/10 hover:bg-white/15 text-dark-text"
              }`}
            >
              {plan.cta}
            </Link>

            {/* Features included */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-dark-text">
                  <Check size={16} className="text-brand-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Features not included */}
            {plan.missing.length > 0 && (
              <ul className="space-y-3 border-t border-white/5 pt-6">
                {plan.missing.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-dark-muted line-through">
                    <span className="w-4 h-4 shrink-0 rounded-full border border-white/10 inline-block" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* FAQ / reassurance strip */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <p className="text-dark-muted text-sm">
          Credits reset on your monthly billing date. Unused credits don&apos;t roll over.
          Cancel anytime — no questions asked.
        </p>
      </div>
    </div>
  );
}
