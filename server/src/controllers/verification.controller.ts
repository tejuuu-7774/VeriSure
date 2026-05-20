import { Request, Response } from "express";
import { startVerification } from "../services/verification.service";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const startVerificationHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const candidateId =
        req.params.id as string;

      const result =
        await startVerification(
          candidateId,
          req.user.userId
        );

      return res.status(200).json({
        success: true,
        message:
          "Verification completed successfully",
        report: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Verification failed",
      });
    }
  };