import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-dark-text mb-2">Dashboard</h1>
      <p className="text-dark-muted mb-8">
        Upload your content and get AI-powered feedback before you publish.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card">
          <p className="text-dark-muted text-sm mb-1">Credits Remaining</p>
          <p className="text-3xl font-bold text-dark-text">3</p>
          <p className="text-dark-muted text-xs mt-1">Free plan</p>
        </div>
        <div className="card">
          <p className="text-dark-muted text-sm mb-1">Analyses Run</p>
          <p className="text-3xl font-bold text-dark-text">0</p>
        </div>
        <div className="card">
          <p className="text-dark-muted text-sm mb-1">Reports Saved</p>
          <p className="text-3xl font-bold text-dark-text">0</p>
        </div>
      </div>

      <div className="card text-center py-16">
        <p className="text-dark-muted mb-4">No analyses yet.</p>
        <a href="/upload" className="btn-primary">
          Upload Your First Content
        </a>
      </div>
    </div>
  );
}
