import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import { generateReportHandler } from "../controllers/report.controller";

const router = Router();

router.get(
  "/:id",
  authenticateUser,
  generateReportHandler
);

export default router;