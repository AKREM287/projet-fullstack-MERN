const asyncHandler = require("../utils/asyncHandler");
const Inventory = require("../models/inventoryModel");
const { getStockByGroup } = require("../utils/stock");
const { LOW_STOCK_ML } = require("../utils/constants");

// GET /analytics/bloodGroups-data   (organisation)
const bloodGroupDetails = asyncHandler(async (req, res) => {
  const bloodGroupData = await getStockByGroup(req.user._id);
  const totals = bloodGroupData.reduce(
    (t, g) => ({
      totalIn: t.totalIn + g.totalIn,
      totalOut: t.totalOut + g.totalOut,
      available: t.available + g.available,
    }),
    { totalIn: 0, totalOut: 0, available: 0 }
  );
  const movements = await Inventory.countDocuments({ organisation: req.user._id });
  res.json({
    success: true,
    bloodGroupData,
    totals: { ...totals, movements },
    lowStockThreshold: LOW_STOCK_ML,
  });
});

module.exports = { bloodGroupDetails };
