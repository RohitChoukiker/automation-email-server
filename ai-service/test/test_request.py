import requests

url = "http://localhost:8000/analyze-email"

payload = {
  "subject": "Congratulations! You Are Our Lucky Winner",
  "body": "Your email has been selected as the grand prize winner of the International Mega Lottery. You must send your full name, address, and ID within 24 hours to claim $500,000. Verify your identity here: http://claim-secure-lottery.online/verify",
  "tone": "neutral",
  "language": "auto"
}




res = requests.post(url, json=payload)
print(res.status_code)
print(res.json())
