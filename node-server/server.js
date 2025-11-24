import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";

import authRoutes from "./routes/auth-routes.js";
import emailRoutes from "./routes/email-routes.js";
import userRoutes from "./routes/user-routes.js";

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
app.use("/api/user", userRoutes);

// Serve client static files (Vite build output) and fallback to index.html for SPA routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "..", "client", "dist");

app.use(express.static(clientDistPath));

// For any GET request that isn't handled by above routes, serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
