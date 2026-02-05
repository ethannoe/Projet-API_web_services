const mongoose = require("mongoose");

const shoppingItemSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Evenement", required: true },
  nom: { type: String, required: true, trim: true },
  quantite: { type: Number, required: true, min: 1 },
  creePar: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  dateCreation: { type: Date, default: Date.now }
});

shoppingItemSchema.index({ evenement: 1, nom: 1 }, { unique: true });

module.exports = mongoose.model("ShoppingItem", shoppingItemSchema);
