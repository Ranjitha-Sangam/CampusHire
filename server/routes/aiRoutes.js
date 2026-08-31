const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { placementMentor, generalPlacementMentor,
} = require("../controllers/aiController");


// General AI Mentor
router.post(
  "/mentor", authMiddleware, generalPlacementMentor
);


// Company-specific Placement Mentor
router.post(
  "/placement-mentor/:companyId",
  authMiddleware, placementMentor
);

module.exports = router;