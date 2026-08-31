const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createCompany,getAllCompanies,getCompanyById,updateCompany,
  deleteCompany, getRecommendedCompanies,
} = require("../controllers/companyController");

router.post("/", authMiddleware, adminMiddleware, createCompany);
router.get("/", getAllCompanies);
router.get("/recommended", authMiddleware, getRecommendedCompanies);
router.get("/:id", getCompanyById);
router.put("/:id", authMiddleware, adminMiddleware, updateCompany);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCompany);

module.exports = router;
