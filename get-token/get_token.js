import { google } from "googleapis";
import fs from "fs";
import readline from "readline";

const CREDENTIALS = JSON.parse(
  fs.readFileSync("client_secret.json", "utf-8")
);

const { client_id, client_secret, redirect_uris } = CREDENTIALS.web;

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]    // <-- must be http://localhost:5000/api/auth/google/callback (NO ENCODE)
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log("\n➡️ Open this URL:\n" + authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPaste ONLY the CODE=... here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code.trim());
    console.log("\nACCESS TOKEN:", tokens.access_token);
    console.log("REFRESH TOKEN:", tokens.refresh_token);
    rl.close();
  } catch (err) {
    console.error("❌ Error getting tokens:", err.response?.data || err.message);
    rl.close();
  }
});
