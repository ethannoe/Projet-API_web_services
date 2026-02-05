const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true, trim: true },
  nom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  motDePasse: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Utilisateur", userSchema);
