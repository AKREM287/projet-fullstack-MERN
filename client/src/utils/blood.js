export const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

// Codes couleur des étiquettes de poches de sang (système ABO)
const ABO = {
  O: { bg: "#2f6fde", fg: "#ffffff" }, // bleu
  A: { bg: "#f2b90f", fg: "#2b2100" }, // jaune
  B: { bg: "#e8639a", fg: "#ffffff" }, // rose
  AB: { bg: "#ffffff", fg: "#232b38", border: "#9aa7b5" }, // blanc
};

export const groupColor = (group = "") => ABO[group.replace(/[+-]/, "")] || ABO.O;

export const roleLabel = {
  admin: "Administrateur",
  organisation: "Organisation",
  donar: "Donneur",
  hospital: "Hôpital",
};

export const displayName = (u) =>
  u?.name || u?.organisationName || u?.hospitalName || u?.email || "";
