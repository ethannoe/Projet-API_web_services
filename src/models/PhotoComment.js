const mongoose = require("mongoose");

const photoCommentSchema = new mongoose.Schema({
  photo: { type: mongoose.Schema.Types.ObjectId, ref: "Photo", required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  contenu: { type: String, required: true, trim: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CommentairePhoto", photoCommentSchema);
