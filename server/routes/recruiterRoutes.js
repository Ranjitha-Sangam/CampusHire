const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  registerRecruiter,
  loginRecruiter,
  getPendingRecruiters,
  updateRecruiterStatus,
} = require("../controllers/recruiterController");

// Register recruiter
router.post("/register", registerRecruiter);

// Recruiter login
router.post("/login", loginRecruiter);

// Get all pending recruiter requests
router.get("/pending", authMiddleware, adminMiddleware, getPendingRecruiters);

// Approve or reject recruiter
router.put(
  "/:recruiterId/status",
  authMiddleware,
  adminMiddleware,
  updateRecruiterStatus,
);

module.exports = router;
