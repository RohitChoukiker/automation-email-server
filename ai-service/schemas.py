from pydantic import BaseModel, Field


class EmailRequest(BaseModel):
    subject: str = Field(..., description="Email subject")
    body: str = Field(..., description="Email body content")
    tone: str = Field(
        "friendly",
        description="Reply tone, e.g. friendly/formal/salesy"
    )
    language: str = Field(
        "auto",
        description="'auto' = reply in same language as email, else specify language"
    )


class EmailResponse(BaseModel):
    summary: str
    intent: str
    reply: str
