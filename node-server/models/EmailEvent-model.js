// models/EmailEvent.js
import mongoose from "mongoose";

const EmailEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  emailId: { type: String, required: true, index: true },
  eventType: { type: String, required: true }, 
  category: { type: String, default: null },
  priority: { type: String, enum: ["URGENT","HIGH","NORMAL","LOW"], default: "NORMAL" },
  sentiment: { type: String, enum: ["POS","NEU","NEG"], default: "NEU" },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.models.EmailEvent || mongoose.model("EmailEvent", EmailEventSchema);
