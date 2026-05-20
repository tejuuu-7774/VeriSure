import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import { startVerificationHandler } from "../controllers/verification.controller";

const router = Router();

router.post(
  "/:id/start",
  authenticateUser,
  startVerificationHandler
);

export default router;