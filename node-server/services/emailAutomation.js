import { google } from "googleapis";
import User from "../models/user-model.js";
import Email from "../models/email-model.js";
import { decryptToken } from "../models/user-model.js";
import { analyzeEmailAI } from "./aiService.js";
import logger from "../utils/logger.js";

/**
 * Get OAuth2 client for a user
 */
function getOAuth2ClientForUser(user) {
  if (!user.googleRefreshToken) {
    throw new Error("Google refresh token missing");
  }

  const decryptedRefreshToken = decryptToken(user.googleRefreshToken);
  if (!decryptedRefreshToken) {
    throw new Error("Failed to decrypt refresh token");
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

/**
 * Extract email body from Gmail message payload
 */
function extractEmailBody(payload) {
  let body = "";
  let htmlBody = "";

  // If simple message with body directly
  if (payload.body?.data) {
    body = Buffer.from(payload.body.data, "base64").toString("utf-8");
    return body.trim();
  }

  // Handle multipart messages
  if (payload.parts) {
    for (const part of payload.parts) {
      // Prefer plain text
      if (part.mimeType === "text/plain" && part.body?.data) {
        body = Buffer.from(part.body.data, "base64").toString("utf-8");
        return body.trim();
      }
      
      // Store HTML as fallback
      if (part.mimeType === "text/html" && part.body?.data) {
        htmlBody = Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      
      // Recursive for nested parts (multipart/alternative, etc.)
      if (part.parts) {
        const nestedBody = extractEmailBody(part);
        if (nestedBody) {
          return nestedBody.trim();
        }
      }
    }
  }

  // Fallback to HTML if plain text not available
  if (!body && htmlBody) {
    // Simple HTML to text conversion
    body = htmlBody
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  return body.trim();
}

/**
 * Fetch and process emails for a single user
 */
async function processUserEmails(user) {
  try {
    const auth = getOAuth2ClientForUser(user);
    const gmail = google.gmail({ version: "v1", auth });

    // Fetch latest emails from inbox
    const listRes = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: 20,
      q: "is:unread OR newer_than:1d", // Unread or from last 24 hours
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) {
      logger.info(`No new emails for user ${user.email}`);
      return { processed: 0, skipped: 0 };
    }

    let processed = 0;
    let skipped = 0;

    // Process each message
    for (const messageRef of messages) {
      try {
        // Check if email already exists in database
        const existingEmail = await Email.findOne({
          userId: user._id,
          gmailMessageId: messageRef.id,
        });

        if (existingEmail) {
          skipped++;
          continue;
        }

        // Fetch full message details
        const msgRes = await gmail.users.messages.get({
          userId: "me",
          id: messageRef.id,
          format: "full",
        });

        const msg = msgRes.data;
        const headers = msg.payload?.headers || [];
        const getHeader = (name) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

        const from = getHeader("From");
        const to = getHeader("To");
        const subject = getHeader("Subject");
        const date = getHeader("Date");
        const snippet = msg.snippet || "";

        // Extract email body
        let body = extractEmailBody(msg.payload);
        if (!body && snippet) {
          body = snippet;
        }

        if (!subject || !body) {
          logger.warn(`Skipping email ${messageRef.id} - missing subject or body`);
          skipped++;
          continue;
        }

        // Analyze email with AI
        let aiResult;
        try {
          aiResult = await analyzeEmailAI({
            subject,
            body: body || snippet,
            tone: user.defaultTone || "friendly",
            language: "auto",
          });
        } catch (aiError) {
          logger.error(`AI analysis failed for email ${messageRef.id}:`, aiError);
          // Continue with default values if AI fails
          aiResult = {
            summary: snippet || "Unable to generate summary",
            intent: "OTHER",
            reply: "Thank you for your email.",
          };
        }

        // Save email to database
        await Email.create({
          userId: user._id,
          gmailMessageId: messageRef.id,
          gmailThreadId: msg.threadId,
          from,
          to,
          subject,
          body: body || snippet,
          summary: aiResult.summary,
          intent: aiResult.intent,
          replyDraft: aiResult.reply,
          status: "PENDING",
        });

        processed++;
        logger.info(`Processed email: ${subject} for user ${user.email}`);
      } catch (msgError) {
        logger.error(`Error processing message ${messageRef.id}:`, msgError);
        skipped++;
      }
    }

    return { processed, skipped };
  } catch (error) {
    logger.error(`Error processing emails for user ${user.email}:`, error);
    throw error;
  }
}

/**
 * Main automation function - processes emails for all users with automation enabled
 */
export async function runEmailAutomation() {
  try {
    logger.info("Starting automated email fetch and analysis...");

    // Find all users with automation enabled and refresh token
    const users = await User.find({
      automationEnabled: true,
      googleRefreshToken: { $exists: true, $ne: null },
    }).select("+googleRefreshToken");

    if (users.length === 0) {
      logger.info("No users with automation enabled found");
      return;
    }

    logger.info(`Processing emails for ${users.length} user(s)`);

    let totalProcessed = 0;
    let totalSkipped = 0;

    // Process emails for each user
    for (const user of users) {
      try {
        const result = await processUserEmails(user);
        totalProcessed += result.processed;
        totalSkipped += result.skipped;
      } catch (userError) {
        logger.error(`Failed to process emails for user ${user.email}:`, userError);
        // Continue with other users even if one fails
      }
    }

    logger.info(
      `Automation completed: ${totalProcessed} emails processed, ${totalSkipped} skipped`
    );
  } catch (error) {
    logger.error("Error in email automation:", error);
  }
}

