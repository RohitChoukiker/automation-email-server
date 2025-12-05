📧 Inboxonic – AI-Powered Email Automation System

Email Automation + NLP Classification + Smart Replies + Dashboard Analytics

Inboxonic is a production-ready, full-stack AI email automation system that deeply integrates with Gmail, automatically classifies incoming emails using a custom Gemini LLM pipeline, generates intelligent reply drafts, and visualizes inbox insights on a real-time analytics dashboard.

🚀 Features
🤖 AI & NLP Intelligence

Custom Gemini-based NLP pipeline for:

Email summary, intent, tone, urgency scoring

Auto-generated smart reply drafts

Normalizes emails into 8 business categories:
Lead, Hiring, Meeting, Billing, Investor, Follow-up, Urgent, Other

Fallback logic for uncertain LLM predictions.

🏗 Architecture Overview

A distributed, microservice-based system:

🔹 Node.js (Express) Backend

OAuth2 authentication (Google / Gmail API)

Automation workflows + smart reply suggestions

Cron-based metrics aggregation

Central event logging system

Internal API security via JWT

🔹 FastAPI AI Microservice

Gemini-powered NLP tasks

Summarization + classification

Intent + thread detection

Reply generation

🔹 Secure Communication

JWT-protected internal service-to-service API calls

Encrypted refresh tokens

Hardened CORS + CSP

📬 Gmail Automation

Full Gmail OAuth2 integration

Continuous inbox sync

Thread detection

Automatic classification

Auto-reply suggestion engine

Event logs for every workflow step

📊 Real-Time Dashboard

Track live inbox analytics using a dedicated metrics engine:

Daily email volume

Category-wise distribution

Urgency breakdown

Inbox health score

DailyMetrics cron engine for historical insights

🗄 Database Design (MongoDB)

Event-driven schema

EmailEvent log for all workflow states

Indexed + deduplicated for fast queries

Historical metrics stored separately for performance

🔐 Security

OAuth2 authentication

JWT-based session flow

Encrypted refresh tokens

Strict CORS & CSP

Protected internal APIs

🛠 Tech Stack

Frontend: React (TS)
Backend: Node.js, Express
AI Service: FastAPI, Google Gemini (LLM)
Database: MongoDB
Integrations: Gmail API, OAuth2
Other: Cron Jobs, JWT, Event Logging, Microservices
