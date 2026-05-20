import {
  VerificationStatus,
  VerificationType,
} from "@prisma/client";
import prisma from "../config/prisma";

type AadhaarVerificationResponse = {
  status: "VERIFIED" | "FAILED";
  nameMatch: boolean;
  dobMatch: boolean;
  message: string;
};

type PanVerificationResponse = {
  status: "VERIFIED" | "FAILED";
  panStatus: "active" | "inactive";
  message: string;
};

const logOwnershipDebug = (
  candidateId: string,
  userId: string,
  candidate: { createdById: string } | null
) => {
  console.log("candidateId:", candidateId);
  console.log("userId from token:", userId);
  console.log("candidate from DB:", candidate);
  console.log(
    "candidate.createdById:",
    candidate?.createdById
  );
  console.log(
    "ownership match:",
    candidate?.createdById === userId
  );
};

const getOwnedCandidate = async (
  candidateId: string,
  userId: string
) => {
  const candidate =
    await prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
    });

  logOwnershipDebug(
    candidateId,
    userId,
    candidate
  );

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  if (candidate.createdById !== userId) {
    throw new Error(
      "Candidate belongs to another user"
    );
  }

  return candidate;
};

const verifyAadhaar = async (
  aadhaarNumber: string
): Promise<AadhaarVerificationResponse> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 500)
  );

  const isValid =
    /^\d{12}$/.test(aadhaarNumber);

  return {
    status: isValid
      ? "VERIFIED"
      : "FAILED",
    nameMatch: isValid,
    dobMatch: isValid,
    message: isValid
      ? "Aadhaar verified successfully"
      : "Invalid Aadhaar number",
  };
};

const verifyPAN = async (
  panNumber: string
): Promise<PanVerificationResponse> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 500)
  );

  const isValid =
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
      panNumber
    );

  return {
    status: isValid
      ? "VERIFIED"
      : "FAILED",
    panStatus: isValid ? "active" : "inactive",
    message: isValid
      ? "PAN verified successfully"
      : "Invalid PAN number",
  };
};

const upsertVerificationLog = async ({
  candidateId,
  verificationType,
  requestPayload,
  responsePayload,
  verificationStatus,
}: {
  candidateId: string;
  verificationType: VerificationType;
  requestPayload: Record<string, string>;
  responsePayload:
    | AadhaarVerificationResponse
    | PanVerificationResponse;
  verificationStatus: VerificationStatus;
}) => {
  const existingLog =
    await prisma.verificationLog.findFirst({
      where: {
        candidateId,
        verificationType,
      },
    });

  if (existingLog) {
    return prisma.verificationLog.update({
      where: {
        id: existingLog.id,
      },
      data: {
        requestPayload,
        responsePayload,
        verificationStatus,
        verifiedAt: new Date(),
      },
    });
  }

  return prisma.verificationLog.create({
    data: {
      candidateId,
      verificationType,
      requestPayload,
      responsePayload,
      verificationStatus,
    },
  });
};

const recalculateOverallStatus = async (
  candidateId: string
) => {
  const logs =
    await prisma.verificationLog.findMany({
      where: {
        candidateId,
      },
    });

  const aadhaarLog = logs.find(
    (log) =>
      log.verificationType ===
      "AADHAAR"
  );
  const panLog = logs.find(
    (log) =>
      log.verificationType ===
      "PAN"
  );

  let overallStatus: VerificationStatus =
    "PENDING";

  if (aadhaarLog && panLog) {
    const aadhaarVerified =
      aadhaarLog.verificationStatus ===
      "VERIFIED";
    const panVerified =
      panLog.verificationStatus ===
      "VERIFIED";

    if (aadhaarVerified && panVerified) {
      overallStatus =
        "VERIFIED";
    } else if (
      !aadhaarVerified &&
      !panVerified
    ) {
      overallStatus =
        "FAILED";
    } else {
      overallStatus =
        "PARTIAL";
    }
  } else if (aadhaarLog || panLog) {
    const onlyLog = aadhaarLog || panLog;
    overallStatus =
      onlyLog?.verificationStatus ===
      "VERIFIED"
        ? "PARTIAL"
        : "FAILED";
  }

  await prisma.candidate.update({
    where: {
      id: candidateId,
    },
    data: {
      verificationStatus: overallStatus,
    },
  });

  return overallStatus;
};

export const startAadhaarVerification =
  async (
    candidateId: string,
    userId: string
  ) => {
    const candidate =
      await getOwnedCandidate(
        candidateId,
        userId
      );

    const aadhaarVerification =
      await verifyAadhaar(
        candidate.aadhaarNumber
      );

    const log =
      await upsertVerificationLog({
        candidateId,
        verificationType:
          "AADHAAR",
        requestPayload: {
          aadhaarNumber:
            candidate.aadhaarNumber,
        },
        responsePayload:
          aadhaarVerification,
        verificationStatus:
          aadhaarVerification.status,
      });

    const overallStatus =
      await recalculateOverallStatus(
        candidateId
      );

    return {
      candidateId,
      verificationType:
        "AADHAAR",
      aadhaarVerification,
      log,
      overallStatus,
      verifiedAt: log.verifiedAt,
    };
  };

export const startPanVerification =
  async (
    candidateId: string,
    userId: string
  ) => {
    const candidate =
      await getOwnedCandidate(
        candidateId,
        userId
      );

    const panVerification =
      await verifyPAN(candidate.panNumber);

    const log =
      await upsertVerificationLog({
        candidateId,
        verificationType:
          "PAN",
        requestPayload: {
          panNumber: candidate.panNumber,
        },
        responsePayload:
          panVerification,
        verificationStatus:
          panVerification.status,
      });

    const overallStatus =
      await recalculateOverallStatus(
        candidateId
      );

    return {
      candidateId,
      verificationType: "PAN",
      panVerification,
      log,
      overallStatus,
      verifiedAt: log.verifiedAt,
    };
  };

export const startVerification =
  async (
    candidateId: string,
    userId: string
  ) => {
    const candidate =
      await getOwnedCandidate(
        candidateId,
        userId
      );

    const [
      aadhaarVerification,
      panVerification,
    ] = await Promise.all([
      verifyAadhaar(candidate.aadhaarNumber),
      verifyPAN(candidate.panNumber),
    ]);

    const [aadhaarLog, panLog] =
      await Promise.all([
        upsertVerificationLog({
          candidateId,
          verificationType:
            "AADHAAR",
          requestPayload: {
            aadhaarNumber:
              candidate.aadhaarNumber,
          },
          responsePayload:
            aadhaarVerification,
          verificationStatus:
            aadhaarVerification.status,
        }),
        upsertVerificationLog({
          candidateId,
          verificationType:
            "PAN",
          requestPayload: {
            panNumber:
              candidate.panNumber,
          },
          responsePayload:
            panVerification,
          verificationStatus:
            panVerification.status,
        }),
      ]);

    const overallStatus =
      await recalculateOverallStatus(
        candidateId
      );

    return {
      candidateId,
      aadhaarVerification,
      panVerification,
      logs: {
        aadhaar: aadhaarLog,
        pan: panLog,
      },
      overallStatus,
      verifiedAt: new Date(),
    };
  };
