module.exports = {
  ROLES: ["admin", "organisation", "donar", "hospital"],
  BLOOD_GROUPS: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
  // Règles métier
  MIN_DAYS_BETWEEN_DONATIONS: 56, // don de sang total : 8 semaines
  MAX_DONATION_ML: 500, // volume maximal d'un don
  MAX_ISSUE_ML: 5000, // volume maximal d'une sortie (hôpital)
  LOW_STOCK_ML: 600, // seuil d'alerte par groupe sanguin
};
