const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { ROLES, BLOOD_GROUPS } = require("../utils/constants");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// POST /auth/register
const register = asyncHandler(async (req, res) => {
  // Liste blanche : on ne prend QUE ces champs (pas de mass-assignment)
  const {
    role, name, organisationName, hospitalName, email, password,
    website, address, phone, bloodGroup, adminCode,
  } = req.body;

  if (!ROLES.includes(role)) throw new AppError("Rôle invalide");
  if (!email || !password) throw new AppError("Email et mot de passe requis");
  if (String(password).length < 6) {
    throw new AppError("Le mot de passe doit contenir au moins 6 caractères");
  }
  if (bloodGroup && !BLOOD_GROUPS.includes(bloodGroup)) {
    throw new AppError("Groupe sanguin invalide");
  }

  // Un compte admin ne peut pas être créé par n'importe qui :
  // il faut connaître le code secret défini dans le .env (ADMIN_CODE).
  if (role === "admin") {
    if (!process.env.ADMIN_CODE || adminCode !== process.env.ADMIN_CODE) {
      throw new AppError("Code administrateur incorrect", 403);
    }
  }

  const exists = await userModel.exists({ email: String(email).toLowerCase().trim() });
  if (exists) throw new AppError("Un compte existe déjà avec cet email", 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    role, name, organisationName, hospitalName, email, password: hashed,
    website, address, phone, bloodGroup: role === "donar" ? bloodGroup : undefined,
  });

  res.status(201).json({ success: true, message: "Compte créé avec succès", user });
});

// POST /auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) throw new AppError("Tous les champs sont requis");

  const user = await userModel
    .findOne({ email: String(email).toLowerCase().trim() })
    .select("+password");

  // Même message pour "email inconnu", "mauvais rôle" et "mauvais mot de passe"
  const ok = user && user.role === role && (await bcrypt.compare(password, user.password));
  if (!ok) throw new AppError("Identifiants invalides", 401);

  res.json({
    success: true,
    message: "Connexion réussie",
    token: signToken(user._id),
    user, // le mot de passe est retiré par toJSON
  });
});

// GET /auth/current-user
const currentUser = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, login, currentUser };
