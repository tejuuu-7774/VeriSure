import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("VeriSure Backend Running...");
});

export default app;