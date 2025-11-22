import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";

import authRoutes from "./routes/auth-routes.js";
import emailRoutes from "./routes/email-routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


connectDB();


app.get("/", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});


app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Backend running on http://localhost:${PORT}`);
});
