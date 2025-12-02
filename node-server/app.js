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


import { runDailyAggregationForDate } from "./jobs/dailyMetricsJob.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/* ---------------------------------------------------------
   ⏱ Automated Email Fetch + Analyze (your existing job)
---------------------------------------------------------- */
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

/* ---------------------------------------------------------
   ⭐ NEW: DAILY METRICS AGGREGATION JOB (Dashboard Graphs)
---------------------------------------------------------- */

// Runs everyday at 00:10 AM UTC
cron.schedule("10 0 * * *", async () => {
  try {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const dateStr = yesterday.toISOString().slice(0, 10); // YYYY-MM-DD

    logger.info(`📊 Running daily metrics aggregation for ${dateStr}...`);

    await runDailyAggregationForDate(dateStr);

    logger.info(`Daily metrics aggregation completed for ${dateStr}`);
  } catch (err) {
    logger.error(" Daily metrics job failed:", err);
  }
});

/* -- OPTIONAL: Run once at startup for testing --
setTimeout(async () => {
  const dateStr = new Date().toISOString().slice(0,10);
  logger.info(`📊 Running test aggregation for today (${dateStr})`);
  await runDailyAggregationForDate(dateStr);
}, 5000);
*/


/* ---------------------------------------------------------
   ROUTES
---------------------------------------------------------- */
app.get("/", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/user", userRoutes);

// ⚠️ Don't forget to mount dashboard route (if created)
// Example:
// import dashboardRouter from "./routes/dashboard.js";
// app.use("/api/dashboard", dashboardRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));

app.all("*", (req, res, next) => {
  next(new AppError(`find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
