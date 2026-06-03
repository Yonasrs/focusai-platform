import type { Metadata } from "next";
import { History } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "History — FocusAI",
  description: "Browse your past content analyses.",
};

export default function HistoryPage() {
  return (
    <ComingSoon
      title="Analysis History"
      description="A full log of every analysis you've run — filterable by date, content type, and score."
      icon={History}
      milestone="Part of Milestone 8 — Dashboard"
    />
  );
}
