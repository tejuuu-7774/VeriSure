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

export const getCandidates = async (
  userId: string
) => {
  const candidates =
    await prisma.candidate.findMany({
      where: {
        createdById: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return candidates;
};

// To access one particular ID of the candidate this is used
export const getCandidateById = async (
  candidateId: string,
  userId: string
) => {
  const candidate =
    await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        createdById: userId,
      },
    });

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  return candidate;
};