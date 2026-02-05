const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icone: { type: String, required: true, trim: true },
  photoCouverture: { type: String, required: true, trim: true },
  type: { type: String, enum: ["public", "prive", "secret"], default: "public" },
  autoriserPublicationMembres: { type: Boolean, default: true },
  autoriserCreationEvenementsMembres: { type: Boolean, default: false },
  membres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" }],
  administrateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" }],
  demandesEnAttente: [{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" }],
  filDiscussion: { type: mongoose.Schema.Types.ObjectId, ref: "FilDiscussion" },
  dateCreation: { type: Date, default: Date.now }
});

groupSchema.pre("validate", function (next) {
  if (!Array.isArray(this.membres) || this.membres.length === 0) {
    const erreur = new Error("Un groupe doit contenir au moins un membre.");
    erreur.statut = 400;
    return next(erreur);
  }

  if (!Array.isArray(this.administrateurs) || this.administrateurs.length === 0) {
    const erreur = new Error("Un groupe doit contenir au moins un administrateur.");
    erreur.statut = 400;
    return next(erreur);
  }

  next();
});

module.exports = mongoose.model("Groupe", groupSchema);
