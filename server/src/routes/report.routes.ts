import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import {
  generateReportHandler,
  generatePDFReportHandler,
} from "../controllers/report.controller";

const router = Router();

router.get(
  "/:id",
  authenticateUser,
  generateReportHandler
);

router.get(
  "/:id/pdf",
  authenticateUser,
  generatePDFReportHandler
);

export default router;