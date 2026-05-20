import { Request, Response } from "express";
import { registerSchema } from "../validations/auth.validation";
import { registerUser } from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    // validate request body
    const validatedData = registerSchema.parse(req.body);

    // register user
    const user = await registerUser(validatedData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};