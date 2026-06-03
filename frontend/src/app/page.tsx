import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <p className="text-brand-primary font-semibold tracking-widest text-sm uppercase mb-4">
          FocusAI
        </p>
        <h1 className="text-5xl font-bold text-dark-text mb-6 leading-tight">
          Test Before You Publish
        </h1>
        <p className="text-dark-muted text-xl mb-10 leading-relaxed">
          Know if your content will hook, retain, and convert — before you hit publish.
          AI-powered analysis in under 60 seconds.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/sign-up" className="btn-primary text-lg px-8 py-3">
            Get Started Free
          </Link>
          <Link href="/pricing" className="btn-secondary text-lg px-8 py-3">
            See Pricing
          </Link>
        </div>
      </div>
    </main>
  );
}
