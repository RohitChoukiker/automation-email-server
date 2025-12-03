// routes/auth-routes.js
import express from "express";
import { google } from "googleapis";
import User from "../models/user-model.js";
import { oauth2Client, GOOGLE_SCOPES } from "../services/googleOAuth.js";
import { generateToken } from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/google", (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: GOOGLE_SCOPES,
    });

    // Redirect directly to Google OAuth
    res.redirect(url);
    console.log("Redirecting to Google OAuth URL:", url);
  } catch (err) {
    console.error("Google auth URL error:", err.message);
    res.status(500).json({ message: "Failed to generate auth URL" });
  }
});


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

    // Redirect to frontend with token and user data
    const userData = encodeURIComponent(JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    }));

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${jwtToken}&user=${userData}`);
  } catch (err) {
    console.error("Google callback error:", err.response?.data || err.message);
    res.status(500).send("Auth error");
  }
});

// Get current authenticated user
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
      defaultTone: req.user.defaultTone,
      autoSend: req.user.autoSend,
      automationEnabled: req.user.automationEnabled,
      followupDays: req.user.followupDays,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    });
  } catch (err) {
    console.error("Get user error:", err.message);
    res.status(500).json({ message: "Failed to get user information" });
  }
});

export default router;
