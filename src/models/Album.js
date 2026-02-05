const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Evenement", required: true },
  nom: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Album", albumSchema);
