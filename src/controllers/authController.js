const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { inscriptionSchema, connexionSchema } = require("../validators/authValidator");
const { reponseSucces } = require("../utils/response");

const genererJeton = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res, next) => {
  try {
    const { error, value } = inscriptionSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const existe = await User.findOne({ email: value.email });
    if (existe) {
      return next(Object.assign(new Error("Cet email est déjà utilisé."), { statut: 409 }));
    }

    const hash = await bcrypt.hash(value.motDePasse, 12);

    const utilisateur = await User.create({
      prenom: value.prenom,
      nom: value.nom,
      email: value.email,
      motDePasse: hash
    });

    const jeton = genererJeton(utilisateur._id);

    return reponseSucces(res, "Inscription réussie.", {
      utilisateur: {
        id: utilisateur._id,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email
      },
      jeton
    }, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = connexionSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const utilisateur = await User.findOne({ email: value.email });
    if (!utilisateur) {
      return next(Object.assign(new Error("Identifiants invalides."), { statut: 401 }));
    }

    const valide = await bcrypt.compare(value.motDePasse, utilisateur.motDePasse);
    if (!valide) {
      return next(Object.assign(new Error("Identifiants invalides."), { statut: 401 }));
    }

    const jeton = genererJeton(utilisateur._id);

    return reponseSucces(res, "Connexion réussie.", {
      utilisateur: {
        id: utilisateur._id,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email
      },
      jeton
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  return reponseSucces(res, "Profil récupéré.", req.utilisateur);
};

module.exports = { register, login, me };
