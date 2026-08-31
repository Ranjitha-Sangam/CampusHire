const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    package: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    eligibleBranches: {
      type: [String],
      required: true,
    },

    minimumCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    skillsRequired: {
      type: [String],
      required: true,
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company;