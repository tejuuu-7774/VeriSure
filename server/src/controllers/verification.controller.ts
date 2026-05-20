import { Request, Response } from "express";
import {
  startAadhaarVerification,
  startPanVerification,
  startVerification,
} from "../services/verification.service";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

const getAuthUserId = (
  req: AuthRequest,
  res: Response
) => {
  if (!req.user?.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
    return null;
  }

  return req.user.userId;
};

export const startAadhaarVerificationHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId = getAuthUserId(req, res);
      if (!userId) return;

      const result =
        await startAadhaarVerification(
          req.params.id as string,
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "Aadhaar verification completed successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Aadhaar verification failed",
      });
    }
  };

export const startPanVerificationHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId = getAuthUserId(req, res);
      if (!userId) return;

      const result =
        await startPanVerification(
          req.params.id as string,
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "PAN verification completed successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "PAN verification failed",
      });
    }
  };

export const startVerificationHandler =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const userId = getAuthUserId(req, res);
      if (!userId) return;

      const result =
        await startVerification(
          req.params.id as string,
          userId
        );

      return res.status(200).json({
        success: true,
        message:
          "Full verification completed successfully",
        data: result,
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
