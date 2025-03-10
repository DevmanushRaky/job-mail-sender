const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  recipients: [{ type: String, required: true }],
  totalRecipients: { type: Number, required: true }, // ✅ Store total HRs
  successCount: { type: Number, default: 0 }, // ✅ Successful sent count
  failedCount: { type: Number, default: 0 }, // ✅ Failed count
  remainingHRs: { type: Number, default: 0 }, // ✅ If stopped, how many left
  attachment: { type: String },
  status: { type: String, enum: ["sent", "failed", "stopped"], required: true }, // ✅ Status without default
  errorMessage: { type: String, default: null },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mail", MailSchema);
