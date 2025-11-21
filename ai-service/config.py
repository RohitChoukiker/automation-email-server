import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-2.5-pro-preview-03-25")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")
