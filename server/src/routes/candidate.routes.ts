import { Router } from "express";
import { createCandidateHandler } from "../controllers/candidate.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticateUser,
  createCandidateHandler
);

export default router;