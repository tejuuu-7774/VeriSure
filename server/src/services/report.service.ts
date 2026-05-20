import prisma from "../config/prisma";

const maskVerificationLog = (log: any) => {
  if (log.verificationType === "AADHAAR") {
    return {
      ...log,
      requestPayload: {
        ...log.requestPayload,
        aadhaarNumber: `XXXXXXXX${String(
          log.requestPayload?.aadhaarNumber || ""
        ).slice(-4)}`,
      },
    };
  }

  if (log.verificationType === "PAN") {
    return {
      ...log,
      requestPayload: {
        ...log.requestPayload,
        panNumber: `${String(
          log.requestPayload?.panNumber || ""
        ).slice(0, 3)}XXXXX`,
      },
    };
  }

  return log;
};

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

    const timeline =
      candidate.verificationLogs.map(
        maskVerificationLog
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
          aadhaarLog
            ? maskVerificationLog(
                aadhaarLog
              )
            : null,
        pan: panLog
          ? maskVerificationLog(panLog)
          : null,
      },

      timeline,

      generatedAt:
        new Date(),
    };
  };
