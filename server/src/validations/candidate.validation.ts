import { z } from "zod";

export const createCandidateSchema =
  z.object({
    fullName: z
      .string()
      .min(
        3,
        "Full name must be at least 3 characters"
      ),

    email: z
      .string()
      .email(
        "Invalid email address"
      ),

    phone: z
      .string()
      .regex(
        /^[0-9]{10}$/,
        "Phone number must be exactly 10 digits"
      ),

    aadhaarNumber: z
      .string()
      .regex(
        /^\d{12}$/,
        "Aadhaar must be 12 digits"
      ),

    panNumber: z
      .string()
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Invalid PAN format"
      ),

    dob: z
      .string()
      .date(
        "DOB must be valid date"
      ),

    address: z
      .string()
      .min(
        5,
        "Address is too short"
      ),
  });

export const updateCandidateSchema =
  createCandidateSchema.partial();