const Inventory = require("../models/inventoryModel");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { getAvailable } = require("../utils/stock");
const {
  BLOOD_GROUPS, MIN_DAYS_BETWEEN_DONATIONS,
} = require("../utils/constants");

const DAY = 24 * 60 * 60 * 1000;

const populateAll = (q) =>
  q
    .populate("donar", "name email phone bloodGroup")
    .populate("hospital", "hospitalName email phone")
    .populate("organisation", "organisationName email phone address");

/**
 * POST /inventory/create-inventory   (organisation)
 *  - "in"  : entrée = don d'un donneur existant (email du donneur)
 *  - "out" : sortie = livraison à un hôpital existant (email de l'hôpital)
 */
const createInventory = asyncHandler(async (req, res) => {
  const { email, inventoryType, bloodGroup } = req.body;
  const quantity = Number(req.body.quantity);
  const org = req.user;

  if (!["in", "out"].includes(inventoryType)) throw new AppError("Type de mouvement invalide");
  if (!BLOOD_GROUPS.includes(bloodGroup)) throw new AppError("Groupe sanguin invalide");
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError("La quantité doit être un entier positif (ml)");
  }
  if (!email) throw new AppError("L'email est obligatoire");

  const targetRole = inventoryType === "in" ? "donar" : "hospital";
  const target = await userModel.findOne({ email: String(email).toLowerCase().trim() });
  if (!target) throw new AppError("Aucun compte trouvé avec cet email", 404);
  if (target.role !== targetRole) {
    throw new AppError(
      inventoryType === "in"
        ? "Cet email n'est pas celui d'un compte donneur"
        : "Cet email n'est pas celui d'un compte hôpital"
    );
  }

  const record = { inventoryType, bloodGroup, quantity, email: target.email, organisation: org._id };

  if (inventoryType === "in") {
    // Règle médicale : délai minimum entre deux dons
    const last = await Inventory.findOne({ inventoryType: "in", donar: target._id })
      .sort({ createdAt: -1 })
      .select("createdAt");
    if (last) {
      const days = (Date.now() - last.createdAt.getTime()) / DAY;
      if (days < MIN_DAYS_BETWEEN_DONATIONS) {
        const wait = Math.ceil(MIN_DAYS_BETWEEN_DONATIONS - days);
        throw new AppError(
          `Ce donneur a déjà donné récemment. Prochain don possible dans ${wait} jour(s).`,
          409
        );
      }
    }
    record.donar = target._id;
  } else {
    // On ne peut pas sortir plus que le stock disponible
    const available = await getAvailable(org._id, bloodGroup);
    if (quantity > available) {
      throw new AppError(`Stock insuffisant : seulement ${available} ml de ${bloodGroup} disponibles`, 409);
    }
    record.hospital = target._id;
  }

  const inventory = await Inventory.create(record);
  res.status(201).json({ success: true, message: "Mouvement enregistré", inventory });
});

// GET /inventory/get-inventory?type=in|out&bloodGroup=O+   (organisation)
const getInventory = asyncHandler(async (req, res) => {
  const filter = { organisation: req.user._id };
  if (["in", "out"].includes(req.query.type)) filter.inventoryType = req.query.type;
  if (BLOOD_GROUPS.includes(req.query.bloodGroup)) filter.bloodGroup = req.query.bloodGroup;

  const inventory = await populateAll(Inventory.find(filter).sort({ createdAt: -1 }).limit(500));
  res.json({ success: true, inventory });
});

// GET /inventory/get-recent-inventory   (organisation)
const getRecentInventory = asyncHandler(async (req, res) => {
  const inventory = await populateAll(
    Inventory.find({ organisation: req.user._id }).sort({ createdAt: -1 }).limit(5)
  );
  res.json({ success: true, inventory });
});

// GET /inventory/my-records   (donar : ses dons / hospital : ses réceptions)
const getMyRecords = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "donar"
      ? { inventoryType: "in", donar: req.user._id }
      : { inventoryType: "out", hospital: req.user._id };
  const inventory = await populateAll(Inventory.find(filter).sort({ createdAt: -1 }).limit(500));
  res.json({ success: true, inventory });
});

/**
 * Partenaires d'un utilisateur avec statistiques :
 * match = filtre sur Inventory, groupField = champ à regrouper.
 */
async function partnersWithStats(match, groupField) {
  const records = await Inventory.find(match).select(`${groupField} quantity createdAt`).lean();
  const stats = new Map();
  for (const r of records) {
    const id = String(r[groupField]);
    const s = stats.get(id) || { count: 0, totalMl: 0, lastAt: null };
    s.count += 1;
    s.totalMl += r.quantity;
    if (!s.lastAt || r.createdAt > s.lastAt) s.lastAt = r.createdAt;
    stats.set(id, s);
  }
  const users = await userModel.find({ _id: { $in: [...stats.keys()] } });
  return users
    .map((u) => ({ ...u.toJSON(), ...stats.get(String(u._id)) }))
    .sort((a, b) => b.lastAt - a.lastAt);
}

// GET /inventory/get-donars   (organisation)
const getDonars = asyncHandler(async (req, res) => {
  const donars = await partnersWithStats(
    { organisation: req.user._id, inventoryType: "in" }, "donar"
  );
  res.json({ success: true, donars });
});

// GET /inventory/get-hospitals   (organisation)
const getHospitals = asyncHandler(async (req, res) => {
  const hospitals = await partnersWithStats(
    { organisation: req.user._id, inventoryType: "out" }, "hospital"
  );
  res.json({ success: true, hospitals });
});

// GET /inventory/get-organisation   (donar ou hospital)
const getOrganisations = asyncHandler(async (req, res) => {
  const match =
    req.user.role === "donar"
      ? { donar: req.user._id, inventoryType: "in" }
      : { hospital: req.user._id, inventoryType: "out" };
  const organisations = await partnersWithStats(match, "organisation");
  res.json({ success: true, organisations });
});

module.exports = {
  createInventory, getInventory, getRecentInventory, getMyRecords,
  getDonars, getHospitals, getOrganisations,
};
