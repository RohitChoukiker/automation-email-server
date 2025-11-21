import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth-routes.js";
import emailRoutes from "./routes/email-routes.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// connect DB
connectDB();

// health
app.get("/", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
