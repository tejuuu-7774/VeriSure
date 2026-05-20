import { Request, Response } from "express";
import { createCandidateSchema } from "../validations/candidate.validation";
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../services/candidate.service";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const createCandidateHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const validatedData =
      createCandidateSchema.parse(req.body);

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const candidate =
      await createCandidate({
        ...validatedData,
        createdById: req.user.userId,
      });

    return res.status(201).json({
      success: true,
      message:
        "Candidate created successfully",
      candidate,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCandidatesHandler =
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

      const candidates =
        await getCandidates(
          req.user.userId
        );

      return res.status(200).json({
        success: true,
        candidates,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const getCandidateByIdHandler =
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

      const id =
        req.params.id as string;

      const candidate =
        await getCandidateById(
          id,
          req.user.userId
        );

      return res.status(200).json({
        success: true,
        candidate,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const updateCandidateHandler =
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

      const id =
        req.params.id as string;

      const candidate =
        await updateCandidate(
          id,
          req.user.userId,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          "Candidate updated successfully",
        candidate,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

export const deleteCandidateHandler =
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

      const id =
        req.params.id as string;

      await deleteCandidate(
        id,
        req.user.userId
      );

      return res.status(200).json({
        success: true,
        message:
          "Candidate deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };