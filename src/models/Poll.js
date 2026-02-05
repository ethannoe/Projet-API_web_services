const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Evenement", required: true },
  questions: [
    {
      question: { type: String, required: true, trim: true },
      options: [{ type: String, required: true, trim: true }]
    }
  ],
  createur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sondage", pollSchema);
