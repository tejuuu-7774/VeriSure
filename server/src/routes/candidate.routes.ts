import { Router } from "express";
import {
  createCandidateHandler,
  getCandidatesHandler,
  getCandidateByIdHandler,
  updateCandidateHandler,
  deleteCandidateHandler,
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

router.put(
  "/:id",
  authenticateUser,
  updateCandidateHandler
);

router.delete(
  "/:id",
  authenticateUser,
  deleteCandidateHandler
);

export default router;