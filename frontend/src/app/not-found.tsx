import Link from "next/link";
import { Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — FocusAI",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg px-6">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <p className="text-[120px] font-black leading-none text-brand-primary/15 dark:text-brand-primary/10 select-none mb-2">
          404
        </p>

        {/* Icon ring */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary/10 mb-6 -mt-4">
          <Home size={24} className="text-brand-primary" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-dark-muted mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
