import prisma from "../config/prisma";

type CreateCandidateInput = {
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  dob: string;
  address: string;
  createdById: string;
};

export const createCandidate = async ({
  fullName,
  email,
  phone,
  aadhaarNumber,
  panNumber,
  dob,
  address,
  createdById,
}: CreateCandidateInput) => {
  const candidate = await prisma.candidate.create({
    data: {
      fullName,
      email,
      phone,
      aadhaarNumber,
      panNumber,
      dob: new Date(dob),
      address,
      createdById,
    },
  });

  return candidate;
};