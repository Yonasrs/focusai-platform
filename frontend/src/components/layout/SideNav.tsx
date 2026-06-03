"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Upload,
  FileText,
  History,
  Settings,
  CreditCard,
  X,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { clsx } from "clsx";
import ThemeToggle from "@/components/ThemeToggle";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload",    label: "Upload",    icon: Upload },
  { href: "/reports",   label: "Reports",   icon: FileText },
  { href: "/history",   label: "History",   icon: History },
  { href: "/settings",  label: "Settings",  icon: Settings },
  { href: "/billing",   label: "Billing",   icon: CreditCard },
];

export default function SideNav({ isOpen, onClose }: SideNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const initials =
    user?.firstName?.[0]?.toUpperCase() ??
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ??
    "U";

  const displayName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "Account";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <>
      {/* Backdrop — mobile only */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="hs-sidebar-header"
        role="dialog"
        aria-label="Sidebar navigation"
        className={clsx(
          // Base layout
          "fixed top-0 left-0 bottom-0 z-60 w-64 flex flex-col",
          "bg-white dark:bg-dark-card border-r border-gray-200 dark:border-white/5",
          "transition-transform duration-300",
          // Desktop — always visible, static in normal flow
          "lg:static lg:z-auto lg:translate-x-0",
          // Mobile — slide in/out
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ── Logo header ───────────────────────────────── */}
        <header className="flex items-center justify-between gap-x-2 p-4 border-b border-gray-200 dark:border-white/5">
          <Link href="/dashboard" onClick={onClose} aria-label="FocusAI home">
            <Image
              src="/logo-dark.svg"
              alt="FocusAI"
              width={140}
              height={34}
              priority
              className="hidden dark:block"
            />
            <Image
              src="/logo.svg"
              alt="FocusAI"
              width={140}
              height={34}
              priority
              className="block dark:hidden"
            />
          </Link>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </header>

        {/* ── Nav items ─────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-2 pt-2 pb-4" aria-label="Main navigation">
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
                      ? "bg-brand-primary/15 text-brand-primary"
                      : "text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-white/5"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Footer: user dropdown + theme toggle ──────── */}
        <div className="p-2 border-t border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-1">
            {/* User dropdown */}
            <div className="relative flex-1 min-w-0" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                {/* Avatar */}
                <span className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary text-sm font-bold flex items-center justify-center shrink-0">
                  {initials}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-text truncate leading-tight">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-muted truncate leading-tight">
                    {email}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={clsx(
                    "text-gray-400 transition-transform shrink-0",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown menu — opens upward */}
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute bottom-full left-0 right-0 mb-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card shadow-lg overflow-hidden z-50"
                >
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => { setDropdownOpen(false); onClose(); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <User size={15} className="text-gray-400 shrink-0" />
                    My Account
                  </Link>
                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => { setDropdownOpen(false); onClose(); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Settings size={15} className="text-gray-400 shrink-0" />
                    Settings
                  </Link>
                  <Link
                    href="/billing"
                    role="menuitem"
                    onClick={() => { setDropdownOpen(false); onClose(); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <CreditCard size={15} className="text-gray-400 shrink-0" />
                    Billing
                  </Link>
                  <div className="border-t border-gray-100 dark:border-white/5" />
                  <button
                    role="menuitem"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                  >
                    <LogOut size={15} className="shrink-0" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
