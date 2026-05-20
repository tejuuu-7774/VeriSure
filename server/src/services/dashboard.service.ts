import prisma from "../config/prisma";

export const getDashboardStats =
  async (userId: string) => {
    const [
      totalCandidates,
      verified,
      pending,
      failed,
      partial,
    ] = await Promise.all([
      prisma.candidate.count({
        where: {
          createdById: userId,
        },
      }),

      prisma.candidate.count({
        where: {
          createdById: userId,
          verificationStatus:
            "VERIFIED",
        },
      }),

      prisma.candidate.count({
        where: {
          createdById: userId,
          verificationStatus:
            "PENDING",
        },
      }),

      prisma.candidate.count({
        where: {
          createdById: userId,
          verificationStatus:
            "FAILED",
        },
      }),

      prisma.candidate.count({
        where: {
          createdById: userId,
          verificationStatus:
            "PARTIAL",
        },
      }),
    ]);

    return {
      totalCandidates,
      verified,
      pending,
      failed,
      partial,
    };
  };