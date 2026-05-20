import { Request, Response } from "express";
import { createCandidateSchema } from "../validations/candidate.validation";
import { createCandidate } from "../services/candidate.service";

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
    // validating request body
    const validatedData =
      createCandidateSchema.parse(req.body);

    // checks authenticated user
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // creates the candidate
    const candidate = await createCandidate({
      ...validatedData,
      createdById: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      candidate,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};