"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Upload, FileText, History, Settings, CreditCard } from "lucide-react";
import { clsx } from "clsx";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload",    label: "Upload",    icon: Upload },
  { href: "/reports",   label: "Reports",   icon: FileText },
  { href: "/history",   label: "History",   icon: History },
  { href: "/settings",  label: "Settings",  icon: Settings },
  { href: "/billing",   label: "Billing",   icon: CreditCard },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-white/5 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5">
        <Image
          src="/logo-dark.svg"
          alt="FocusAI"
          width={180}
          height={44}
          priority
          className="hidden dark:block"
        />
        <Image
          src="/logo.svg"
          alt="FocusAI"
          width={180}
          height={44}
          priority
          className="block dark:hidden"
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-brand-primary/15 text-brand-primary"
                : "text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-white/5"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer: user + theme toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
        <UserButton afterSignOutUrl="/" />
        <ThemeToggle />
      </div>
    </aside>
  );
}
