import prisma from "../config/prisma";

const verifyAadhaar = async (
  aadhaarNumber: string
) => {
  // simulate external API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  const isValid =
    /^\d{12}$/.test(aadhaarNumber);

  return {
    status: isValid
      ? "verified"
      : "failed",
    nameMatch: isValid,
    dobMatch: isValid,
    message: isValid
      ? "Aadhaar verified successfully"
      : "Invalid Aadhaar number",
  };
};

const verifyPAN = async (
  panNumber: string
) => {
  // simulate external API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  const isValid =
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
      panNumber
    );

  return {
    status: isValid
      ? "verified"
      : "failed",
    panStatus: isValid
      ? "active"
      : "inactive",
    message: isValid
      ? "PAN verified successfully"
      : "Invalid PAN number",
  };
};

export const startVerification =
  async (
    candidateId: string,
    userId: string
  ) => {
    // check candidate ownership
    const candidate =
      await prisma.candidate.findFirst({
        where: {
          id: candidateId,
          createdById: userId,
        },
      });

    if (!candidate) {
      throw new Error(
        "Candidate not found"
      );
    }

    // verify aadhaar
    const aadhaarResult =
      await verifyAadhaar(
        candidate.aadhaarNumber
      );

    // verify pan
    const panResult =
      await verifyPAN(
        candidate.panNumber
      );

    // determine final status
    let overallStatus:
      | "VERIFIED"
      | "FAILED"
      | "PARTIAL" = "FAILED";

    if (
      aadhaarResult.status ===
        "verified" &&
      panResult.status ===
        "verified"
    ) {
      overallStatus = "VERIFIED";
    } else if (
      aadhaarResult.status ===
        "verified" ||
      panResult.status ===
        "verified"
    ) {
      overallStatus = "PARTIAL";
    }

    // save aadhaar log
    await prisma.verificationLog.create({
      data: {
        candidateId,
        verificationType:
          "AADHAAR",
        requestPayload: {
          aadhaarNumber:
            candidate.aadhaarNumber,
        },
        responsePayload:
          aadhaarResult,
        verificationStatus:
          overallStatus,
      },
    });

    // save pan log
    await prisma.verificationLog.create({
      data: {
        candidateId,
        verificationType: "PAN",
        requestPayload: {
          panNumber:
            candidate.panNumber,
        },
        responsePayload:
          panResult,
        verificationStatus:
          overallStatus,
      },
    });

    // update candidate status
    await prisma.candidate.update({
      where: {
        id: candidateId,
      },
      data: {
        verificationStatus:
          overallStatus,
      },
    });

    return {
      candidateId,
      aadhaarVerification:
        aadhaarResult,
      panVerification:
        panResult,
      overallStatus,
      verifiedAt: new Date(),
    };
  };