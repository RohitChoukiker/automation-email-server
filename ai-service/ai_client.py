import json
import re
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL

genai.configure(api_key=GEMINI_API_KEY)

ALLOWED_INTENTS = [
    "LEAD",
    "SALES",
    "PARTNERSHIP",
    "INVESTOR",
    "SUPPORT",
    "BUG_REPORT",
    "FEATURE_REQUEST",
    "BILLING",
    "MEETING",
    "FOLLOWUP",
    "QUESTION",
    "HIRING",
    "NEWSLETTER",
    "PERSONAL",
    "SPAM",
    "OTHER",
]

SYSTEM_PROMPT = """
You are an AI email assistant for a startup founder and software developer.

You MUST:
- Read the email subject and body.
- Use ONLY information that is clearly present in the email.
- If information is missing (dates, prices, links, details), DO NOT invent it.
- If needed, ask follow-up questions instead of guessing.

Your tasks:

1. "summary":
   - Summarize the email in 1–3 short sentences.
   - Use only facts from the email.

2. "intent":
   - Classify the main intent as ONE of:
     [LEAD, SALES, PARTNERSHIP, INVESTOR,
      SUPPORT, BUG_REPORT, FEATURE_REQUEST, BILLING,
      MEETING, FOLLOWUP, QUESTION,
      HIRING, NEWSLETTER, PERSONAL, SPAM, OTHER].

   Guidelines:
   - LEAD: New potential customer, wants to work with us, demo, proposal, quote, project enquiry.
   - SALES: Existing user/customer asking about pricing, upgrading, renewing, or adding seats/usage.
   - PARTNERSHIP: Collaboration, integration, affiliate, joint venture, co-marketing.
   - INVESTOR: Angels, VCs, fundraising, pitch decks, investing.
   - SUPPORT: Needs help using the product but not clearly a bug (how-to, confused about feature).
   - BUG_REPORT: Error messages, crashes, “not working”, clear broken behaviour.
   - FEATURE_REQUEST: Requests for new features or improvements.
   - BILLING: Invoices, receipts, payment failed, refunds, billing address, subscription charges.
   - MEETING: Scheduling or rescheduling a call, meeting, calendar invite.
   - FOLLOWUP: Checking in, “just following up”, reminders on previous messages.
   - QUESTION: General question not clearly support/bug/billing.
   - HIRING: Job applications, recruiting, interview-related mails.
   - NEWSLETTER: Bulk updates, product announcements, marketing/newsletter content.
   - PERSONAL: Non-work, social, friends/family, clearly not about the business.
   - SPAM: Scam, obvious spam, suspicious offers, generic promotions.
   - OTHER: Anything that does not clearly fit above.

3. "reply":
   - Draft a reply to the email.
   - Be polite, concise, and professional.
   - Use the requested tone and language provided in the prompt.
   - If important details are missing, clearly ask for those instead of guessing.
   - Do NOT make promises that are not mentioned in the email or in the prompt.

Output format (VERY IMPORTANT):
- Return ONLY a single JSON object.
- NO markdown, NO extra text, NO explanations.
- Keys: summary (string), intent (string), reply (string).
"""

def build_user_prompt(subject: str, body: str, tone: str, language: str) -> str:
    subject = subject or "(no subject)"
    body = body or ""

    if len(body) > 8000:
        body = body[:8000] + "\n\n[TRUNCATED]"

    lang_rule = (
        "Reply in the same language as the email."
        if language == "auto"
        else f"Reply in {language}."
    )

    return f"""
Email Subject:
{subject}

Email Body:
{body}

Tone preference: {tone}
Language rule for reply: {lang_rule}

Return ONLY a JSON object with keys: summary, intent, reply.
"""

def _safe_extract_json(raw: str) -> dict:
    raw = (raw or "").strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(raw)
    except Exception:
        pass

    match = re.search(r"\{.*\}", raw, flags=re.DOTALL)
    if match:
        candidate = match.group(0)
        return json.loads(candidate)

    raise RuntimeError("Gemini response is not valid JSON:\n" + raw)

def fallback_intent_detection(text: str) -> str:
    t = (text or "").lower()

    if any(w in t for w in ["price", "quote", "project", "proposal", "estimate", "work with you", "demo"]):
        return "LEAD"
    if any(w in t for w in ["upgrade", "renew", "plan", "subscription", "license", "seats"]):
        return "SALES"
    if any(w in t for w in ["partner", "partnership", "integrate", "integration", "co-marketing", "affiliate"]):
        return "PARTNERSHIP"
    if any(w in t for w in ["invest", "investment", "round", "funding", "pitch deck", "term sheet"]):
        return "INVESTOR"
    if any(w in t for w in ["career", "job", "role", "position", "cv", "resume", "linkedin", "apply"]):
        return "HIRING"
    if any(w in t for w in ["invoice", "payment", "receipt", "bill", "due", "overdue", "charged", "refund"]):
        return "BILLING"
    if any(w in t for w in ["bug", "error", "crash", "stack trace", "exception", "not working", "fails", "broken"]):
        return "BUG_REPORT"
    if any(w in t for w in ["feature", "request", "could you add", "would be great if", "roadmap"]):
        return "FEATURE_REQUEST"
    if any(w in t for w in ["cannot", "can't", "help", "support", "issue", "problem", "confused"]):
        return "SUPPORT"
    if any(w in t for w in ["meeting", "call", "zoom", "google meet", "teams", "schedule", "reschedule", "calendar"]):
        return "MEETING"
    if any(w in t for w in ["following up", "follow up", "just checking in", "gentle reminder"]):
        return "FOLLOWUP"
    if any(w in t for w in ["unsubscribe", "newsletter", "update from", "product update", "release notes"]):
        return "NEWSLETTER"
    if any(w in t for w in ["win", "winner", "jackpot", "lottery", "click this link", "investment opportunity", "crypto"]):
        return "SPAM"
    if "?" in t:
        return "QUESTION"

    return "OTHER"

def analyze_email(subject: str, body: str, tone: str = "friendly", language: str = "auto"):
    prompt = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(subject, body, tone, language)}"

    model = genai.GenerativeModel(GEMINI_MODEL)

    # If your SDK supports it, this is better:
    # response = model.generate_content(
    #     prompt,
    #     generation_config={"response_mime_type": "application/json"},
    # )
    # raw = (response.text or "").strip()

    response = model.generate_content(prompt)
    raw = (response.text or "").strip()

    data = _safe_extract_json(raw)

    summary = (data.get("summary") or "").strip()
    intent = (data.get("intent") )
    reply = (data.get("reply") or "").strip()

    if intent not in ALLOWED_INTENTS:
        intent = fallback_intent_detection(body)

    if not summary:
        summary = body[:200] + "..." if body else ""

    if not reply:
        reply = "Thank you for your email. Could you please share a few more details so I can assist you better?"

    return summary, intent, reply














# import json
# import google.generativeai as genai
# from config import GEMINI_API_KEY, GEMINI_MODEL

# genai.configure(api_key=GEMINI_API_KEY)

# SYSTEM_PROMPT = """
# You are an AI email assistant.

# Your tasks:
# 1. Summarize the email in 2-3 lines.
# 2. Detect intent as one of: [LEAD, QUESTION, INVOICE, SUPPORT, FOLLOWUP, SPAM, OTHER].
# 3. Generate a reply:
#    - Polite & professional.
#    - Same language as the email, unless `language` is specified.
# 4. Return ONLY JSON with keys: summary, intent, reply.
# IMPORTANT:
# - Do NOT return any explanation.
# - Do NOT wrap JSON in markdown.
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

# # 🔥 Extra fallback logic → agar Gemini intent galat de toh hum correct detect karenge
# def fallback_intent_detection(text: str) -> str:
#     text = text.lower()

#     if any(w in text for w in ["price", "quote", "project", "website", "hire", "work with you"]):
#         return "LEAD"
#     if any(w in text for w in ["invoice", "payment", "receipt", "bill", "due"]):
#         return "INVOICE"
#     if any(w in text for w in ["cannot", "can't", "error", "issue", "problem", "support"]):
#         return "SUPPORT"
#     if any(w in text for w in ["meeting", "follow up", "checking in"]):
#         return "FOLLOWUP"
#     if any(w in text for w in ["win", "lucky", "click this link", "investment"]):
#         return "SPAM"

#     return "OTHER"


# def analyze_email(subject: str, body: str, tone: str = "friendly", language: str = "auto"):
#     prompt = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(subject, body, tone, language)}"
#     model = genai.GenerativeModel(GEMINI_MODEL)
#     response = model.generate_content(prompt)

#     raw = response.text.strip()
#     raw = raw.replace("```json", "").replace("```", "")  # Safety

#     try:
#         data = json.loads(raw)
#     except Exception:
#         raise RuntimeError("Gemini response is not valid JSON:\n" + raw)

#     summary = data.get("summary", "").strip()
#     intent = data.get("intent", "OTHER").strip().upper()
#     reply = data.get("reply", "").strip()

#     # ⚡ Fallback → agar AI ne galat intent diya toh hum detect karenge
#     if intent not in ["LEAD", "INVOICE", "SUPPORT", "FOLLOWUP", "SPAM", "QUESTION"]:
#         intent = fallback_intent_detection(body)

#     return summary, intent, reply












