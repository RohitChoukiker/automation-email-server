import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    gmailMessageId: { type: String },
    gmailThreadId: { type: String },

    from: { type: String },
    to: { type: String },
    subject: { type: String },
    body: { type: String },

    summary: { type: String },
    intent: {
      type: String,
      enum: ["LEAD", "QUESTION", "SPAM", "FOLLOWUP", "OTHER"],
      default: "OTHER",
    },
    replyDraft: { type: String },

    status: {
      type: String,
      enum: ["PENDING", "REPLIED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);
export default Email;
