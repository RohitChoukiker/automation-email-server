import axios from "axios";

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";

export const analyzeEmailAI = async ({ subject, body, tone = "friendly" }) => {
  const res = await axios.post(`${AI_BASE_URL}/analyze-email`, {
    subject,
    body,
    tone,
    language: "auto",
  });

  return res.data; // { summary, intent, reply }
};
