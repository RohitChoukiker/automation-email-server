import requests

url = "http://localhost:8000/analyze-email"

payload = {
  "subject": "Thank you!",
  "body": "Really appreciate your help with this.",
  "tone": "grateful",
  "language": "auto"
}




res = requests.post(url, json=payload)
print(res.status_code)
print(res.json())
