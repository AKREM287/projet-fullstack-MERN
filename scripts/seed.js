/**
 * Données de démonstration :  npm run seed
 * Comptes créés (mot de passe : password123)
 *   admin@demo.com · org@demo.com · hopital@demo.com · donneur@demo.com
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const { BLOOD_GROUPS } = require("../utils/constants");

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

(async () => {
  await mongoose.connect(process.env.MONGO_URL);
  const emails = ["admin@demo.com", "org@demo.com", "hopital@demo.com", "donneur@demo.com"];
  const old = await User.find({ email: { $in: emails } }).select("_id");
  await Inventory.deleteMany({
    $or: [{ organisation: { $in: old } }, { donar: { $in: old } }, { hospital: { $in: old } }],
  });
  await User.deleteMany({ email: { $in: emails } });

  const password = await bcrypt.hash("password123", 10);
  const base = { password, address: "12 rue de la Santé, Paris", phone: "0612345678" };
  const [, org, hospital, donor] = await User.create([
    { ...base, role: "admin", name: "Admin Demo", email: emails[0] },
    { ...base, role: "organisation", organisationName: "Banque du Sang Centrale", email: emails[1], website: "https://exemple.org" },
    { ...base, role: "hospital", hospitalName: "Hôpital Saint-Louis", email: emails[2] },
    { ...base, role: "donar", name: "Lina Martin", email: emails[3], bloodGroup: "O+" },
  ]);

  // Plusieurs donneurs fictifs pour avoir un stock réaliste
  const extra = await User.create(
    BLOOD_GROUPS.map((g, i) => ({
      ...base, role: "donar", name: `Donneur ${g}`, email: `donneur${i}@demo.com`, bloodGroup: g,
    }))
  );
  emails.push(...extra.map((d) => d.email));

  const rows = [];
  extra.forEach((d, i) => {
    const g = BLOOD_GROUPS[i];
    rows.push({ inventoryType: "in", bloodGroup: g, quantity: 450, email: d.email, organisation: org._id, donar: d._id, createdAt: daysAgo(60 + i) });
    rows.push({ inventoryType: "in", bloodGroup: g, quantity: 400 + (i % 3) * 50, email: d.email, organisation: org._id, donar: d._id, createdAt: daysAgo(3 + i) });
  });
  rows.push({ inventoryType: "in", bloodGroup: "O+", quantity: 450, email: donor.email, organisation: org._id, donar: donor._id, createdAt: daysAgo(70) });
  rows.push({ inventoryType: "out", bloodGroup: "O+", quantity: 300, email: hospital.email, organisation: org._id, hospital: hospital._id, createdAt: daysAgo(10) });
  rows.push({ inventoryType: "out", bloodGroup: "A-", quantity: 500, email: hospital.email, organisation: org._id, hospital: hospital._id, createdAt: daysAgo(5) });
  await Inventory.insertMany(rows);

  console.log("✔ Données de démo créées. Mot de passe de tous les comptes : password123");
  console.log("  Admin        : admin@demo.com    (rôle Admin)");
  console.log("  Organisation : org@demo.com      (rôle Organisation)");
  console.log("  Hôpital      : hopital@demo.com  (rôle Hôpital)");
  console.log("  Donneur      : donneur@demo.com  (rôle Donneur)");
  await mongoose.disconnect();
})().catch((e) => {
  console.error("✖", e.message);
  process.exit(1);
});
