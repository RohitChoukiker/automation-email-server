

import EmailEvent from "../models/EmailEvent.js";
import DailyMetrics from "../models/DailyMetrics.js";
import mongoose from "mongoose";

export async function aggregateForDateRange(userId, startDate, endDate) {
  const matchBase = {
    userId: new mongoose.Types.ObjectId(userId),
    createdAt: { $gte: startDate, $lte: endDate },
  };


  const volume = await EmailEvent.countDocuments({
    ...matchBase,
    eventType: "RECEIVED",
  });


  const categoryAgg = await EmailEvent.aggregate([
    { $match: { ...matchBase, eventType: "CATEGORY_ASSIGNED" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const categories = {};
  categoryAgg.forEach((c) => {
    categories[c._id || "Other"] = c.count;
  });


  const urgencyAgg = await EmailEvent.aggregate([
    { $match: { ...matchBase, priority: { $exists: true } } },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const urgency = {};
  urgencyAgg.forEach((u) => {
    urgency[u._id || "NORMAL"] = u.count;
  });


  const aiRepliesSuggested = await EmailEvent.countDocuments({
    ...matchBase,
    eventType: "AUTO_REPLY_SUGGESTED",
  });


  const replyAgg = await EmailEvent.aggregate([
    {
      $match: {
        ...matchBase,
        eventType: "REPLIED",
        "meta.replyTimeMs": { $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgMs: { $avg: "$meta.replyTimeMs" },
      },
    },
  ]);

  const repliesSent = replyAgg[0]?.count || 0;
  const avgResponseTimeMs = Math.round(replyAgg[0]?.avgMs || 0);


  const total = volume || 1;
  const classified = Object.values(categories).reduce((a, b) => a + b, 0);
  const unclassifiedRatio = Math.max(0, (total - classified) / total);
  const aiRatio = aiRepliesSuggested / total;

  let inboxHealthScore =
    100 -
    unclassifiedRatio * 40 -
    (avgResponseTimeMs / (1000 * 60 * 60)) * 2 +
    aiRatio * 12;

  inboxHealthScore = Math.max(5, Math.round(inboxHealthScore));

  return {
    volume,
    categories,
    urgency,
    aiRepliesSuggested,
    repliesSent,
    avgResponseTimeMs,
    inboxHealthScore,
  };
}

export async function runDailyAggregationForDate(dateStr) {
  const start = new Date(dateStr + "T00:00:00.000Z");
  const end = new Date(dateStr + "T23:59:59.999Z");

  const userIds = await EmailEvent.distinct("userId", {
    createdAt: { $gte: start, $lte: end },
  });

  for (const userId of userIds) {
    const metrics = await aggregateForDateRange(userId, start, end);

    await DailyMetrics.updateOne(
      { userId, date: dateStr },
      { $set: metrics },
      { upsert: true }
    );
  }
}
