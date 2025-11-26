import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PUT /api/user/trigger-automation
 * body: { enabled: boolean }
 */
router.put("/trigger-automation", protect, async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== "boolean") {
      return res.status(400).json({ message: "Provide boolean 'enabled' in body." });
    }

    req.user.automationEnabled = enabled;
    await req.user.save();

    res.json({ message: "Automation setting updated", automationEnabled: req.user.automationEnabled });
  } catch (err) {
    console.error("⚠ Update automation error:");
    res.status(500).json({ message: "Failed to update automation setting" });
  }
});

export default router;
