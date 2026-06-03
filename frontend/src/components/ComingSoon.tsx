import type { LucideProps } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  milestone?: string;
}

export default function ComingSoon({ title, description, icon: Icon, milestone }: Props) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 mb-6">
          <Icon size={28} className="text-brand-primary" />
        </div>

        {/* Title & description */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-3">{title}</h1>
        <p className="text-gray-500 dark:text-dark-muted leading-relaxed">{description}</p>

        {/* Coming soon badge */}
        <div className="inline-flex items-center gap-2 mt-8 px-4 py-2 bg-brand-primary/10 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-brand-primary text-sm font-medium">Coming soon</span>
        </div>

        {milestone && (
          <p className="text-xs text-gray-400 dark:text-dark-muted/60 mt-3">{milestone}</p>
        )}
      </div>
    </div>
  );
}
