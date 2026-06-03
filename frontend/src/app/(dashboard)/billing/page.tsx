import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Billing — FocusAI",
  description: "Manage your FocusAI subscription and billing.",
};

export default function BillingPage() {
  return (
    <ComingSoon
      title="Billing & Subscription"
      description="Upgrade to Pro, manage your subscription, view invoices, and update payment details."
      icon={CreditCard}
      milestone="Part of Milestone 10 — Stripe Billing"
    />
  );
}
