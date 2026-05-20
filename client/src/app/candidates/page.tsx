"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import {
  Download,
  Edit3,
  Eye,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { CandidateModal } from "@/features/candidates/candidate-modal";
import { getErrorMessage } from "@/lib/errors";
import {
  createCandidate,
  deleteCandidate,
  downloadReportPDF,
  getCandidates,
  startVerification,
  updateCandidate,
} from "@/services/candidate.service";
import type {
  Candidate,
  CandidateInput,
  VerificationStatus,
} from "@/types";
import { formatDate } from "@/lib/utils";

const statuses: Array<"ALL" | VerificationStatus> = [
  "ALL",
  "VERIFIED",
  "PENDING",
  "FAILED",
  "PARTIAL",
];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<
    Candidate[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] =
    useState<(typeof statuses)[number]>("ALL");
  const [sortKey, setSortKey] =
    useState<keyof Candidate>("createdAt");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] =
    useState<Candidate | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] =
    useState<Candidate | null>(null);

  async function loadCandidates() {
    setLoading(true);
    try {
      setCandidates(await getCandidates());
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to load candidates"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return candidates
      .filter((candidate) => {
        const matchesStatus =
          status === "ALL" ||
          candidate.verificationStatus === status;
        const matchesQuery = [
          candidate.fullName,
          candidate.email,
          candidate.phone,
          candidate.panNumber,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => {
        if (sortKey === "createdAt") {
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        }

        return String(a[sortKey]).localeCompare(
          String(b[sortKey])
        );
      });
  }, [candidates, query, sortKey, status]);

  const pageSize = 8;
  const totalPages =
    Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  async function submitCandidate(data: CandidateInput) {
    setSaving(true);
    try {
      if (editing) {
        const payload: Partial<CandidateInput> = {
          ...data,
        };
        if (!payload.aadhaarNumber) {
          delete payload.aadhaarNumber;
        }
        if (!payload.panNumber) {
          delete payload.panNumber;
        }
        await updateCandidate(editing.id, payload);
        toast.success("Candidate updated");
      } else {
        await createCandidate(data);
        toast.success("Candidate created");
      }
      setModalOpen(false);
      setEditing(null);
      await loadCandidates();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Could not save candidate"
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function runVerification(id: string) {
    setBusyId(id);
    try {
      await startVerification(id);
      toast.success("Verification completed");
      await loadCandidates();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Verification failed"
        )
      );
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await deleteCandidate(deleteTarget.id);
      toast.success("Candidate deleted");
      setDeleteTarget(null);
      await loadCandidates();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Delete failed")
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ProtectedShell>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Candidate operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Candidates
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Search, verify, manage, and export background
            verification records.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="btn-primary px-4 py-2.5"
        >
          <Plus className="h-4 w-4" />
          Add Candidate
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-12"
              placeholder="Search candidates..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setStatus(item);
                  setPage(1);
                }}
                className={`border px-3 py-2 text-sm font-semibold transition rounded-md ${
                  status === item
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <select
            className="input max-w-52 text-sm font-semibold text-slate-600"
            value={sortKey}
            onChange={(event) =>
              setSortKey(
                event.target.value as keyof Candidate
              )
            }
          >
            <option value="createdAt">Newest first</option>
            <option value="fullName">Name</option>
            <option value="verificationStatus">
              Status
            </option>
            <option value="email">Email</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-16" />
            ))}
          </div>
        ) : paged.length ? (
          <>
            <div className="divide-y divide-slate-100 bg-white">
              {paged.map((candidate) => (
                <article
                  key={candidate.id}
                  className="grid gap-5 p-5 transition hover:bg-slate-50 xl:grid-cols-[1.25fr_1fr_0.8fr_1.25fr]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-base font-semibold text-slate-950">
                        {candidate.fullName}
                      </h2>
                      <StatusBadge
                        status={
                          candidate.verificationStatus
                        }
                      />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {candidate.email}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {candidate.phone}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                    <div className="border border-slate-100 bg-slate-50 p-3 rounded-md">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Aadhaar
                      </p>
                      <p className="mt-2 font-mono text-sm text-slate-700">
                        {candidate.aadhaarNumber}
                      </p>
                    </div>
                    <div className="border border-slate-100 bg-slate-50 p-3 rounded-md">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        PAN
                      </p>
                      <p className="mt-2 font-mono text-sm text-slate-700">
                        {candidate.panNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Created
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      {formatDate(candidate.createdAt)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:justify-self-end">
                    <Link
                      href={`/candidates/${candidate.id}`}
                      className="btn-secondary px-3 py-2 text-sm"
                      title="View candidate"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sm:hidden">View</span>
                    </Link>
                    <button
                      onClick={() =>
                        runVerification(candidate.id)
                      }
                      disabled={busyId === candidate.id}
                      className="btn-secondary px-3 py-2 text-sm"
                      title="Start verification"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span className="sm:hidden">Verify</span>
                    </button>
                    <button
                      onClick={() =>
                        downloadReportPDF(
                          candidate.id
                        ).catch(() =>
                          toast.error(
                            "Report download failed"
                          )
                        )
                      }
                      className="btn-secondary px-3 py-2 text-sm"
                      title="Download report"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sm:hidden">PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditing(candidate);
                        setModalOpen(true);
                      }}
                      className="btn-secondary px-3 py-2 text-sm"
                      title="Edit candidate"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span className="sm:hidden">Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget(candidate)
                      }
                      className="btn-secondary px-3 py-2 text-sm text-red-600"
                      title="Delete candidate"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sm:hidden">Delete</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  className="btn-secondary px-3 py-2"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                >
                  Previous
                </button>
                <button
                  className="btn-secondary px-3 py-2"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(
                        totalPages,
                        value + 1
                      )
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="No matching candidates"
              description="Adjust filters or create a candidate record to start verification."
              action={
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-primary px-4 py-2.5"
                >
                  <Plus className="h-4 w-4" />
                  Create Candidate
                </button>
              }
            />
          </div>
        )}
      </div>

      <CandidateModal
        open={modalOpen}
        candidate={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={submitCandidate}
        isSubmitting={saving}
      />

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl rounded-lg">
            <div className="flex h-11 w-11 items-center justify-center bg-red-50 text-red-600 rounded-md">
              <Trash2 className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-950">
              Delete candidate?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will remove{" "}
              <strong>
                {deleteTarget.fullName}
              </strong>{" "}
              and associated verification logs.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="btn-secondary px-4 py-2.5"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 rounded-md"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ProtectedShell>
  );
}
