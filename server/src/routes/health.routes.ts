import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VeriSure API Running",
  });
});

router.get(
  "/protected",
  authenticateUser,
  (req, res) => {
    res.json({
      success: true,
      message: "Protected route accessed",
    });
  }
);

export default router;