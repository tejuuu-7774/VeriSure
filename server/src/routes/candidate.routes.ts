import { Router } from "express";
import {
  createCandidateHandler,
  getCandidatesHandler,
} from "../controllers/candidate.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticateUser,
  createCandidateHandler
);

router.get(
  "/",
  authenticateUser,
  getCandidatesHandler
);

export default router;