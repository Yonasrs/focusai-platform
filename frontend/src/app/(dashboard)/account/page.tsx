import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "My Account",
  description: "View your FocusAI profile, plan, and credits.",
};

export default function AccountPage() {
  return <AccountClient />;
}
