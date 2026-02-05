const mongoose = require("mongoose");

const ticketTypeSchema = new mongoose.Schema({
  evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Evenement", required: true },
  nom: { type: String, required: true, trim: true },
  prix: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TypeBillet", ticketTypeSchema);
