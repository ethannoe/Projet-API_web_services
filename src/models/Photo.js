const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
  url: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Photo", photoSchema);
