import express from "express";
import { google } from "googleapis";

import Email from "../models/email-model.js";
import { protect } from "../middleware/authMiddleware.js";
import { analyzeEmailAI } from "../services/aiService.js";
import { decryptToken } from "../models/user-model.js";
import { runEmailAutomation } from "../services/emailAutomation.js";
import { addEvent } from "../utils/events.js";

const router = express.Router();

/**
  GET /api/filter-emails → Get emails filtered by category from DB
 */
router.get("/filter-emails", protect, async (req, res) => {
  try {
    const { category } = req.query;

    let query = { userId: req.user._id };

    // Filter by intent/category if provided
    if (category && category !== "ALL") {
      query.intent = category;
    }

    const emails = await Email.find(query).sort({ createdAt: -1 }).limit(50);

    res.json({ emails });
  } catch (err) {
    console.error("⚠ Get emails error:", err);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
});

function getOAuth2ClientForUser(user) {
  if (!user.googleRefreshToken) {
    throw new Error("Google refresh token missing. Please reconnect Google.");
  }

  // Decrypt the refresh token before using it
  const decryptedRefreshToken = decryptToken(user.googleRefreshToken);
  if (!decryptedRefreshToken) {
    throw new Error(
      "Failed to decrypt refresh token. Please reconnect Google."
    );
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  client.setCredentials({
    refresh_token: decryptedRefreshToken,
  });

  return client;
}

function createRawMessage({ from, to, subject, text }) {
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    text,
  ];

  return Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * GET /api/emails/fetch → Gmail Inbox Se Latest Emails
 */
router.get("/fetch", protect, async (req, res) => {
  try {
    if (req.user && req.user.automationEnabled === false) {
      return res
        .status(403)
        .json({ message: "Automation is disabled for this user." });
    }

    const auth = getOAuth2ClientForUser(req.user);
    const gmail = google.gmail({ version: "v1", auth });

    // 1. Fetch latest 20 emails
    const listRes = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: 20,
    });

    const messages = listRes.data.messages || [];
    const results = [];

    // 2. Process each message
    for (const m of messages) {
      // Check if already exists
      const existing = await Email.findOne({
        userId: req.user._id,
        gmailMessageId: m.id,
      });

      if (existing) {
        // Already analyzed, just push to results
        results.push(existing);
        continue;
      }

      // Fetch full details
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: m.id,
        format: "full", // Need full for body
      });

      const headers = msg.data.payload?.headers || [];
      const getHeader = (name) =>
        headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
          ?.value || "";

      const subject = getHeader("Subject");
      const from = getHeader("From");
      const to = getHeader("To"); // Add To field
      const snippet = msg.data.snippet || "";

      // Extract body (simplified logic)
      let body = snippet;
      if (msg.data.payload?.body?.data) {
        body = Buffer.from(msg.data.payload.body.data, "base64").toString(
          "utf-8"
        );
      } else if (msg.data.payload?.parts) {
        const part = msg.data.payload.parts.find(
          (p) => p.mimeType === "text/plain"
        );
        if (part?.body?.data) {
          body = Buffer.from(part.body.data, "base64").toString("utf-8");
        }
      }

      // 3. Analyze with AI
      try {
        const ai = await analyzeEmailAI({
          subject,
          body,
        });

        // 4. Save to DB
        const newEmail = await Email.create({
          userId: req.user._id,
          from,
          to,
          subject,
          body, // Store full body or snippet
          gmailMessageId: m.id,
          gmailThreadId: msg.data.threadId,
          summary: ai.summary,
          intent: ai.intent,
          replyDraft: ai.reply,
          status: "PENDING",
        });

        // Add event
        await addEvent({
          userId: req.user._id,
          emailId: newEmail._id.toString(),
          eventType: "RECEIVED",
          category: ai.intent || null,
          priority: ai.priority || "NORMAL",
          meta: { gmailMessageId: m.id, gmailThreadId: msg.data.threadId, snippet },
        });

        if (ai.reply) {
          await addEvent({
            userId: req.user._id,
            emailId: newEmail._id.toString(),
            eventType: "AUTO_REPLY_SUGGESTED",
            meta: { reply: ai.reply },
          });
        }

        results.push(newEmail);
      } catch (aiErr) {
        console.error(`Failed to analyze email ${m.id}:`, aiErr);
        // Optionally save without analysis or skip
      }
    }

    res.json({ emails: results });
  } catch (err) {
    console.error("⚠ Gmail fetch error:", err);
    res.status(500).json({ message: "Failed to fetch Gmail emails" });
  }
});

/**
 * POST /api/emails/analyze → AI Summary + DB Save
 */
router.post("/analyze", protect, async (req, res) => {
  try {
    const {
      from,
      to,
      subject,
      body,
      tone,
      language,
      snippet,
      gmailMessageId,
      gmailThreadId,
    } = req.body;

    const finalBody = body || snippet;
    if (!subject || !finalBody) {
      return res.status(400).json({ message: "Subject & body/snippet are required." });
    }

    if (req.user && req.user.automationEnabled === false) {
      return res.status(403).json({ message: "Automation is disabled for this user." });
    }

    const ai = await analyzeEmailAI({
      subject,
      body: finalBody,
      tone,
      language,
    });

    const email = await Email.create({
      userId: req.user._id,
      from,
      to,
      subject,
      body: finalBody,
      gmailMessageId,
      gmailThreadId,
      summary: ai.summary,
      intent: ai.intent,
      replyDraft: ai.reply,
      status: "PENDING",
    });

    // 1️⃣ RECEIVED event
    await addEvent({
      userId: req.user._id,
      emailId: email._id.toString(),
      eventType: "RECEIVED",
      category: ai.intent || null,
      priority: ai.priority || "NORMAL",
      meta: { gmailMessageId, gmailThreadId, snippet },
    });

    // 2️⃣ CATEGORY_ASSIGNED event — REQUIRED FOR DASHBOARD CATEGORY GRAPH
    await addEvent({
      userId: req.user._id,
      emailId: email._id.toString(),
      eventType: "CATEGORY_ASSIGNED",
      category: ai.intent,
      meta: { gmailMessageId, gmailThreadId }
    });

    // 3️⃣ AUTO_REPLY_SUGGESTED event
    if (ai.reply) {
      await addEvent({
        userId: req.user._id,
        emailId: email._id.toString(),
        eventType: "AUTO_REPLY_SUGGESTED",
        meta: { reply: ai.reply },
      });
    }

    res.json(email);
  } catch (err) {
    console.error("⚠ Analyze email error:", err);
    res.status(500).json({ message: "Failed to analyze email" });
  }
});

/**
 *  POST /api/emails/send/:id → Gmail Reply Send
 */
router.post("/send/:id", protect, async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id.trim(),
      userId: req.user._id,
    });

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    const auth = getOAuth2ClientForUser(req.user);
    const gmail = google.gmail({ version: "v1", auth });

    // Allow client to provide reply text in the POST body (preferred),
    // otherwise fall back to stored replyDraft on the Email document.
    const { text: providedText } = req.body || {};
    const replyText =
      providedText || email.replyDraft || "Thanks for your message.";

    const raw = createRawMessage({
      from: req.user.email,
      to: email.from,
      subject: `Re: ${email.subject}`,
      text: replyText,
    });

    const sendRes = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
        ...(email.gmailThreadId && { threadId: email.gmailThreadId }),
      },
    });

    // Persist the reply used and mark as replied
    email.status = "REPLIED";
    email.replyDraft = replyText;
    await email.save();

    await addEvent({
      userId: req.user._id,
      emailId: email._id.toString(),
      eventType: "REPLIED",
      meta: { usedReply: replyText, sendResId: sendRes.data?.id || null },
    });

    res.json({ message: "Reply sent successfully!", sendRes, email });
  } catch (err) {
    console.error("⚠ Send email error:");
    res.status(500).json({ message: "Failed to send email" });
  }
});

/**
 *  GET /api/emails/:id → Single Email
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id.trim(),
      userId: req.user._id,
    });

    if (!email) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(email);
  } catch (err) {
    console.error("⚠ Get email error:");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
