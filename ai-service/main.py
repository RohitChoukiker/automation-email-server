
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import EmailRequest, EmailResponse
from ai_client import analyze_email

app = FastAPI(
    title="Email AI Service",
    description="API for analyzing emails",
    version="1.0.0",
)

# CORS – dev ke liye open, prod me specific origin rakhna
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Email AI Service is running!"}

@app.post("/analyze-email", response_model=EmailResponse)
def analyze_email_endpoint(req: EmailRequest):
    try:
        summary, intent, reply = analyze_email(
            subject=req.subject,
            body=req.body,
            tone=req.tone,
            language=req.language,
        )
        return EmailResponse(summary=summary, intent=intent, reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
