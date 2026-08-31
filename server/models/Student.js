const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    usn: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    branch: {
      type: String,
      enum: [
        "CSE",
        "Aiml",
        "Cyber Security",
        "Robotics",
        "ISE",
        "ECE",
        "EEE",
        "ME",
        "CV",
        "MCA",
        "Biotech",
        "MBA",
        "MTECH",
      ],
      required: function () {
        return this.role === "student";
      },
    },
    cgpa: {
      type: Number,
      required: function () {
        return this.role === "student";
      },
      min: 0,
      max: 10,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    github: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
    resumeName: {
      type: String,
      default: "",
    },
    placementStatus: {
      type: String,
      enum: ["NOT_PLACED", "PLACED"],
      default: "NOT_PLACED",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
