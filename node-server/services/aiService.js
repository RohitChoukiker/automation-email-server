import axios from "axios";

const AI_BASE_URL = process.env.AI_SERVICE_URL;



if (!AI_BASE_URL) {
  console.error("AI_SERVICE_URL is not set");
}

export async function analyzeEmailAI({
  subject,
  body,
  tone = "friendly",
  language = "auto",
}) {
  const payload = { subject, body, tone, language };

  try {
    const res = await axios.post(`${AI_BASE_URL}/analyze-email`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 20000,
      maxRedirects: 3,
    });

    return res.data;
  } catch (err) {
    // --- Detailed logging ---
    if (axios.isAxiosError(err)) {
      console.error("🧠 AI SERVICE ERROR:");
      console.error("  URL:   ", err.config?.url);
      console.error("  MSG:   ", err.message);
      console.error("  CODE:  ", err.code);

      if (err.response) {
        console.error("  STATUS:", err.response.status);
        console.error("  DATA:  ", err.response.data);
      }

      if (err.cause) {
        console.error("  CAUSE: ", err.cause);
      }
    } else {
      console.error("🧠 Unknown AI error:", err);
    }

    // --- Option 1: SAFE FALLBACK (recommended for automation) ---
    // So that one email failure doesn't break the whole cron job.
    return {
      summary: body?.slice(0, 350) || "",
      intent: "OTHER",
      reply: "",
      fallback: true,
    };

    // --- Option 2: Rethrow (if you want job to fail hard) ---
    // throw err;
  }
}
