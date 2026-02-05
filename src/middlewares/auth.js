const jwt = require("jsonwebtoken");
const User = require("../models/User");

const proteger = async (req, _res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return next(Object.assign(new Error("Jeton manquant ou invalide."), { statut: 401 }));
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const utilisateur = await User.findById(decoded.id).select("-motDePasse");
    if (!utilisateur) {
      return next(Object.assign(new Error("Utilisateur introuvable."), { statut: 401 }));
    }

    req.utilisateur = utilisateur;
    next();
  } catch (error) {
    next(Object.assign(new Error("Authentification échouée."), { statut: 401 }));
  }
};

module.exports = { proteger };
