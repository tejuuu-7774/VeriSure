import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

export default app;