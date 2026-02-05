const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  type: { type: String, enum: ["groupe", "evenement"], required: true },
  groupe: { type: mongoose.Schema.Types.ObjectId, ref: "Groupe" },
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Evenement" },
  dateCreation: { type: Date, default: Date.now }
});

threadSchema.pre("validate", function (next) {
  if (this.type === "groupe") {
    if (!this.groupe || this.evenement) {
      const erreur = new Error(
        "Un fil de discussion de groupe doit être lié uniquement à un groupe."
      );
      erreur.statut = 400;
      return next(erreur);
    }
  }

  if (this.type === "evenement") {
    if (!this.evenement || this.groupe) {
      const erreur = new Error(
        "Un fil de discussion d'événement doit être lié uniquement à un événement."
      );
      erreur.statut = 400;
      return next(erreur);
    }
  }

  next();
});

module.exports = mongoose.model("FilDiscussion", threadSchema);
