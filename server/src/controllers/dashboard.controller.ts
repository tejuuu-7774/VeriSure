import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const getDashboardStatsHandler =
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

      const stats =
        await getDashboardStats(
          req.user.userId
        );

      return res.status(200).json({
        success: true,
        stats,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Something went wrong",
      });
    }
  };