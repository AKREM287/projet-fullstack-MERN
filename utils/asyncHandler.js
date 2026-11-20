// Évite un try/catch dans chaque contrôleur : toute erreur part au middleware d'erreurs.
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
