import mongoose from "mongoose";
import crypto from "crypto";

const ALGO = "aes-256-gcm";

function encryptToken(text) {
  if (!text) return null;

 
  const ENC_SECRET = process.env.TOKEN_ENCRYPTION_KEY;
  if (!ENC_SECRET) {
    console.warn("TOKEN_ENCRYPTION_KEY missing – token not encrypted");
    return text; 
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGO,
    Buffer.from(ENC_SECRET, "hex"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decryptToken(encrypted) {
  if (!encrypted) return null;

  const ENC_SECRET = process.env.TOKEN_ENCRYPTION_KEY;
  if (!ENC_SECRET) {
    console.warn("TOKEN_ENCRYPTION_KEY missing – token not decrypted");
    return encrypted; 
  }

  const [ivHex, authTagHex, encText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(
    ALGO,
    Buffer.from(ENC_SECRET, "hex"),
    iv
  );
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}


const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    picture: { type: String },

    googleId: { type: String, select: false, unique: true },

    googleAccessToken: { type: String, select: false },
    googleRefreshToken: { type: String, select: false },
    googleTokenExpiry: { type: Date, select: false },

    defaultTone: { type: String, default: "friendly" },
    autoSend: { type: Boolean, default: false },
    followupDays: { type: Number, default: 3 },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.isModified("googleAccessToken") && this.googleAccessToken) {
    this.googleAccessToken = encryptToken(this.googleAccessToken);
  }
  if (this.isModified("googleRefreshToken") && this.googleRefreshToken) {
    this.googleRefreshToken = encryptToken(this.googleRefreshToken);
  }
  next();
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.googleAccessToken;
    delete ret.googleRefreshToken;
    delete ret.googleTokenExpiry;
    delete ret.googleId;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
