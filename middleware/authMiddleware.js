const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Vérifie le JWT puis charge l'utilisateur depuis la base.
 * -> req.user  (document complet, sans mot de passe)
 * L'identité ne vient JAMAIS du body : impossible de l'usurper.
 */
const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) throw new AppError("Authentification requise", 401);

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Session expirée ou invalide, reconnectez-vous", 401);
  }
  const user = await userModel.findById(payload.userId);
  if (!user) throw new AppError("Ce compte n'existe plus", 401);
  req.user = user;
  next();
});

/** Restreint une route à certains rôles : restrictTo("organisation") */
const restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Accès refusé pour votre rôle", 403));
    }
    next();
  };

module.exports = { protect, restrictTo };
