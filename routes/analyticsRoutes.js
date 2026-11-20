const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { bloodGroupDetails } = require("../controllers/analyticsController");

const router = express.Router();
router.get("/bloodGroups-data", protect, restrictTo("organisation"), bloodGroupDetails);

module.exports = router;
