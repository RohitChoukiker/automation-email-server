// routes/dashboard.js
import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import DailyMetrics from "../models/DailyMetrics.js";
import EmailEvent from "../models/EmailEvent.js";

const router = express.Router();

router.get("/metrics", protect, async (req, res) => {
  try {
    const userId = req.user._id;
   
    const userObjectId = typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;
    const days = Math.min(Number(req.query.days) || 7, 90);
    // Use UTC-based boundaries so the generated YYYY-MM-DD strings
    // match how daily aggregates are stored (they use UTC dates).
    const now = new Date();
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setUTCDate(end.getUTCDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const dailyDocs = await DailyMetrics.find({ userId: userObjectId, date: { $in: dates } }).lean();

    if (dailyDocs.length) {
      const volume = dates.map(d => {
        const doc = dailyDocs.find(x => x.date === d);
        return { date: d, count: doc ? doc.volume : 0 };
      });

      const categoryMap = {};
      const urgencyMap = {};
      const healthArr = [];
      dailyDocs.forEach(doc => {
        if (doc.categories) {
          for (const [k, v] of Object.entries(doc.categories)) categoryMap[k] = (categoryMap[k] || 0) + Number(v);
        }
        if (doc.urgency) {
          for (const [k, v] of Object.entries(doc.urgency)) urgencyMap[k] = (urgencyMap[k] || 0) + Number(v);
        }
        if (typeof doc.inboxHealthScore === "number") healthArr.push(doc.inboxHealthScore);
      });

      const categories = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
      const urgency = Object.entries(urgencyMap).map(([label, value]) => ({ label, value }));
      const inboxHealthScore = healthArr.length ? Math.round(healthArr.reduce((a,b)=>a+b,0)/healthArr.length) : 100;

      return res.json({ volume, categories, urgency, inboxHealthScore });
    }

   
    const start = new Date(end);
    start.setUTCDate(end.getUTCDate() - (days - 1));
    start.setUTCHours(0, 0, 0, 0);

    const volAgg = await EmailEvent.aggregate([
      { $match: { userId: userObjectId, eventType: "RECEIVED", createdAt: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const volMap = {};
    volAgg.forEach(r => volMap[r._id] = r.count);
    const volume = dates.map(d => ({ date: d, count: volMap[d] || 0 }));

    // Include any event that has a category (e.g. RECEIVED with ai.intent)
    const catAgg = await EmailEvent.aggregate([
      { $match: { userId: userObjectId, category: { $exists: true, $ne: null }, createdAt: { $gte: start } } },
      { $group: { _id: "$category", value: { $sum: 1 } } }
    ]);
    const categories = catAgg.map(x => ({ name: x._id || "Other", value: x.value }));

    const urgAgg = await EmailEvent.aggregate([
      { $match: { userId: userObjectId, priority: { $exists: true }, createdAt: { $gte: start } } },
      { $group: { _id: "$priority", value: { $sum: 1 } } }
    ]);
    const urgency = urgAgg.map(x => ({ label: x._id, value: x.value }));


    const totalReceived = volume.reduce((s,p) => s + p.count, 0);
    const aiAgg = await EmailEvent.countDocuments({ userId: userObjectId, eventType: "AUTO_REPLY_SUGGESTED", createdAt: { $gte: start } });
    const aiRepliesRatio = totalReceived ? aiAgg / totalReceived : 0;
    const inboxHealthScore = Math.round(80 + aiRepliesRatio * 20);

    res.json({ volume, categories, urgency, inboxHealthScore });

  } catch (err) {
    console.error("dashboard metrics error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
