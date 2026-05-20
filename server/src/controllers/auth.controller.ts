import { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation";

import {
  registerUser,
  loginUser,
} from "../services/auth.service";

// main logic - REGISTER
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

// main logic - LOGIN
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    // validate request body
    const validatedData = loginSchema.parse(req.body);

    // login user
    const result = await loginUser(
      validatedData.email,
      validatedData.password
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};