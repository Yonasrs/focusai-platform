import Image from "next/image";
import Link from "next/link";

export default function PublicNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="FocusAI home">
          <Image
            src="/logo-dark.svg"
            alt="FocusAI"
            width={130}
            height={32}
            priority
            className="hidden dark:block"
          />
          <Image
            src="/logo.svg"
            alt="FocusAI"
            width={130}
            height={32}
            priority
            className="block dark:hidden"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/pricing"
            className="text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text transition-colors"
          >
            Sign In
          </Link>
          <Link href="/sign-up" className="btn-primary text-sm py-2 px-4">
            Get Started Free
          </Link>
        </div>
      </div>
    </header>
  );
}
