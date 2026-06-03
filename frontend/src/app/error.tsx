"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg px-6">
      <div className="text-center max-w-md">
        {/* Big 500 */}
        <p className="text-[120px] font-black leading-none text-red-500/10 select-none mb-2">
          500
        </p>

        {/* Icon ring */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 mb-6 -mt-4">
          <AlertTriangle size={24} className="text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-500 dark:text-dark-muted mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span className="block mt-2 text-xs font-mono text-gray-400 dark:text-dark-muted/60">
              Error ID: {error.digest}
            </span>
          )}
        </p>

        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <a href="/" className="btn-secondary">
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
