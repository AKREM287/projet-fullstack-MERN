const mongoose = require("mongoose");
const { ROLES, BLOOD_GROUPS } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Le rôle est obligatoire"],
      enum: { values: ROLES, message: "Rôle invalide" },
    },
    // donar + admin
    name: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "donar" || this.role === "admin";
        },
        "Le nom est obligatoire",
      ],
    },
    organisationName: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "organisation";
        },
        "Le nom de l'organisation est obligatoire",
      ],
    },
    hospitalName: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === "hospital";
        },
        "Le nom de l'hôpital est obligatoire",
      ],
    },
    // groupe sanguin du donneur (facultatif)
    bloodGroup: { type: String, enum: [...BLOOD_GROUPS, null, ""] },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      select: false, // jamais renvoyé par défaut
    },
    website: { type: String, trim: true },
    address: { type: String, required: [true, "L'adresse est obligatoire"], trim: true },
    phone: { type: String, required: [true, "Le téléphone est obligatoire"], trim: true },
  },
  { timestamps: true }
);

// Nom affichable quel que soit le rôle
userSchema.virtual("displayName").get(function () {
  return this.name || this.organisationName || this.hospitalName || this.email;
});
userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.id;
    return ret;
  },
});

module.exports = mongoose.model("users", userSchema);
