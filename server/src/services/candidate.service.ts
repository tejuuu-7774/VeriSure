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

type UpdateCandidateInput = {
  fullName?: string;
  email?: string;
  phone?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  dob?: string;
  address?: string;
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

  return candidates.map(
    (candidate) => ({
      ...candidate,

      aadhaarNumber: `XXXXXXXX${candidate.aadhaarNumber.slice(
        -4
      )}`,

      panNumber: `${candidate.panNumber.slice(
        0,
        3
      )}XXXXX`,
    })
  );
};

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
      include: {
        verificationLogs: {
          orderBy: {
            verifiedAt: "desc",
          },
        },
      },
    });

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  return {
    ...candidate,

    aadhaarNumber: `XXXXXXXX${candidate.aadhaarNumber.slice(
      -4
    )}`,

    panNumber: `${candidate.panNumber.slice(
      0,
      3
    )}XXXXX`,
  };
};

export const updateCandidate = async (
  candidateId: string,
  userId: string,
  data: UpdateCandidateInput
) => {
  const existingCandidate =
    await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        createdById: userId,
      },
    });

  if (!existingCandidate) {
    throw new Error("Candidate not found");
  }

  return prisma.candidate.update({
    where: {
      id: candidateId,
    },
    data: {
      ...data,
      dob: data.dob
        ? new Date(data.dob)
        : undefined,
    },
  });
};

export const deleteCandidate = async (
  candidateId: string,
  userId: string
) => {
  const existingCandidate =
    await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        createdById: userId,
      },
    });

  if (!existingCandidate) {
    throw new Error("Candidate not found");
  }

  // delete logs first
  await prisma.verificationLog.deleteMany({
    where: {
      candidateId,
    },
  });

  // delete candidate
  await prisma.candidate.delete({
    where: {
      id: candidateId,
    },
  });

  return true;
};