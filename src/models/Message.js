const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  fil: { type: mongoose.Schema.Types.ObjectId, ref: "FilDiscussion", required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  contenu: { type: String, required: true, trim: true },
  reponseA: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
