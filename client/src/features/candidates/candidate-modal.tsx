"use client";

import { CandidateForm } from "@/features/candidates/candidate-form";
import type {
  Candidate,
  CandidateInput,
} from "@/types";

export function CandidateModal({
  open,
  candidate,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  open: boolean;
  candidate?: Candidate | null;
  onClose: () => void;
  onSubmit: (data: CandidateInput) => Promise<void>;
  isSubmitting?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-white p-6 shadow-2xl rounded-lg">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Candidate record
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {candidate
              ? "Edit candidate"
              : "Create candidate"}
          </h2>
        </div>
        <CandidateForm
          candidate={candidate}
          onCancel={onClose}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
