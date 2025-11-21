import requests

url = "http://localhost:8000/analyze-email"

payload = {
    "subject": "Partnership inquiry",
    "body": "Hi, we love your product. Can we schedule a call next week to discuss a potential partnership?",
    "tone": "friendly",
    "language": "auto"
}

res = requests.post(url, json=payload)
print(res.status_code)
print(res.json())
