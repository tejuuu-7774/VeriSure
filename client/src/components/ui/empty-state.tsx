import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm rounded-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 rounded-lg">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-slate-950">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
