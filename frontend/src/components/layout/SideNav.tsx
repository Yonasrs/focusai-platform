"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Upload, FileText, History, Settings, CreditCard } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark-card border-r border-white/5 flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/5">
        <span className="text-xl font-bold text-dark-text">FocusAI</span>
        <span className="ml-2 text-xs text-brand-primary font-semibold bg-brand-primary/10 px-2 py-0.5 rounded-full">
          PrePublish
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-brand-primary/15 text-brand-primary"
                : "text-dark-muted hover:text-dark-text hover:bg-white/5"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
}
