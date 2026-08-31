const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "OA Sent","Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index(
    { student: 1, company: 1 },
    { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);
