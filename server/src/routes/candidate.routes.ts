import { Router } from "express";
import {
  createCandidateHandler,
  getCandidatesHandler,
  getCandidateByIdHandler,
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

router.get(
  "/:id",
  authenticateUser,
  getCandidateByIdHandler
);

export default router;