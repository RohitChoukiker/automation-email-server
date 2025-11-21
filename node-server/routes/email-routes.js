import express from "express";
import Email from "../models/email-model.js";
import { protect } from "../middleware/authMiddleware.js";
import { analyzeEmailAI } from "../services/aiService.js";

const router = express.Router();

// GET /api/emails  → list emails
router.get("/", protect, async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(emails);
  } catch (err) {
    console.error("List emails error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/emails/analyze  → AI se summary + reply
router.post("/analyze", protect, async (req, res) => {
  try {
    const { from, to, subject, body, tone } = req.body;

    const ai = await analyzeEmailAI({ subject, body, tone });

    const email = await Email.create({
      userId: req.user._id,
      from,
      to,
      subject,
      body,
      summary: ai.summary,
      intent: ai.intent,
      replyDraft: ai.reply,
    });

    res.json(email);
  } catch (err) {
    console.error("Analyze email error:", err.response?.data || err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/emails/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!email) return res.status(404).json({ message: "Not found" });
    res.json(email);
  } catch (err) {
    console.error("Get email error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
