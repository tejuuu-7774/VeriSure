"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Plus,
  RotateCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/errors";
import {
  createCandidate,
  deleteCandidate,
  getCandidates,
  getDashboardStats,
  startVerification,
} from "@/services/candidate.service";
import type {
  Candidate,
  CandidateInput,
  DashboardStats,
} from "@/types";
import { formatDateTime } from "@/lib/utils";

const demoCandidates: CandidateInput[] = [
  {
    fullName: "Aarav Mehta",
    email: "aarav.mehta@northstar.co",
    phone: "9876543210",
    aadhaarNumber: "123412341234",
    panNumber: "ABCDE1234F",
    dob: "1996-04-12",
    address: "Indiranagar, Bengaluru",
  },
  {
    fullName: "Isha Nair",
    email: "isha.nair@northstar.co",
    phone: "9876501234",
    aadhaarNumber: "111122223333",
    panNumber: "BNZAA2318J",
    dob: "1998-09-25",
    address: "Kakkanad, Kochi",
  },
  {
    fullName: "Kabir Rao",
    email: "kabir.rao@northstar.co",
    phone: "9123456780",
    aadhaarNumber: "444455556666",
    panNumber: "CDEFG4567H",
    dob: "1994-01-19",
    address: "Hitech City, Hyderabad",
  },
  {
    fullName: "Mira Kapoor",
    email: "mira.kapoor@northstar.co",
    phone: "9988776655",
    aadhaarNumber: "777788889999",
    panNumber: "PQRSX9876K",
    dob: "1997-11-07",
    address: "Bandra West, Mumbai",
  },
  {
    fullName: "Rohan Sen",
    email: "rohan.sen@northstar.co",
    phone: "9090909090",
    aadhaarNumber: "222233334444",
    panNumber: "LMNOP3456Q",
    dob: "1995-06-30",
    address: "Salt Lake, Kolkata",
  },
];

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [seeding, setSeeding] =
    useState(false);

  const [resetting, setResetting] =
    useState(false);

  const [
    showResetModal,
    setShowResetModal,
  ] = useState(false);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [
        nextStats,
        nextCandidates,
      ] = await Promise.all([
        getDashboardStats(),
        getCandidates(),
      ]);

      setStats(nextStats);
      setCandidates(nextCandidates);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to load dashboard"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function generateDemoData() {
    setSeeding(true);

    try {
      const created = [];

      for (const candidate of demoCandidates) {
        const result =
          await createCandidate(candidate);

        created.push(result.candidate);
      }

      await Promise.all(
        created
          .slice(0, 3)
          .map((candidate) =>
            startVerification(candidate.id)
          )
      );

      toast.success(
        "Demo data generated"
      );

      await loadDashboard();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Could not generate demo data"
        )
      );
    } finally {
      setSeeding(false);
    }
  }

  async function resetDemoData() {
    setResetting(true);

    try {
      await Promise.all(
        candidates.map((candidate) =>
          deleteCandidate(candidate.id)
        )
      );

      toast.success(
        "Workspace reset successfully"
      );

      await loadDashboard();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Could not reset data"
        )
      );
    } finally {
      setResetting(false);
      setShowResetModal(false);
    }
  }

  const recent = useMemo(
    () => candidates.slice(0, 5),
    [candidates]
  );

  const cards = [
    {
      label: "Total Candidates",
      value:
        stats?.totalCandidates ?? 0,
      icon: Users,
      tone:
        "text-slate-700 bg-slate-100",
    },
    {
      label: "Verified",
      value: stats?.verified ?? 0,
      icon: CheckCircle2,
      tone:
        "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock3,
      tone:
        "text-amber-700 bg-amber-50",
    },
    {
      label: "Failed",
      value: stats?.failed ?? 0,
      icon: AlertTriangle,
      tone:
        "text-red-700 bg-red-50",
    },
    {
      label: "Partial",
      value: stats?.partial ?? 0,
      icon: Activity,
      tone:
        "text-indigo-700 bg-indigo-50",
    },
  ];

  return (
    <ProtectedShell>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Command Center
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Verification Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor verification
            activity and candidate
            workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={
              generateDemoData
            }
            disabled={seeding}
            className="btn-secondary h-11 px-4 disabled:opacity-60"
          >
            <Database className="h-4 w-4" />

            {seeding
              ? "Generating..."
              : "Seed Data"}
          </button>

          <button
            onClick={() =>
              setShowResetModal(true)
            }
            disabled={
              resetting ||
              !candidates.length
            }
            className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            title="Reset workspace"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <Link
            href="/candidates"
            className="btn-primary h-11 px-4"
          >
            <Plus className="h-4 w-4" />
            New Candidate
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="card p-5"
            >
              {loading ? (
                <Skeleton className="h-24" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-md ${card.tone}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-semibold text-slate-950">
                    {card.value}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Recent Activity
              </h2>

              <p className="text-sm text-slate-500">
                Latest verification
                records.
              </p>
            </div>

            <ShieldCheck className="h-5 w-5 text-cyan-700" />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(
                (item) => (
                  <Skeleton
                    key={item}
                    className="h-16"
                  />
                )
              )}
            </div>
          ) : recent.length ? (
            <div className="divide-y divide-slate-100">
              {recent.map(
                (candidate) => (
                  <Link
                    key={
                      candidate.id
                    }
                    href={`/candidates/${candidate.id}`}
                    className="flex items-center justify-between py-4 transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {
                          candidate.fullName
                        }
                      </p>

                      <p className="text-sm text-slate-500">
                        {
                          candidate.email
                        }
                      </p>
                    </div>

                    <div className="text-right">
                      <StatusBadge
                        status={
                          candidate.verificationStatus
                        }
                      />

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDateTime(
                          candidate.createdAt
                        )}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No candidates yet"
              description="Create a candidate or seed demo data."
            />
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-950">
            System Status
          </h2>

          <div className="mt-5 space-y-4">
            {[
              "Authentication active",
              "Verification logs enabled",
              "PDF reports connected",
              "Sensitive data masked",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 p-3"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                <span className="text-sm font-medium text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showResetModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-red-50 text-red-600">
                <RotateCcw className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Reset workspace?
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  This removes all
                  candidates and
                  verification activity.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setShowResetModal(
                    false
                  )
                }
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={
                  resetDemoData
                }
                disabled={
                  resetting
                }
                className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {resetting
                  ? "Resetting..."
                  : "Reset"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ProtectedShell>
  );
}