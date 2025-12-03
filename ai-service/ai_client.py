import json
import re
import logging
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL

# Configure logger
logger = logging.getLogger(__name__)

# Configure Gemini
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
    "URGENT",
    "OTHER",
]

# Map common variations/synonyms to ALLOWED_INTENTS
INTENT_MAP = {
    "PRICE": "LEAD",
    "QUOTE": "LEAD",
    "PROPOSAL": "LEAD",
    "DEMO": "LEAD",
    "PROJECT": "LEAD",
    "UPGRADE": "SALES",
    "RENEW": "SALES",
    "SUBSCRIPTION": "SALES",
    "PARTNER": "PARTNERSHIP",
    "INTEGRATE": "PARTNERSHIP",
    "AFFILIATE": "PARTNERSHIP",
    "INVEST": "INVESTOR",
    "FUNDING": "INVESTOR",
    "PITCH": "INVESTOR",
    "CAREER": "HIRING",
    "JOB": "HIRING",
    "APPLY": "HIRING",
    "CV": "HIRING",
    "RESUME": "HIRING",
    "INVOICE": "BILLING",
    "PAYMENT": "BILLING",
    "RECEIPT": "BILLING",
    "REFUND": "BILLING",
    "BUG": "BUG_REPORT",
    "ERROR": "BUG_REPORT",
    "CRASH": "BUG_REPORT",
    "ISSUE": "SUPPORT",
    "HELP": "SUPPORT",
    "SCHEDULE": "MEETING",
    "CALENDAR": "MEETING",
    "REMINDER": "FOLLOWUP",
    "UPDATE": "NEWSLETTER",
    "LOTTERY": "SPAM",
    "CRYPTO": "SPAM",
}

# deterministic mapping from keywords -> final ALLOWED_INTENTS
KEYWORD_TO_ALLOWED = [
    (["invoice", "payment", "receipt", "bill", "due", "refund"], "BILLING"),
    (["bug", "error", "crash", "not working", "fails", "stack trace", "urgent", "asap"], "URGENT"), # URGENT maps to URGENT, or BUG_REPORT? Let's keep URGENT if allowed, or map to BUG_REPORT/SUPPORT. Added URGENT to ALLOWED_INTENTS.
    (["meeting", "call", "zoom", "google meet", "schedule", "reschedule", "calendar"], "MEETING"),
    (["follow up", "following up", "gentle reminder", "reminder"], "FOLLOWUP"),
    (["invest", "investment", "round", "funding", "pitch", "pitch deck"], "INVESTOR"),
    (["demo", "quote", "price", "proposal", "estimate", "project", "pricing", "upgrade", "renew", "subscription"], "LEAD"),
    (["partner", "partnership", "integrate", "integration", "co-marketing", "affiliate"], "PARTNERSHIP"),
    (["career", "job", "role", "position", "cv", "resume", "apply", "interview"], "HIRING"),
    # fallback spam/other detection (keeps OTHER when spam-like)
    (["lottery", "winner", "click this link", "investment opportunity", "crypto", "jackpot"], "OTHER"),
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
      HIRING, NEWSLETTER, PERSONAL, SPAM, URGENT, OTHER].

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
   - URGENT: Critical issues, downtime, immediate attention needed.
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

def log_ai_response(raw_text: str, parsed: dict = None):
    try:
        logger.debug("AI raw response: %s", raw_text[:1000])
        if parsed is not None:
            logger.debug("AI parsed JSON: %s", parsed)
    except Exception:
        pass

def fallback_intent_detection(text: str) -> str:
    """
    Return a short broad intent token (for debugging), but we will map to ALLOWED_INTENTS later.
    Keep this simpler — we may still prefer deterministic final mapping below.
    """
    t = (text or "").lower()
    if not t:
        return "OTHER"
    # simple checks (same as before but shorter)
    if any(w in t for w in ["invoice", "payment", "receipt", "bill", "due", "refund"]):
        return "BILLING"
    if any(w in t for w in ["bug", "error", "crash", "not working", "fails", "broken", "stack trace"]):
        return "BUG_REPORT"
    if any(w in t for w in ["meeting", "call", "zoom", "google meet", "schedule", "reschedule", "calendar"]):
        return "MEETING"
    if any(w in t for w in ["follow up", "following up", "just checking in", "gentle reminder"]):
        return "FOLLOWUP"
    if any(w in t for w in ["invest", "investment", "round", "funding", "pitch"]):
        return "INVESTOR"
    if any(w in t for w in ["price", "quote", "demo", "proposal", "estimate", "project", "upgrade", "renew", "subscription"]):
        return "LEAD"
    if any(w in t for w in ["partner", "partnership", "integrate", "integration", "co-marketing"]):
        return "PARTNERSHIP"
    if any(w in t for w in ["career", "job", "role", "position", "cv", "resume", "apply"]):
        return "HIRING"
    if "?" in t:
        return "QUESTION"
    return "OTHER"

def deterministic_keyword_to_allowed(subject: str, body: str) -> str:
    text = (subject or "") + " " + (body or "")
    t = text.lower()
    # iterate KEYWORD_TO_ALLOWED in order; return first match
    for keywords, label in KEYWORD_TO_ALLOWED:
        for kw in keywords:
            if kw in t:
                return label
    # last-resort heuristics
    if "support" in t or "help" in t or "cannot" in t or "can't" in t or "issue" in t or "problem" in t:
        return "URGENT"
    # nothing matched -> OTHER
    return "OTHER"

def map_to_allowed_intent(intent_raw: str, subject: str, body: str, priority_hint: str = None) -> str:
    """
    Normalize and map an intent (possibly from AI or fallback) into final ALLOWED_INTENTS.
    Improved: robust normalization, substring matching, and deterministic fallback that always returns an allowed label.
    """
    # priority hint overrides
    if priority_hint and str(priority_hint).upper() == "HIGH":
        return "URGENT"

    text = ((subject or "") + " " + (body or "")).lower()

    # urgent words anywhere -> URGENT
    if any(w in text for w in ["urgent", "asap", "immediately", "right away", "priority"]):
        return "URGENT"

    # normalize AI-provided intent
    intent = (intent_raw or "").strip()
    intent_norm = intent.upper().replace("-", "_").replace(" ", "_")

    # 1) direct exact allowed match
    if intent_norm in ALLOWED_INTENTS:
        return intent_norm

    # 2) substring/contains match: check if allowed label appears in the AI intent text
    for allowed in ALLOWED_INTENTS:
        if allowed in intent_norm:
            return allowed

    # 3) map known broader tokens via INTENT_MAP
    mapped = INTENT_MAP.get(intent_norm)
    if mapped and mapped in ALLOWED_INTENTS:
        return mapped

    # 4) try fallback detection (returns broad token) and map through INTENT_MAP
    fb = fallback_intent_detection(body)
    if fb:
        fb_norm = fb.strip().upper()
        mapped_fb = INTENT_MAP.get(fb_norm)
        if mapped_fb and mapped_fb in ALLOWED_INTENTS:
            return mapped_fb
        # if fb is itself an allowed label
        if fb_norm in ALLOWED_INTENTS:
            return fb_norm

    # 5) deterministic keyword-to-allowed final pass
    deterministic = deterministic_keyword_to_allowed(subject, body)
    if deterministic in ALLOWED_INTENTS:
        return deterministic

    # 6) if nothing matched, fallback to OTHER
    return "OTHER"

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

def analyze_email(subject: str, body: str, tone: str = "friendly", language: str = "auto"):
    prompt = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(subject, body, tone, language)}"

    model = genai.GenerativeModel(GEMINI_MODEL)

    try:
        response = model.generate_content(prompt)
        raw = (response.text or "").strip()
        log_ai_response(raw)
        
        data = _safe_extract_json(raw)
        log_ai_response(raw, data)

        summary = (data.get("summary") or "").strip()
        intent_raw = (data.get("intent") or "").strip()
        reply = (data.get("reply") or "").strip()

        intent = map_to_allowed_intent(intent_raw, subject, body)

        if not summary:
            summary = body[:200] + "..." if body else ""

        if not reply:
            reply = "Thank you for your email. Could you please share a few more details so I can assist you better?"

        return summary, intent, reply

    except Exception as e:
        logger.error(f"Error in analyze_email: {e}")
        # Fallback if AI fails
        intent = map_to_allowed_intent("", subject, body)
        return "Summary unavailable due to error.", intent, "I apologize, but I am unable to process your request at the moment."












