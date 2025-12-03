# ai_client.py
import json
import re
import time
import random
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL

# configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# FINAL allowed intents (exactly the UI buttons)
ALLOWED_INTENTS = [
    "MEETING",
    "FOLLOWUP",
    "URGENT",     # custom UI bucket (mapped from priority / support/bug/urgent words)
    "INVESTOR",
    "LEAD",
    "PARTNERSHIP",
    "HIRING",
    "BILLING",
    "OTHER",
]

# Helpful: map broader AI intents / fallback categories into final allowed intents
INTENT_MAP = {
    # directly matching
    "MEETING": "MEETING",
    "FOLLOWUP": "FOLLOWUP",
    "INVESTOR": "INVESTOR",
    "LEAD": "LEAD",
    "PARTNERSHIP": "PARTNERSHIP",
    "HIRING": "HIRING",
    "BILLING": "BILLING",
    # Common internal intents -> map to URGENT or OTHER
    "BUG_REPORT": "URGENT",
    "SUPPORT": "URGENT",
    "FEATURE_REQUEST": "OTHER",
    "SALES": "LEAD",
    "NEWSLETTER": "OTHER",
    "PERSONAL": "OTHER",
    "SPAM": "OTHER",
    "QUESTION": "OTHER",
    "INVESTOR": "INVESTOR",
    "OTHER": "OTHER",
}

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
   - Classify the main intent as one of the (single) labels.
   - Allowed output labels: MEETING, FOLLOWUP, URGENT, INVESTOR, LEAD, PARTNERSHIP, HIRING, BILLING, OTHER

   Use these meanings:
   - MEETING: scheduling/rescheduling calls or invites.
   - FOLLOWUP: follow-up/reminder about previous message.
   - URGENT: high-priority issues or support/bug that need immediate attention.
   - INVESTOR: investment/funding related.
   - LEAD: potential customer / proposal / demo / quote.
   - PARTNERSHIP: collaboration/integration/co-marketing.
   - HIRING: job applications / recruiting / interviews.
   - BILLING: invoices, payments, refunds.
   - OTHER: anything else.

3. "reply":
   - Draft a short polite reply in the requested tone & language.
   - If important details are missing, ask clear follow-up questions instead of guessing.

Output format (VERY IMPORTANT):
- Return ONLY a single JSON object.
- NO markdown, NO extra text, NO explanations.
- Keys: summary (string), intent (string), reply (string).
"""

def build_user_prompt(subject: str, body: str, tone: str, language: str) -> str:
    subject = subject or "(no subject)"
    body = body or ""

    # truncate to keep token usage sensible
    if len(body) > 5000:
        body = body[:5000] + "\n\n[TRUNCATED]"

    lang_rule = (
        "Reply in the same language as the email."
        if (language or "auto") == "auto"
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

def _extract_json_from_text(raw: str) -> dict:
    """
    Robust extraction of the first JSON object from `raw`.
    Avoids depending on recursive regex. Uses brace matching.
    """
    raw = (raw or "").strip()
    # remove common markdown fences
    raw = raw.replace("```json", "").replace("```", "").strip()

    # try direct parse
    try:
        return json.loads(raw)
    except Exception:
        pass

    # find first { ... } balanced JSON block
    start = None
    depth = 0
    for i, ch in enumerate(raw):
        if ch == "{":
            if start is None:
                start = i
            depth += 1
        elif ch == "}":
            if depth > 0:
                depth -= 1
                if depth == 0 and start is not None:
                    candidate = raw[start:i+1]
                    try:
                        return json.loads(candidate)
                    except Exception:
                        # continue searching (maybe nested or malformed)
                        start = None
                        depth = 0
    # fallback: try to extract via regex simple curly pair (less reliable)
    m = re.search(r"\{[\s\S]*\}", raw)
    if m:
        try:
            return json.loads(m.group(0))
        except Exception:
            pass

    raise RuntimeError("AI response did not contain valid JSON:\n" + raw[:2000])

def fallback_intent_detection(text: str) -> str:
    t = (text or "").lower()
    # prioritized rules
    if any(w in t for w in ["price", "quote", "project", "proposal", "estimate", "demo"]):
        return "LEAD"
    if any(w in t for w in ["upgrade", "renew", "plan", "subscription", "license", "seats"]):
        return "LEAD"
    if any(w in t for w in ["partner", "partnership", "integrate", "integration", "co-marketing", "affiliate"]):
        return "PARTNERSHIP"
    if any(w in t for w in ["invest", "investment", "round", "funding", "pitch", "pitch deck"]):
        return "INVESTOR"
    if any(w in t for w in ["career", "job", "role", "position", "cv", "resume", "apply"]):
        return "HIRING"
    if any(w in t for w in ["invoice", "payment", "receipt", "bill", "due", "refund"]):
        return "BILLING"
    if any(w in t for w in ["bug", "error", "crash", "not working", "fails", "broken", "stack trace"]):
        return "BUG_REPORT"
    if any(w in t for w in ["feature", "request", "would be great if", "roadmap"]):
        return "FEATURE_REQUEST"
    if any(w in t for w in ["can't", "cannot", "help", "support", "issue", "problem", "confused"]):
        return "SUPPORT"
    if any(w in t for w in ["meeting", "call", "zoom", "google meet", "schedule", "reschedule", "calendar"]):
        return "MEETING"
    if any(w in t for w in ["follow up", "following up", "just checking in", "gentle reminder"]):
        return "FOLLOWUP"
    if any(w in t for w in ["newsletter", "release notes", "product update"]):
        return "NEWSLETTER"
    if any(w in t for w in ["lottery", "winner", "click this link", "investment opportunity", "crypto", "jackpot"]):
        return "SPAM"
    if "?" in t:
        return "QUESTION"
    return "OTHER"

def map_to_allowed_intent(intent_raw: str, subject: str, body: str, priority_hint: str = None) -> str:
    """
    Normalize and map an intent (possibly from AI or fallback) into final ALLOWED_INTENTS.
    Priority_hint may be "HIGH"/"NORMAL"/"LOW" if available from AI pipeline.
    Also detect urgency words in content to map to URGENT.
    """
    text = ((subject or "") + " " + (body or "")).lower()

    # If explicit priority hint high -> URGENT
    if priority_hint and str(priority_hint).upper() == "HIGH":
        return "URGENT"

    # detect urgent words
    if any(w in text for w in ["urgent", "asap", "immediately", "right away", "priority"]):
        return "URGENT"

    if not intent_raw:
        intent_raw = fallback_intent_detection(body)

    intent = str(intent_raw).strip().upper()

    # direct mapping if intent already in allowed
    if intent in ALLOWED_INTENTS:
        return intent

    # map from known broader intents
    mapped = INTENT_MAP.get(intent)
    if mapped:
        # ensure final is in allowed list
        return mapped if mapped in ALLOWED_INTENTS else "OTHER"

    # last resort: fallback detection and map again
    fb = fallback_intent_detection(body)
    mapped_fb = INTENT_MAP.get(fb, "OTHER")
    return mapped_fb if mapped_fb in ALLOWED_INTENTS else "OTHER"

def analyze_email(subject: str, body: str, tone: str = "friendly", language: str = "auto"):
    """
    Main entry point:
    - Calls Gemini
    - Extracts JSON { summary, intent, reply }
    - Maps intent to final UI-friendly intent set
    - Returns (summary, intent, reply)
    """
    subject = subject or ""
    body = body or ""
    tone = tone or "friendly"
    language = language or "auto"

    prompt = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(subject, body, tone, language)}"

    # small jitter to avoid hitting rate limits if bursty
    time.sleep(random.uniform(0.02, 0.12))

    model = genai.GenerativeModel(GEMINI_MODEL)

    # Try to ask model to return JSON mime type if supported; fallback otherwise
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
    except Exception:
        # some SDK versions / models may not support generation_config; fallback
        response = model.generate_content(prompt)

    raw = (getattr(response, "text", None) or "").strip()

    try:
        data = _extract_json_from_text(raw)
    except Exception as e:
        # as a last resort, attempt very simple fallback: ask model again with stricter prompt
        # but avoid loops — return safe defaults instead
        # log / raise to let caller decide; here we raise
        raise RuntimeError("Failed to parse AI response as JSON: " + str(e))

    summary = (data.get("summary") or "").strip()
    intent_raw = data.get("intent") or ""
    reply = (data.get("reply") or "").strip()
    # allow AI to optionally provide a priority hint
    priority_hint = data.get("priority") or data.get("priority_hint") or None

    # normalize intent casing & mapping
    final_intent = map_to_allowed_intent(intent_raw, subject, body, priority_hint)

    # fallback content defaults
    if not summary:
        summary = (body[:200] + "...") if body else "No summary available."

    if not reply:
        # If missing details, ask a specific follow-up question
        reply = "Thanks — could you please share a few more details so I can help (e.g. dates, account, or specific steps)?"

    return summary, final_intent, reply











# import json
# import re
# import google.generativeai as genai
# from config import GEMINI_API_KEY, GEMINI_MODEL

# genai.configure(api_key=GEMINI_API_KEY)

# ALLOWED_INTENTS = [
#     "MEETING",
#     "FOLLOWUP",
#     "URGENT",
#     "INVESTOR",
#     "LEAD",
#     "PARTNERSHIP",
#     "HIRING",
#     "BILLING",
#     "OTHER",
# ]

# SYSTEM_PROMPT = """ ... (same as your original) ... """

# def build_user_prompt(subject, body, tone, language):
#     subject = subject or "(no subject)"
#     body = body or ""

#     if len(body) > 5000:
#         body = body[:5000] + "\n\n[TRUNCATED]"

#     lang_rule = "Reply in the same language as the email." if language == "auto" else f"Reply in {language}."

#     return f"""
# Email Subject:
# {subject}

# Email Body:
# {body}

# Tone preference: {tone}
# Language rule: {lang_rule}

# Return ONLY a JSON object with keys: summary, intent, reply.
# """

# def _safe_extract_json(raw):
#     raw = (raw or "").strip()
#     raw = raw.replace("```json", "").replace("```", "").strip()

#     # direct load
#     try:
#         return json.loads(raw)
#     except:
#         pass

#     # regex json
#     match = re.search(r"\{(?:[^{}]|(?R))*\}", raw, flags=re.DOTALL)
#     if match:
#         return json.loads(match.group(0))

#     raise RuntimeError(f"Gemini invalid JSON: {raw}")

# def fallback_intent_detection(text):
#     t = (text or "").lower()

#     if any(w in t for w in ["price", "quote", "project", "proposal", "estimate"]):
#         return "LEAD"
#     if any(w in t for w in ["upgrade", "renew", "plan", "subscription"]):
#         return "SALES"
#     if any(w in t for w in ["partner", "integrate", "affiliate"]):
#         return "PARTNERSHIP"
#     if any(w in t for w in ["invest", "funding", "pitch"]):
#         return "INVESTOR"
#     if any(w in t for w in ["career", "job", "cv", "apply"]):
#         return "HIRING"
#     if any(w in t for w in ["invoice", "payment", "refund"]):
#         return "BILLING"
#     if any(w in t for w in ["bug", "error", "crash"]):
#         return "BUG_REPORT"
#     if any(w in t for w in ["feature", "request"]):
#         return "FEATURE_REQUEST"
#     if any(w in t for w in ["issue", "help"]):
#         return "SUPPORT"
#     if any(w in t for w in ["meeting", "schedule"]):
#         return "MEETING"
#     if any(w in t for w in ["follow up", "reminder"]):
#         return "FOLLOWUP"
#     if any(w in t for w in ["newsletter", "update"]):
#         return "NEWSLETTER"
#     if any(w in t for w in ["lottery", "crypto", "click"]):
#         return "SPAM"
#     if "?" in t:
#         return "QUESTION"
#     return "OTHER"

# def analyze_email(subject, body, tone="friendly", language="auto"):
#     prompt = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(subject, body, tone, language)}"
#     model = genai.GenerativeModel(GEMINI_MODEL)

#     response = model.generate_content(
#         prompt,
#         generation_config={"response_mime_type": "application/json"}
#     )

#     raw = (response.text or "").strip()
#     data = _safe_extract_json(raw)

#     summary = (data.get("summary") or "").strip()
#     intent = (data.get("intent") or "").strip().upper()
#     reply = (data.get("reply") or "").strip()

#     if intent not in ALLOWED_INTENTS:
#         intent = fallback_intent_detection(body)

#     if not summary:
#         summary = (body[:200] + "...") if body else "No summary available."

#     if not reply:
#         reply = "Thank you for your email. Could you share more details so I can help?"

#     return summary, intent, reply


























































# import json
# import re
# import google.generativeai as genai
# from config import GEMINI_API_KEY, GEMINI_MODEL

# genai.configure(api_key=GEMINI_API_KEY)

# ALLOWED_INTENTS = [
#     "LEAD",
#     "SALES",
#     "PARTNERSHIP",
#     "INVESTOR",
#     "SUPPORT",
#     "BUG_REPORT",
#     "FEATURE_REQUEST",
#     "BILLING",
#     "MEETING",
#     "FOLLOWUP",
#     "QUESTION",
#     "HIRING",
#     "NEWSLETTER",
#     "PERSONAL",
#     "SPAM",
#     "OTHER",
# ]

# SYSTEM_PROMPT = """
# You are an AI email assistant for a startup founder and software developer.

# You MUST:
# - Read the email subject and body.
# - Use ONLY information that is clearly present in the email.
# - If information is missing (dates, prices, links, details), DO NOT invent it.
# - If needed, ask follow-up questions instead of guessing.

# Your tasks:

# 1. "summary":
#    - Summarize the email in 1–3 short sentences.
#    - Use only facts from the email.

# 2. "intent":
#    - Classify the main intent as ONE of:
#      [LEAD, SALES, PARTNERSHIP, INVESTOR,
#       SUPPORT, BUG_REPORT, FEATURE_REQUEST, BILLING,
#       MEETING, FOLLOWUP, QUESTION,
#       HIRING, NEWSLETTER, PERSONAL, SPAM, OTHER].

#    Guidelines:
#    - LEAD: New potential customer, wants to work with us, demo, proposal, quote, project enquiry.
#    - SALES: Existing user/customer asking about pricing, upgrading, renewing, or adding seats/usage.
#    - PARTNERSHIP: Collaboration, integration, affiliate, joint venture, co-marketing.
#    - INVESTOR: Angels, VCs, fundraising, pitch decks, investing.
#    - SUPPORT: Needs help using the product but not clearly a bug (how-to, confused about feature).
#    - BUG_REPORT: Error messages, crashes, “not working”, clear broken behaviour.
#    - FEATURE_REQUEST: Requests for new features or improvements.
#    - BILLING: Invoices, receipts, payment failed, refunds, billing address, subscription charges.
#    - MEETING: Scheduling or rescheduling a call, meeting, calendar invite.
#    - FOLLOWUP: Checking in, “just following up”, reminders on previous messages.
#    - QUESTION: General question not clearly support/bug/billing.
#    - HIRING: Job applications, recruiting, interview-related mails.
#    - NEWSLETTER: Bulk updates, product announcements, marketing/newsletter content.
#    - PERSONAL: Non-work, social, friends/family, clearly not about the business.
#    - SPAM: Scam, obvious spam, suspicious offers, generic promotions.
#    - OTHER: Anything that does not clearly fit above.

# 3. "reply":
#    - Draft a reply to the email.
#    - Be polite, concise, and professional.
#    - Use the requested tone and language provided in the prompt.
#    - If important details are missing, clearly ask for those instead of guessing.
#    - Do NOT make promises that are not mentioned in the email or in the prompt.

# Output format (VERY IMPORTANT):
# - Return ONLY a single JSON object.
# - NO markdown, NO extra text, NO explanations.
# - Keys: summary (string), intent (string), reply (string).
# """

# def build_user_prompt(subject: str, body: str, tone: str, language: str) -> str:
#     subject = subject or "(no subject)"
#     body = body or ""

#     if len(body) > 8000:
#         body = body[:8000] + "\n\n[TRUNCATED]"

#     lang_rule = (
#         "Reply in the same language as the email."
#         if language == "auto"
#         else f"Reply in {language}."
#     )

#     return f"""
# Email Subject:
# {subject}

# Email Body:
# {body}

# Tone preference: {tone}
# Language rule for reply: {lang_rule}

# Return ONLY a JSON object with keys: summary, intent, reply.
# """

# def _safe_extract_json(raw: str) -> dict:
#     raw = (raw or "").strip()
#     raw = raw.replace("```json", "").replace("```", "").strip()

#     try:
#         return json.loads(raw)
#     except Exception:
#         pass

#     match = re.search(r"\{.*\}", raw, flags=re.DOTALL)
#     if match:
#         candidate = match.group(0)
#         return json.loads(candidate)

#     raise RuntimeError("Gemini response is not valid JSON:\n" + raw)

# def fallback_intent_detection(text: str) -> str:
#     t = (text or "").lower()

#     if any(w in t for w in ["price", "quote", "project", "proposal", "estimate", "work with you", "demo"]):
#         return "LEAD"
#     if any(w in t for w in ["upgrade", "renew", "plan", "subscription", "license", "seats"]):
#         return "SALES"
#     if any(w in t for w in ["partner", "partnership", "integrate", "integration", "co-marketing", "affiliate"]):
#         return "PARTNERSHIP"
#     if any(w in t for w in ["invest", "investment", "round", "funding", "pitch deck", "term sheet"]):
#         return "INVESTOR"
#     if any(w in t for w in ["career", "job", "role", "position", "cv", "resume", "linkedin", "apply"]):
#         return "HIRING"
#     if any(w in t for w in ["invoice", "payment", "receipt", "bill", "due", "overdue", "charged", "refund"]):
#         return "BILLING"
#     if any(w in t for w in ["bug", "error", "crash", "stack trace", "exception", "not working", "fails", "broken"]):
#         return "BUG_REPORT"
#     if any(w in t for w in ["feature", "request", "could you add", "would be great if", "roadmap"]):
#         return "FEATURE_REQUEST"
#     if any(w in t for w in ["cannot", "can't", "help", "support", "issue", "problem", "confused"]):
#         return "SUPPORT"
#     if any(w in t for w in ["meeting", "call", "zoom", "google meet", "teams", "schedule", "reschedule", "calendar"]):
#         return "MEETING"
#     if any(w in t for w in ["following up", "follow up", "just checking in", "gentle reminder"]):
#         return "FOLLOWUP"
#     if any(w in t for w in ["unsubscribe", "newsletter", "update from", "product update", "release notes"]):
#         return "NEWSLETTER"
#     if any(w in t for w in ["win", "winner", "jackpot", "lottery", "click this link", "investment opportunity", "crypto"]):
#         return "SPAM"
#     if "?" in t:
#         return "QUESTION"

#     return "OTHER"

# def analyze_email(subject: str, body: str, tone: str = "friendly", language: str = "auto"):
#     prompt = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(subject, body, tone, language)}"

#     model = genai.GenerativeModel(GEMINI_MODEL)

#     # If your SDK supports it, this is better:
#     # response = model.generate_content(
#     #     prompt,
#     #     generation_config={"response_mime_type": "application/json"},
#     # )
#     # raw = (response.text or "").strip()

#     response = model.generate_content(prompt)
#     raw = (response.text or "").strip()

#     data = _safe_extract_json(raw)

#     summary = (data.get("summary") or "").strip()
#     intent = (data.get("intent") )
#     reply = (data.get("reply") or "").strip()

#     if intent not in ALLOWED_INTENTS:
#         intent = fallback_intent_detection(body)

#     if not summary:
#         summary = body[:200] + "..." if body else ""

#     if not reply:
#         reply = "Thank you for your email. Could you please share a few more details so I can assist you better?"

#     return summary, intent, reply












