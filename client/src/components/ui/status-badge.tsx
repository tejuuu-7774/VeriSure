import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/types";

const styles: Record<VerificationStatus, string> = {
  VERIFIED:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700",
  FAILED:
    "border-red-200 bg-red-50 text-red-700",
  PARTIAL:
    "border-indigo-200 bg-indigo-50 text-indigo-700",
};

export function StatusBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        "rounded-md",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}
