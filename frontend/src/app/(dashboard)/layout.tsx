import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideNav from "@/components/layout/SideNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
