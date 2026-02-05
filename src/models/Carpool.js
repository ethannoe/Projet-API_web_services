const mongoose = require("mongoose");

const carpoolSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Evenement", required: true },
  conducteur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  pointDepart: { type: String, required: true, trim: true },
  placesTotal: { type: Number, required: true, min: 1 },
  placesRestantes: { type: Number, required: true, min: 0 },
  commentaire: { type: String, trim: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Covoiturage", carpoolSchema);
