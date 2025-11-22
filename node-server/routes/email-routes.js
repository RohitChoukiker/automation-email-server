import express from "express";
import { google } from "googleapis";

import Email from "../models/email-model.js";
import { protect } from "../middleware/authMiddleware.js";
import { analyzeEmailAI } from "../services/aiService.js";

const router = express.Router();

/**
 * 📌 Get Gmail OAuth2 client – PER USER
 */
function getOAuth2ClientForUser(user) {
  if (!user.googleRefreshToken) {
    throw new Error("Google refresh token missing. Please reconnect Google.");
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  client.setCredentials({
    refresh_token: user.googleRefreshToken,
  });

  return client;
}

/**
 * 📩 RFC822 Format for Gmail Send API
 */
function createRawMessage({ from, to, subject, text }) {
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    text,
  ];

  return Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * 📨 GET /api/emails/fetch → Gmail Inbox Se Latest Emails
 */
router.get("/fetch", protect, async (req, res) => {
  try {
    const auth = getOAuth2ClientForUser(req.user);
    const gmail = google.gmail({ version: "v1", auth });

    const listRes = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: 10,
    });

    const messages = listRes.data.messages || [];
    const emails = await Promise.all(
      messages.map(async (m) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: m.id,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        });

        const headers = msg.data.payload?.headers || [];
        const getHeader = (name) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

        return {
          gmailMessageId: m.id,
          gmailThreadId: msg.data.threadId,
          subject: getHeader("Subject"),
          from: getHeader("From"),
          date: getHeader("Date"),
          snippet: msg.data.snippet || "",
        };
      })
    );

    res.json({ emails });
  } catch (err) {
    console.error("⚠ Gmail fetch error:", err);
    res.status(500).json({ message: "Failed to fetch Gmail emails" });
  }
});

/**
 * 🧠 POST /api/emails/analyze → AI Summary + DB Save
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

    res.json(email);
  } catch (err) {
    console.error("⚠ Analyze email error:", err);
    res.status(500).json({ message: "Failed to analyze email" });
  }
});

/**
 * ✉ POST /api/emails/send/:id → Gmail Reply Send
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

    const raw = createRawMessage({
      from: req.user.email,
      to: email.from,
      subject: `Re: ${email.subject}`,
      text: email.replyDraft || "Thanks for your message.",
    });

    const sendRes = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
        ...(email.gmailThreadId && { threadId: email.gmailThreadId }),
      },
    });

    email.status = "REPLIED";
    await email.save();

    res.json({ message: "Reply sent successfully!", sendRes, email });
  } catch (err) {
    console.error("⚠ Send email error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

/**
 * 📌 GET /api/emails/:id → Single Email
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
    console.error("⚠ Get email error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
