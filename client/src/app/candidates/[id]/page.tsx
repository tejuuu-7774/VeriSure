"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/errors";
import {
  downloadReportPDF,
  getCandidate,
  startAadhaarVerification,
  startPanVerification,
  startVerification,
} from "@/services/candidate.service";
import type { Candidate } from "@/types";
import {
  formatDate,
  formatDateTime,
} from "@/lib/utils";

export default function CandidateDetailsPage() {
  const params = useParams<{ id: string }>();

  const [candidate, setCandidate] =
    useState<Candidate | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    verifyingAction,
    setVerifyingAction,
  ] = useState<
    "AADHAAR" | "PAN" | "FULL" | null
  >(null);

  const loadCandidate =
    useCallback(async () => {
      setLoading(true);

      try {
        setCandidate(
          await getCandidate(params.id)
        );
      } catch (error: unknown) {
        toast.error(
          getErrorMessage(
            error,
            "Failed to load candidate"
          )
        );
      } finally {
        setLoading(false);
      }
    }, [params.id]);

  useEffect(() => {
    loadCandidate();
  }, [loadCandidate]);

  async function verify(
    type: "AADHAAR" | "PAN" | "FULL"
  ) {
    setVerifyingAction(type);

    try {
      const response =
        type === "AADHAAR"
          ? await startAadhaarVerification(
              params.id
            )
          : type === "PAN"
          ? await startPanVerification(
              params.id
            )
          : await startVerification(params.id);

      toast.success(
        `${response.message}. Overall status: ${response.data.overallStatus}`
      );

      await loadCandidate();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Verification failed"
        )
      );
    } finally {
      setVerifyingAction(null);
    }
  }

  const logs = useMemo(
    () =>
      candidate?.verificationLogs ||
      [],
    [candidate?.verificationLogs]
  );

  const aadhaar = useMemo(
    () =>
      logs.find(
        (log) =>
          log.verificationType ===
          "AADHAAR"
      ),
    [logs]
  );

  const pan = useMemo(
    () =>
      logs.find(
        (log) =>
          log.verificationType ===
          "PAN"
      ),
    [logs]
  );

  const profileItems = [
    {
      icon: User,
      label: "Full Name",
      value:
        candidate?.fullName || "-",
    },
    {
      icon: Mail,
      label: "Email Address",
      value:
        candidate?.email || "-",
    },
    {
      icon: Phone,
      label: "Phone Number",
      value:
        candidate?.phone || "-",
    },
    {
      icon: Calendar,
      label: "Date of Birth",
      value: candidate
        ? formatDate(
            candidate.dob
          )
        : "-",
    },
    {
      icon: MapPin,
      label: "Address",
      value:
        candidate?.address || "-",
    },
  ];

  return (
    <ProtectedShell>
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/candidates"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to candidates
        </Link>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-44" />
          <Skeleton className="h-80" />
        </div>
      ) : candidate ? (
        <div className="space-y-6">
          {/* HEADER */}
          <section className="card p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Candidate Profile
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  {candidate.fullName}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>
                    Created on{" "}
                    {formatDate(
                      candidate.createdAt
                    )}
                  </span>

                  <StatusBadge
                    status={
                      candidate.verificationStatus
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/reports/${candidate.id}`}
                  className="btn-secondary h-11 px-4"
                >
                  <FileText className="h-4 w-4" />
                  Report
                </Link>

                <button
                  onClick={() =>
                    downloadReportPDF(
                      candidate.id
                    ).catch(() =>
                      toast.error(
                        "Download failed"
                      )
                    )
                  }
                  className="btn-secondary h-11 px-4"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </button>

                <button
                  onClick={() =>
                    verify("FULL")
                  }
                  disabled={
                    verifyingAction !==
                    null
                  }
                  className="btn-primary h-11 px-4 disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" />

                  {verifyingAction === "FULL"
                    ? "Verifying..."
                    : "Full Verification"}
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            {/* PROFILE */}
            <section className="card p-7">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950">
                  Personal Information
                </h2>

                <ShieldCheck className="h-5 w-5 text-cyan-700" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {profileItems.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <div
                        key={
                          item.label
                        }
                        className="border border-slate-100 bg-slate-50 px-4 py-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-slate-500">
                            <Icon className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              {
                                item.label
                              }
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                              {
                                item.value
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            {/* VERIFICATION */}
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title:
                      "Aadhaar Verification",
                    value:
                      candidate.aadhaarNumber,
                    log: aadhaar,
                  },
                  {
                    title:
                      "PAN Verification",
                    value:
                      candidate.panNumber,
                    log: pan,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="card p-5"
                  >
                    <div className="flex items-center justify-between">
                      <ShieldCheck className="h-5 w-5 text-cyan-700" />

                      <StatusBadge
                        status={
                          item.log
                            ?.verificationStatus ||
                          "PENDING"
                        }
                      />
                    </div>

                    <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {item.title}
                    </h3>

                    <p className="mt-2 font-mono text-sm text-slate-800">
                      {item.value}
                    </p>

                    <p className="mt-5 text-xs text-slate-400">
                      {item.log
                        ? formatDateTime(
                            item.log
                              .verifiedAt
                          )
                        : "Awaiting verification"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="card p-5">
                <h2 className="text-base font-semibold text-slate-950">
                  Run individual checks
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Use these controls to test the separate
                  backend verification endpoints.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={() =>
                      verify("AADHAAR")
                    }
                    disabled={
                      verifyingAction !==
                      null
                    }
                    className="btn-secondary h-11 px-4 disabled:opacity-60"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {verifyingAction ===
                    "AADHAAR"
                      ? "Checking..."
                      : "Verify Aadhaar"}
                  </button>
                  <button
                    onClick={() =>
                      verify("PAN")
                    }
                    disabled={
                      verifyingAction !==
                      null
                    }
                    className="btn-secondary h-11 px-4 disabled:opacity-60"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {verifyingAction === "PAN"
                      ? "Checking..."
                      : "Verify PAN"}
                  </button>
                  <button
                    onClick={() =>
                      verify("FULL")
                    }
                    disabled={
                      verifyingAction !==
                      null
                    }
                    className="btn-primary h-11 px-4 disabled:opacity-60"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {verifyingAction === "FULL"
                      ? "Running..."
                      : "Full Verification"}
                  </button>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="card p-7">
                <h2 className="text-lg font-semibold text-slate-950">
                  Verification Timeline
                </h2>

                <div className="mt-6 space-y-5">
                  {logs.length ? (
                    logs.map(
                      (log) => (
                        <div
                          key={
                            log.id
                          }
                          className="flex items-start justify-between border-l border-slate-300 pl-4"
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {
                                log.verificationType
                              }
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {formatDateTime(
                                log.verifiedAt
                              )}
                            </p>
                          </div>

                          <StatusBadge
                            status={
                              log.verificationStatus
                            }
                          />
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-slate-500">
                      No verification
                      activity yet.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </ProtectedShell>
  );
}
