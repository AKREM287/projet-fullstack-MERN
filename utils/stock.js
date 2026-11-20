const mongoose = require("mongoose");
const Inventory = require("../models/inventoryModel");
const { BLOOD_GROUPS, LOW_STOCK_ML } = require("./constants");

/**
 * Stock par groupe sanguin pour une organisation, en UNE seule requête.
 * Retourne toujours les 8 groupes (même ceux à 0).
 */
async function getStockByGroup(organisationId) {
  const rows = await Inventory.aggregate([
    { $match: { organisation: new mongoose.Types.ObjectId(organisationId) } },
    {
      $group: {
        _id: { bloodGroup: "$bloodGroup", type: "$inventoryType" },
        total: { $sum: "$quantity" },
      },
    },
  ]);
  const sum = (group, type) =>
    rows.find((r) => r._id.bloodGroup === group && r._id.type === type)?.total || 0;

  return BLOOD_GROUPS.map((bloodGroup) => {
    const totalIn = sum(bloodGroup, "in");
    const totalOut = sum(bloodGroup, "out");
    const available = totalIn - totalOut;
    return { bloodGroup, totalIn, totalOut, available, low: available < LOW_STOCK_ML };
  });
}

async function getAvailable(organisationId, bloodGroup) {
  const all = await getStockByGroup(organisationId);
  return all.find((g) => g.bloodGroup === bloodGroup).available;
}

module.exports = { getStockByGroup, getAvailable };
