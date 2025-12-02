// lib/events.js
import EmailEvent from "../models/EmailEvent.js";

export async function addEvent({ userId, emailId, eventType, category = null, priority = null, meta = {} }) {
  try {
    await EmailEvent.create({
      userId,
      emailId,
      eventType,
      category,
      priority,
      meta,
    });
  } catch (err) {
    console.error("addEvent error:", err);
  }
}
