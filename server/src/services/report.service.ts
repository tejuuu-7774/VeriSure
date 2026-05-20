import prisma from "../config/prisma";

export const generateReport =
  async (
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
      throw new Error(
        "Candidate not found"
      );
    }

    const aadhaarLog =
      candidate.verificationLogs.find(
        (log) =>
          log.verificationType ===
          "AADHAAR"
      );

    const panLog =
      candidate.verificationLogs.find(
        (log) =>
          log.verificationType ===
          "PAN"
      );

    return {
      reportId: `REP-${Date.now()}`,

      candidate: {
        id: candidate.id,
        fullName:
          candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        dob: candidate.dob,
        address:
          candidate.address,

        aadhaarNumber: `XXXXXXXX${candidate.aadhaarNumber.slice(
          -4
        )}`,

        panNumber: `${candidate.panNumber.slice(
          0,
          3
        )}XXXXX`,
      },

      verificationSummary: {
        overallStatus:
          candidate.verificationStatus,

        verifiedAt:
          candidate.createdAt,
      },

      checks: {
        aadhaar:
          aadhaarLog || null,
        pan: panLog || null,
      },

      timeline:
        candidate.verificationLogs,

      generatedAt:
        new Date(),
    };
  };