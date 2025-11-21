import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    picture: { type: String },

    googleId: { type: String }, // Google unique id

    // Gmail tokens
    googleAccessToken: { type: String },
    googleRefreshToken: { type: String },
    googleTokenExpiry: { type: Date },

    // app settings
    defaultTone: { type: String, default: "friendly" },
    autoSend: { type: Boolean, default: false },
    followupDays: { type: Number, default: 3 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
