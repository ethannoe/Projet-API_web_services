const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  lieu: { type: String, required: true, trim: true },
  photoCouverture: { type: String, required: true, trim: true },
  visibilite: { type: String, enum: ["public", "prive"], default: "public" },
  organisateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" }],
  groupeAssocie: { type: mongoose.Schema.Types.ObjectId, ref: "Groupe" },
  options: {
    billetterieActivee: { type: Boolean, default: false },
    shoppingList: { type: Boolean, default: false },
    covoiturage: { type: Boolean, default: false }
  },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Evenement", eventSchema);
