const mongoose = require("mongoose");

const ticketPurchaseSchema = new mongoose.Schema({
  billetType: { type: mongoose.Schema.Types.ObjectId, ref: "TypeBillet", required: true },
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Evenement", required: true },
  prenom: { type: String, required: true, trim: true },
  nom: { type: String, required: true, trim: true },
  adresse: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  dateAchat: { type: Date, default: Date.now }
});

ticketPurchaseSchema.index({ evenement: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("AchatBillet", ticketPurchaseSchema);
