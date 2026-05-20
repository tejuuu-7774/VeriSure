"use client";

import {
  ArrowRight,
  BarChart3,
  Database,
  Download,
  FileText,
  SearchCheck,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { ProtectedShell } from "@/components/layout/protected-shell";

const flow = [
  {
    title: "Create Candidate",
    description:
      "Add candidate identity details including Aadhaar, PAN, contact information, date of birth, and address.",
    icon: UserPlus,
  },
  {
    title: "Run Verification",
    description:
      "Initiate Aadhaar and PAN verification checks and securely store responses as audit logs.",
    icon: SearchCheck,
  },
  {
    title: "Review Status",
    description:
      "Track verification progress across dashboard metrics and detailed candidate records.",
    icon: BarChart3,
  },
  {
    title: "Export Report",
    description:
      "Preview and download a professional verification report for compliance and review.",
    icon: FileText,
  },
];

const features = [
  {
    title: "Seed Demo Data",
    description:
      "Generate realistic candidate records for quick evaluation and workflow preview.",
    icon: Database,
  },
  {
    title: "Verification Engine",
    description:
      "Execute Aadhaar and PAN verification workflows with automated status updates.",
    icon: ShieldCheck,
  },
  {
    title: "Professional Reports",
    description:
      "Download polished PDF reports for audits, review, and evaluator submission.",
    icon: Download,
  },
];

export default function AboutPage() {
  return (
    <ProtectedShell>
      {/* HERO */}
      <section className="card p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Platform Overview
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            How VeriSure Works
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            VeriSure is an enterprise background
            verification workspace designed for
            securely managing candidate identity
            checks, verification logs, reports,
            and operational workflows in one place.
          </p>
        </div>
      </section>

      {/* FLOW */}
      <section className="mt-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Verification Workflow
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              End-to-end candidate verification flow.
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {flow.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="card relative p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-900">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Step {index + 1}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>

                {index <
                flow.length - 1 ? (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-300 xl:block" />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-950">
            Platform Capabilities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Core functionality available
            across the VeriSure workspace.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="card p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-cyan-700">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER INFO */}
      <section className="mt-6 card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Built for secure verification
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              VeriSure combines candidate
              management, verification workflows,
              audit logs, and PDF reporting into
              a single enterprise-ready platform.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-cyan-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </section>
    </ProtectedShell>
  );
}