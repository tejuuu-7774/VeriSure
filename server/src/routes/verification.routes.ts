import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import {
  startAadhaarVerificationHandler,
  startPanVerificationHandler,
  startVerificationHandler,
} from "../controllers/verification.controller";

const router = Router();

router.post(
  "/:id/aadhaar",
  authenticateUser,
  startAadhaarVerificationHandler
);

router.post(
  "/:id/pan",
  authenticateUser,
  startPanVerificationHandler
);

router.post(
  "/:id/start",
  authenticateUser,
  startVerificationHandler
);

export default router;
