const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getRecruiterApplications,
  updateRecruiterApplicationStatus,
  sendOALink,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const recruiterAuthMiddleware = require("../middleware/recruiterAuthMiddleware");

//recruiter get all aplication applied to their compnay
router.get("/recruiter", recruiterAuthMiddleware, getRecruiterApplications);

// Recruiter updates application status
router.put(
  "/recruiter/:applicationId/status",
  recruiterAuthMiddleware, updateRecruiterApplicationStatus,
);

//to send OA LINK for studnets
router.post("/recruiter/send-oa", recruiterAuthMiddleware, sendOALink);

// Apply for a job
router.post("/apply/:companyId", authMiddleware, applyForJob);

// Get all applications of logged-in student
router.get("/my-applications", authMiddleware, getMyApplications);

//Get all applications (fetched by admin)
router.get("/", authMiddleware, adminMiddleware, getAllApplications);

//update application Status
router.put(
  "/:applicationId/status",
  authMiddleware,
  adminMiddleware,
  updateApplicationStatus,
);

module.exports = router;
