
import json
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL

genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
You are an AI email assistant.

Your tasks:
1. Summarize the email in 2-3 lines.
2. Detect intent as one of: [LEAD, QUESTION, INVOICE, SUPPORT, FOLLOWUP, SPAM, OTHER].
3. Generate a reply:
   - Polite & professional.
   - Same language as the email, unless `language` is specified.
4. Return ONLY JSON with keys: summary, intent, reply.
IMPORTANT:
- Do NOT return any explanation.
- Do NOT wrap JSON in markdown.
"""

def build_user_prompt(subject: str, body: str, tone: str, language: str) -> str:
    lang_rule = (
        "Reply in the same language as the email."
        if language == "auto"
        else f"Reply in {language}."
    )

    return f"""
Email Subject: {subject}
Email Body:
{body}

Tone: {tone}
Language rule: {lang_rule}

Return ONLY a JSON object with keys: summary, intent, reply.
"""

# 🔥 Extra fallback logic → agar Gemini intent galat de toh hum correct detect karenge
def fallback_intent_detection(text: str) -> str:
    text = text.lower()

    if any(w in text for w in ["price", "quote", "project", "website", "hire", "work with you"]):
        return "LEAD"
    if any(w in text for w in ["invoice", "payment", "receipt", "bill", "due"]):
        return "INVOICE"
    if any(w in text for w in ["cannot", "can't", "error", "issue", "problem", "support"]):
        return "SUPPORT"
    if any(w in text for w in ["meeting", "follow up", "checking in"]):
        return "FOLLOWUP"
    if any(w in text for w in ["win", "lucky", "click this link", "investment"]):
        return "SPAM"

    return "OTHER"


def analyze_email(subject: str, body: str, tone: str = "friendly", language: str = "auto"):
    prompt = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(subject, body, tone, language)}"
    model = genai.GenerativeModel(GEMINI_MODEL)
    response = model.generate_content(prompt)

    raw = response.text.strip()
    raw = raw.replace("```json", "").replace("```", "")  # Safety

    try:
        data = json.loads(raw)
    except Exception:
        raise RuntimeError("Gemini response is not valid JSON:\n" + raw)

    summary = data.get("summary", "").strip()
    intent = data.get("intent", "OTHER").strip().upper()
    reply = data.get("reply", "").strip()

    # ⚡ Fallback → agar AI ne galat intent diya toh hum detect karenge
    if intent not in ["LEAD", "INVOICE", "SUPPORT", "FOLLOWUP", "SPAM", "QUESTION"]:
        intent = fallback_intent_detection(body)

    return summary, intent, reply
















# import json
# import google.generativeai as genai
# from config import GEMINI_API_KEY, GEMINI_MODEL

# # API key set karte hi ready ho jayega
# genai.configure(api_key=GEMINI_API_KEY)

# SYSTEM_PROMPT = """
# You are an AI email assistant.

# Your tasks:
# 1. Summarize the email in 2-3 lines.
# 2. Detect intent as one of: [LEAD, QUESTION, SPAM, FOLLOWUP, OTHER].
# 3. Generate a reply:
#    - Polite and professional.
#    - Same language as the email (unless `language` is specified).
# 4. Return ONLY JSON with keys: summary, intent, reply.
# """

# def build_user_prompt(subject: str, body: str, tone: str, language: str) -> str:
#     lang_rule = (
#         "Reply in the same language as the email."
#         if language == "auto"
#         else f"Reply in {language}."
#     )

#     return f"""
# Email Subject: {subject}

# Email Body:
# {body}

# Tone: {tone}
# Language rule: {lang_rule}

# Return ONLY a JSON object with keys: summary, intent, reply.
# """

# def analyze_email(subject: str, body: str, tone: str = "friendly", language: str = "auto"):
#     prompt = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(subject, body, tone, language)}"

#     model = genai.GenerativeModel(GEMINI_MODEL)

#     response = model.generate_content(prompt)

#     # Gemini response sometimes comes as text → JSON parse karna padta hai
#     raw = response.text.strip()

#     # agar code fences aaye toh remove:
#     raw = raw.replace("```json", "").replace("```", "")

#     try:
#         data = json.loads(raw)
#     except Exception:
#         raise RuntimeError("Gemini response is not valid JSON:\n" + raw)

#     summary = data.get("summary", "").strip()
#     intent = data.get("intent", "OTHER").strip().upper()
#     reply = data.get("reply", "").strip()

#     return summary, intent, reply
