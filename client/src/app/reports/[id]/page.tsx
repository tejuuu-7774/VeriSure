"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProtectedShell } from "@/components/layout/protected-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/errors";
import {
  downloadReportPDF,
  getReport,
} from "@/services/candidate.service";
import type { Report } from "@/types";
import type { VerificationLog } from "@/types";
import { formatDateTime } from "@/lib/utils";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        setReport(await getReport(params.id));
      } catch (error: unknown) {
        toast.error(
          getErrorMessage(
            error,
            "Failed to load report"
          )
        );
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [params.id]);

  return (
    <ProtectedShell>
      <div className="mb-6">
        <Link
          href={
            report
              ? `/candidates/${report.candidate.id}`
              : "/candidates"
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-[620px]" />
      ) : report ? (
        <>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Verification report
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {report.candidate.fullName}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Report ID {report.reportId}
              </p>
            </div>
            <button
              onClick={() =>
                downloadReportPDF(
                  report.candidate.id
                ).catch(() =>
                  toast.error(
                    "Report download failed"
                  )
                )
              }
              className="btn-primary px-4 py-2.5"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>

          <div className="mx-auto max-w-4xl border border-slate-200 bg-white p-6 shadow-2xl md:p-10 rounded-lg">
            <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center bg-slate-950 text-white rounded-md">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      VeriSure
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-950">
                      Background Verification Report
                    </h2>
                  </div>
                </div>
              </div>
              <StatusBadge
                status={
                  report.verificationSummary
                    .overallStatus
                }
              />
            </div>

            <section className="grid gap-5 py-8 md:grid-cols-2">
              {[
                ["Candidate", report.candidate.fullName],
                ["Email", report.candidate.email],
                ["Phone", report.candidate.phone],
                [
                  "Aadhaar",
                  report.candidate.aadhaarNumber,
                ],
                ["PAN", report.candidate.panNumber],
                [
                  "Generated",
                  formatDateTime(report.generatedAt),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border border-slate-100 bg-slate-50 p-4 rounded-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h3 className="text-lg font-semibold text-slate-950">
                Verification Checks
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(
                  [
                    [
                      "Aadhaar",
                      report.checks.aadhaar,
                    ],
                    ["PAN", report.checks.pan],
                  ] as Array<
                    [string, VerificationLog | null]
                  >
                ).map(([label, log]) => (
                  <div
                    key={String(label)}
                    className="border border-slate-200 p-5 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-cyan-700" />
                        <p className="font-semibold text-slate-950">
                          {String(label)}
                        </p>
                      </div>
                      {log ? (
                        <StatusBadge
                          status={
                            log.verificationStatus
                          }
                        />
                      ) : (
                        <StatusBadge status="PENDING" />
                      )}
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                      {log
                        ? formatDateTime(log.verifiedAt)
                        : "No check completed yet"}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8 border-t border-slate-200 pt-8">
              <h3 className="text-lg font-semibold text-slate-950">
                Timeline
              </h3>
              <div className="mt-4 space-y-4">
                {report.timeline.length ? (
                  report.timeline.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between border-l-2 border-cyan-700 bg-slate-50 p-4 pl-5 rounded-md"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {log.verificationType}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatDateTime(
                            log.verifiedAt
                          )}
                        </p>
                      </div>
                      <StatusBadge
                        status={log.verificationStatus}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No verification logs available.
                  </p>
                )}
              </div>
            </section>

            <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
              System generated by VeriSure. Digital
              signature placeholder.
            </div>
          </div>
        </>
      ) : null}
    </ProtectedShell>
  );
}
