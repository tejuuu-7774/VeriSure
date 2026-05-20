import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import { getDashboardStatsHandler } from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/stats",
  authenticateUser,
  getDashboardStatsHandler
);

export default router;