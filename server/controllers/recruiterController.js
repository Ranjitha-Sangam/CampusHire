const Recruiter = require("../models/Recruiter");
const Company = require("../models/Company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Recruiter Registration
const registerRecruiter = async (req, res) => {
  try {
    const { name, email, password, companyId } = req.body;

    // Check all fields
    if (!name || !email || !password || !companyId) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if company exists
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });

    if (existingRecruiter) {
      return res.status(400).json({
        message: "Recruiter already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create recruiter
    const recruiter = new Recruiter({
      name,
      email,
      password: hashedPassword,
      company: companyId,
    });

    await recruiter.save();

    return res.status(201).json({
      message: "Recruiter registered successfully",
      recruiter: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company,
      },
    });
  } catch (error) {
    console.error("Recruiter registration error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Recruiter Login
const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find recruiter
    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, recruiter.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check recruiter approval status
    if (recruiter.status === "Pending") {
      return res.status(403).json({
        message:
          "Your recruiter account is pending approval from the placement officer.",
      });
    }

    if (recruiter.status === "Rejected") {
      return res.status(403).json({
        message: "Your recruiter registration has been rejected.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: recruiter._id,
        role: "recruiter",
        companyId: recruiter.company,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Recruiter login successful",
      token,
      recruiter: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company,
      },
    });
  } catch (error) {
    console.error("Recruiter login error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// Get all pending recruiters
const getPendingRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find({
      status: "Pending",
    }).populate("company", "companyName");

    return res.status(200).json({
      recruiters,
    });
  } catch (error) {
    console.error("Failed to fetch pending recruiters:", error);

    return res.status(500).json({
      message: "Failed to fetch pending recruiters",
    });
  }
};


// Approve or reject recruiter
const updateRecruiterStatus = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid recruiter status",
      });
    }

    const recruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      { status },
      { new: true },
    );

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    return res.status(200).json({
      message: `Recruiter ${status.toLowerCase()} successfully`,
      recruiter,
    });
  } catch (error) {
    console.error("Failed to update recruiter status:", error);

    return res.status(500).json({
      message: "Failed to update recruiter status",
    });
  }
};

module.exports = {
  registerRecruiter,
  loginRecruiter,
  getPendingRecruiters,
  updateRecruiterStatus,
};
