"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type {
  Candidate,
  CandidateInput,
} from "@/types";

const candidateSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(
      /^[0-9]{10}$/,
      "Phone must be exactly 10 digits"
    ),
  aadhaarNumber: z
    .string()
    .regex(
      /^[0-9]{12}$/,
      "Aadhaar must be exactly 12 digits"
    ),
  panNumber: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      "PAN must match ABCDE1234F"
    ),
  dob: z.string().min(1, "DOB is required"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters"),
});

export function CandidateForm({
  candidate,
  onCancel,
  onSubmit,
  isSubmitting,
}: {
  candidate?: Candidate | null;
  onCancel: () => void;
  onSubmit: (data: CandidateInput) => Promise<void>;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateInput>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      aadhaarNumber: "",
      panNumber: "",
      dob: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!candidate) return;

    reset({
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      aadhaarNumber:
        candidate.aadhaarNumber.includes("X")
          ? ""
          : candidate.aadhaarNumber,
      panNumber: candidate.panNumber.includes("X")
        ? ""
        : candidate.panNumber,
      dob: candidate.dob?.slice(0, 10),
      address: candidate.address,
    });
  }, [candidate, reset]);

  const fields: Array<{
    name: keyof CandidateInput;
    label: string;
    placeholder: string;
    type?: string;
  }> = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Aarav Mehta",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "aarav@company.com",
      type: "email",
    },
    {
      name: "phone",
      label: "Phone",
      placeholder: "9876543210",
    },
    {
      name: "aadhaarNumber",
      label: "Aadhaar Number",
      placeholder: "123412341234",
    },
    {
      name: "panNumber",
      label: "PAN Number",
      placeholder: "ABCDE1234F",
    },
    {
      name: "dob",
      label: "Date of Birth",
      placeholder: "",
      type: "date",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              {field.label}
            </span>
            <input
              className="input"
              placeholder={field.placeholder}
              type={field.type || "text"}
              {...register(field.name)}
            />
            <p className="mt-1 min-h-4 text-xs text-red-600">
              {errors[field.name]?.message}
            </p>
          </label>
        ))}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Address
        </span>
        <textarea
          className="input min-h-24 resize-none"
          placeholder="Office verified residential address"
          {...register("address")}
        />
        <p className="mt-1 min-h-4 text-xs text-red-600">
          {errors.address?.message}
        </p>
      </label>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary px-4 py-2.5"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          className="btn-primary px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSubmitting
            ? "Saving..."
            : candidate
            ? "Update Candidate"
            : "Create Candidate"}
        </button>
      </div>
    </form>
  );
}
