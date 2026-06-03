import type { Metadata } from "next";
import { FileText } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Reports — FocusAI",
  description: "View your AI-generated content analysis reports.",
};

export default function ReportsPage() {
  return (
    <ComingSoon
      title="Reports"
      description="All your AI-generated analysis reports will live here. Run your first analysis to see results."
      icon={FileText}
      milestone="Part of Milestone 8 — Dashboard"
    />
  );
}
