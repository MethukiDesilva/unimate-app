const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    minutes: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["planned", "completed"],
      default: "planned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudySession", studySessionSchema);