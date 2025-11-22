// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Token mil raha hai? (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 2) Token decode karo  (IMPORTANT CHANGE 👇)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔍 Decoded JWT:", decoded);

    //  👉 JWT me userId hai, id nahi:
    const userId = decoded.userId;   // ✔ FIXED

    if (!userId) {
      return res.status(401).json({ message: "Invalid token - missing userId" });
    }

    // 3) FULL USER laao – Gmail Refresh Token ke saath
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 4) Attach for next middleware
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
