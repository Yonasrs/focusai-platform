import type { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your FocusAI account details, name, and subscription.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
