const mongoose = require("mongoose");

const pollResponseSchema = new mongoose.Schema({
  sondage: { type: mongoose.Schema.Types.ObjectId, ref: "Sondage", required: true },
  participant: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  reponses: [
    {
      questionIndex: { type: Number, required: true, min: 0 },
      optionChoisie: { type: String, required: true, trim: true }
    }
  ],
  dateCreation: { type: Date, default: Date.now }
});

pollResponseSchema.index({ sondage: 1, participant: 1 }, { unique: true });

module.exports = mongoose.model("ReponseSondage", pollResponseSchema);
