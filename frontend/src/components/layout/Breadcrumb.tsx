"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  upload:    "Upload",
  reports:   "Reports",
  history:   "History",
  settings:  "Settings",
  billing:   "Billing",
};

function getLabel(seg: string): string {
  if (ROUTE_LABELS[seg]) return ROUTE_LABELS[seg];
  // Long strings are IDs (UUIDs etc.) — label them as "Detail"
  if (seg.length > 20) return "Detail";
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

const Chevron = () => (
  <svg
    className="shrink-0 mx-2 size-4 text-gray-400 dark:text-dark-muted/50"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default function Breadcrumb({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build crumb list — skip dashboard segment when it's just the root
  const crumbs = segments.map((seg, i) => ({
    label: getLabel(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  const isAtRoot = pathname === "/dashboard";

  return (
    <div className="flex items-center gap-x-1 px-4 sm:px-6 py-2 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-dark-bg">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg text-gray-500 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mr-2 flex-shrink-0"
        aria-label="Toggle navigation"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <ol className="flex items-center whitespace-nowrap text-sm">
        <li className="inline-flex items-center">
          {isAtRoot ? (
            <span className="font-semibold text-gray-900 dark:text-dark-text" aria-current="page">
              Home
            </span>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-gray-500 dark:text-dark-muted hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
              >
                Home
              </Link>
              <Chevron />
            </>
          )}
        </li>

        {!isAtRoot &&
          crumbs
            .filter((c) => c.href !== "/dashboard")
            .map((crumb) => (
              <li key={crumb.href} className="inline-flex items-center">
                {crumb.isLast ? (
                  <span
                    className="font-semibold text-gray-900 dark:text-dark-text"
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className="text-gray-500 dark:text-dark-muted hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                    <Chevron />
                  </>
                )}
              </li>
            ))}
      </ol>
    </div>
  );
}
