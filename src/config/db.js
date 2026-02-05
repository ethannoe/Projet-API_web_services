const mongoose = require("mongoose");

const connecterBase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("La variable MONGODB_URI est manquante.");
  }

  await mongoose.connect(uri, {
    autoIndex: true
  });

  console.log("Connexion MongoDB établie");
};

module.exports = { connecterBase };
