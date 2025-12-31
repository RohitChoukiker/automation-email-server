#  Inboxonic – AI-Powered Email Automation System  
### *(AI-Driven Email Intelligence System — Email Automation + NLP Classification + Dashboard Analytics)*

Inboxonic is a **production-ready, full-stack AI email automation system** that integrates deeply with Gmail, auto-classifies incoming emails using a **custom Gemini LLM pipeline**, generates smart replies, and visualizes inbox analytics on a real-time dashboard.

---

## 🔧 **Architecture Overview**

Inboxonic is built using a distributed **microservice architecture**:

### **🟦 Node.js Express Backend**
- OAuth2 Google Auth  
- Email automation workflows  
- Cron jobs for scheduled processing  
- Event logging & analytics aggregation  
- JWT-secured internal API communication  

### **🟩 FastAPI AI Microservice**
Powered by **Google Gemini (LLM)** for:
- Email summarization  
- Intent detection  
- Urgency scoring  
- Tone extraction  
- Smart reply generation  

### **🔐 Internal Security**
- Service-to-service JWT protection  
- Encrypted refresh tokens  
- CSP & CORS hardening  
- Cookie-based sessions  

---

## 🤖 **AI & NLP Pipeline**

The custom NLP engine extracts key business insights:

- Summary extraction  
- Intent classification  
- Urgency scoring  
- Tone detection  
- Auto-generated reply drafts  

Emails are normalized into **8 business-ready categories**:
- Lead  
- Hiring  
- Meeting  
- Billing  
- Investor  
- Follow-up  
- Urgent  
- Other  

Fallback logic is used when LLM confidence is low.

---

## 📨 **Gmail Automation**

Deep Gmail integration using OAuth2:

- Continuous email fetching  
- Thread detection  
- Auto-classification  
- Smart auto-reply suggestions  
- Event logging for each workflow step  
- Automatic token refresh  

---

## 📊 **Real-Time Analytics Dashboard**

The dashboard visualizes:

- 📈 Daily email volume  
- 🗂 Category-wise distribution  
- 🚨 Urgency breakdown  
- 💡 Inbox health score  

A **DailyMetrics cron engine** aggregates and stores analytics for fast dashboard loading.

---

## 🗄 **Database & Event Design (MongoDB)**

Event-driven schema featuring:

- `EmailEvent` log tracking every state  
- Indexed & deduped events for fast filtering  
- Historical metrics stored separately for optimized read performance  
- Clean separation between **real-time** and **analytics** data  

---

## 🔐 **Security Layer**

This system uses a hardened security stack:

- OAuth2 authentication  
- JWT-auth for internal APIs  
- Encrypted refresh tokens  
- CORS & CSP hardening  
- Secure cookie sessions  

---

## 🛠 **Tech Stack**

**Backend:** Node.js, Express  
**AI Microservice:** FastAPI, Google Gemini LLM  
**Database:** MongoDB  
**Integrations:** Gmail API, OAuth2  
**Infrastructure:** Cron Jobs, JWT, Event Logging  
**Other Skills:** Automation workflows, Microservices, Aggregation pipelines  

---

## 📁 **Project Features Summary**

- ✔ Production-ready architecture  
- ✔ Microservice design  
- ✔ AI/NLP pipeline with Gemini  
- ✔ Gmail automation workflows  
- ✔ Real-time dashboard analytics  
- ✔ Secure internal communication  
- ✔ Event-driven datastore  
- ✔ Highly extendable & modular  

---

## 🚀 **Future Enhancements**

- Multi-LLM routing (Gemini + OpenAI + Claude)  
- Priority-based auto-reply system  
- Smart "Inbox Health" scoring algorithm  
- User-facing rule-based automation designer  

---

## ⭐ **Support**

If you like this project, please ⭐ star the repository!  
Your support helps in improving and maintaining this open-source system.

---

## 🤝 **Contributions**

PRs, issues, and feature requests are welcome.  
Feel free to fork this project and build your own advanced AI email workflows!

---

## 🧑‍💻 **Author**

**Rohit Choukiker**  
AI Engineer • Full-Stack Developer • Automation Specialist  

---

## 📜 **License**

This project is open-source and available under the **MIT License**.

