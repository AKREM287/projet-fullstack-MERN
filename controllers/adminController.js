const userModel = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const listByRole = (role) =>
  asyncHandler(async (_req, res) => {
    const users = await userModel.find({ role }).sort({ createdAt: -1 });
    res.json({ success: true, total: users.length, users });
  });

// GET /admin/stats
const stats = asyncHandler(async (_req, res) => {
  const [donars, hospitals, organisations, movements, volume] = await Promise.all([
    userModel.countDocuments({ role: "donar" }),
    userModel.countDocuments({ role: "hospital" }),
    userModel.countDocuments({ role: "organisation" }),
    Inventory.countDocuments(),
    Inventory.aggregate([
      { $match: { inventoryType: "in" } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]),
  ]);
  res.json({
    success: true,
    stats: { donars, hospitals, organisations, movements, collectedMl: volume[0]?.total || 0 },
  });
});

// DELETE /admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) throw new AppError("Utilisateur introuvable", 404);
  if (user.role === "admin") throw new AppError("Un compte administrateur ne peut pas être supprimé ici", 403);

  // Une organisation supprimée emporte son historique (sinon : données orphelines)
  if (user.role === "organisation") await Inventory.deleteMany({ organisation: user._id });
  await user.deleteOne();

  res.json({ success: true, message: "Compte supprimé" });
});

module.exports = {
  getDonarsList: listByRole("donar"),
  getHospitalList: listByRole("hospital"),
  getOrgList: listByRole("organisation"),
  stats,
  deleteUser,
};
