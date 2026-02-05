const dotenv = require("dotenv");
const app = require("./app");
const { connecterBase } = require("./config/db");

dotenv.config();

const PORT = process.env.PORT || 4000;

const demarrer = async () => {
  await connecterBase();
  app.listen(PORT, () => {
    // Message volontairement en français
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
};

demarrer();
