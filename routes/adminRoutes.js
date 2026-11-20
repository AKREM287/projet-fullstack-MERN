const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const c = require("../controllers/adminController");

const router = express.Router();
router.use(protect, restrictTo("admin"));

router.get("/stats", c.stats);
router.get("/donar-list", c.getDonarsList);
router.get("/hospital-list", c.getHospitalList);
router.get("/org-list", c.getOrgList);
router.delete("/users/:id", c.deleteUser);

module.exports = router;
