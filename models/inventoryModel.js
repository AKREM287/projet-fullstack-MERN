const mongoose = require("mongoose");
const { BLOOD_GROUPS, MAX_DONATION_ML, MAX_ISSUE_ML } = require("../utils/constants");

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: [true, "Le type de mouvement est obligatoire"],
      enum: ["in", "out"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Le groupe sanguin est obligatoire"],
      enum: BLOOD_GROUPS,
    },
    quantity: {
      type: Number,
      required: [true, "La quantité est obligatoire"],
      min: [1, "La quantité doit être supérieure à 0"],
      validate: [
        {
          validator: Number.isInteger,
          message: "La quantité doit être un nombre entier (ml)",
        },
        {
          validator: function (v) {
            const max = this.inventoryType === "in" ? MAX_DONATION_ML : MAX_ISSUE_ML;
            return v <= max;
          },
          message: "Quantité trop élevée pour ce type de mouvement",
        },
      ],
    },
    email: { type: String, lowercase: true, trim: true }, // email du donneur / de l'hôpital
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "out";
      },
      index: true,
    },
    donar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "in";
      },
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
