import express from "express";
import { google } from "googleapis";
import User from "../models/user-model.js";
import { oauth2Client, GOOGLE_SCOPES } from "../services/googleOAuth.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

// STEP 1: return Google auth URL
router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GOOGLE_SCOPES,
  });

  res.json({ authUrl: url });
});

// STEP 2: Google callback
router.get("/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("No code provided");

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: profile } = await oauth2.userinfo.get();

    const googleId = profile.id;
    const email = profile.email;
    const name = profile.name;
    const picture = profile.picture;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        picture,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
      });
    } else {
      user.googleAccessToken = tokens.access_token || user.googleAccessToken;
      if (tokens.refresh_token) {
        user.googleRefreshToken = tokens.refresh_token;
      }
      if (tokens.expiry_date) {
        user.googleTokenExpiry = new Date(tokens.expiry_date);
      }
      await user.save();
    }

    const jwtToken = generateToken(user._id);

    // dev ke liye direct JSON
    return res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });

    // production me redirect bhi kar sakte:
    // res.redirect(`http://localhost:3000/oauth/callback?token=${jwtToken}`);
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).send("Auth error");
  }
});

export default router;
