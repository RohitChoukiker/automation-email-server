// models/DailyMetrics.js
import mongoose from "mongoose";

const DailyMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
  volume: { type: Number, default: 0 },
  categories: { type: Map, of: Number, default: {} },
  urgency: { type: Map, of: Number, default: {} },
  aiRepliesSuggested: { type: Number, default: 0 },
  repliesSent: { type: Number, default: 0 },
  avgResponseTimeMs: { type: Number, default: 0 },
  inboxHealthScore: { type: Number, default: 100 },
});

export default mongoose.models.DailyMetrics || mongoose.model("DailyMetrics", DailyMetricsSchema);
