const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerStudent,
  loginStudent,
  getProfile,
  getAllStudents,
  updateProfile,
  uploadResume,
  forgotPassword,
  resetPassword,
} = require("../controllers/studentController");
const upload = require("../middleware/upload");
// const { uploadResume } = require("../controllers/studentController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"),
  uploadResume,
);
router.get("/", authMiddleware, adminMiddleware, getAllStudents);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
