// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

 
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("🔍 Decoded JWT:", decoded);


    const userId = decoded.userId;   

    if (!userId) {
      return res.status(401).json({ message: "Invalid token - missing userId" });
    }

    
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }


    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
