const notFound = (req, _res, next) => {
  const err = new Error(`Route introuvable : ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

// Gestionnaire d'erreurs central : un seul format de réponse pour toute l'API.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || "Erreur serveur";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(" · ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "Identifiant invalide";
  } else if (err.code === 11000) {
    status = 409;
    message = "Cette valeur existe déjà (email déjà utilisé ?)";
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
