const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const c = require("../controllers/inventoryController");

const router = express.Router();
router.use(protect);

// Organisation
router.post("/create-inventory", restrictTo("organisation"), c.createInventory);
router.get("/get-inventory", restrictTo("organisation"), c.getInventory);
router.get("/get-recent-inventory", restrictTo("organisation"), c.getRecentInventory);
router.get("/get-donars", restrictTo("organisation"), c.getDonars);
router.get("/get-hospitals", restrictTo("organisation"), c.getHospitals);

// Donneur / Hôpital
router.get("/my-records", restrictTo("donar", "hospital"), c.getMyRecords);
router.get("/get-organisation", restrictTo("donar", "hospital"), c.getOrganisations);

module.exports = router;
