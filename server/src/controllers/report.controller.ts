import { Request, Response } from "express";
import { generateReport } from "../services/report.service";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const generateReportHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message:
            "Unauthorized access",
        });
      }

      const candidateId =
        req.params.id as string;

      const report =
        await generateReport(
          candidateId,
          req.user.userId
        );

      return res.status(200).json({
        success: true,
        report,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to generate report",
      });
    }
  };