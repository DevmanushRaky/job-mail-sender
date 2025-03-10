const mongoose = require("mongoose");

const HrEmailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt'
);

const HrEmail = mongoose.model("HrEmail", HrEmailSchema);
module.exports = HrEmail;
