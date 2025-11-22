import axios from "axios";

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";

export async function analyzeEmailAI({ subject, body, tone = "friendly", language = "auto" }) {
  const payload = { subject, body, tone, language };
  const res = await axios.post(`${AI_BASE_URL}/analyze-email`, payload);
  return res.data;
}
