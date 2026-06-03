import type { Metadata } from "next";
import { Settings } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Settings — FocusAI",
  description: "Manage your FocusAI account and preferences.",
};

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Manage your profile, notification preferences, and connected accounts."
      icon={Settings}
      milestone="Part of Milestone 12 — Production Beta"
    />
  );
}
