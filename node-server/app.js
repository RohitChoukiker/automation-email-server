import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import AppError from "./utils/AppError.js";

import logger from "./utils/logger.js";
import { runEmailAutomation } from "./services/emailAutomation.js";
import globalErrorHandler from "./services/errorService.js";


import authRoutes from "./routes/auth-routes.js";
import emailRoutes from "./routes/email-routes.js";
import userRoutes from "./routes/user-routes.js";



const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

cron.schedule("* * * * *", async () => {
  logger.info("Running scheduled email automation...");
  try {
    await runEmailAutomation();
  } catch (error) {
    logger.error("Scheduled email automation failed:", error);
  }
});


// Initial run on startup
setTimeout(async () => {
  logger.info("Running initial email automation on server start...");
  try {
    await runEmailAutomation();
  } catch (error) {
    logger.error("Initial email automation failed:", error);
  }
}, 3000);

app.get("/", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/user", userRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDistPath = path.join(__dirname, "..", "client", "dist");

app.use(express.static(clientDistPath));

app.all('*',(req,res,next)=>{
     next(new AppError(`find ${req.originalUrl} on this server`,404));
  })
  
app.use(globalErrorHandler);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(clientDistPath, "index.html"));
// });

export default app;

