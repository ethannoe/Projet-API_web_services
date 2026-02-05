const Group = require("../models/Group");
const Thread = require("../models/Thread");
const { creationGroupeSchema } = require("../validators/groupValidator");
const { reponseSucces } = require("../utils/response");

const estAdmin = (groupe, utilisateurId) => {
  return groupe.administrateurs.some((id) => id.toString() === utilisateurId.toString());
};

const estMembre = (groupe, utilisateurId) => {
  return groupe.membres.some((id) => id.toString() === utilisateurId.toString());
};

const creerGroupe = async (req, res, next) => {
  try {
    const { error, value } = creationGroupeSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const groupe = await Group.create({
      ...value,
      membres: [req.utilisateur._id],
      administrateurs: [req.utilisateur._id]
    });

    const fil = await Thread.create({
      type: "groupe",
      groupe: groupe._id
    });

    groupe.filDiscussion = fil._id;
    await groupe.save();

    return reponseSucces(res, "Groupe créé.", groupe, 201);
  } catch (error) {
    next(error);
  }
};

const listerGroupes = async (_req, res, next) => {
  try {
    const groupes = await Group.find().populate("administrateurs", "prenom nom");
    return reponseSucces(res, "Groupes récupérés.", groupes);
  } catch (error) {
    next(error);
  }
};

const recupererGroupe = async (req, res, next) => {
  try {
    const groupe = await Group.findById(req.params.id)
      .populate("membres", "prenom nom")
      .populate("administrateurs", "prenom nom")
      .populate("demandesEnAttente", "prenom nom");

    if (!groupe) {
      return next(Object.assign(new Error("Groupe introuvable."), { statut: 404 }));
    }

    return reponseSucces(res, "Groupe récupéré.", groupe);
  } catch (error) {
    next(error);
  }
};

const rejoindreGroupe = async (req, res, next) => {
  try {
    const groupe = await Group.findById(req.params.id);
    if (!groupe) {
      return next(Object.assign(new Error("Groupe introuvable."), { statut: 404 }));
    }

    if (estMembre(groupe, req.utilisateur._id)) {
      return next(Object.assign(new Error("Vous êtes déjà membre."), { statut: 400 }));
    }

    if (groupe.type === "public") {
      groupe.membres.push(req.utilisateur._id);
      await groupe.save();
      return reponseSucces(res, "Adhésion au groupe confirmée.", groupe);
    }

    if (groupe.demandesEnAttente.some((id) => id.toString() === req.utilisateur._id.toString())) {
      return next(Object.assign(new Error("Demande déjà envoyée."), { statut: 400 }));
    }

    groupe.demandesEnAttente.push(req.utilisateur._id);
    await groupe.save();

    return reponseSucces(res, "Demande envoyée aux administrateurs.", groupe);
  } catch (error) {
    next(error);
  }
};

const validerDemande = async (req, res, next) => {
  try {
    const groupe = await Group.findById(req.params.id);
    if (!groupe) {
      return next(Object.assign(new Error("Groupe introuvable."), { statut: 404 }));
    }

    if (!estAdmin(groupe, req.utilisateur._id)) {
      return next(Object.assign(new Error("Action réservée aux administrateurs."), { statut: 403 }));
    }

    const utilisateurId = req.params.userId;
    const demandeIndex = groupe.demandesEnAttente.findIndex((id) => id.toString() === utilisateurId);

    if (demandeIndex === -1) {
      return next(Object.assign(new Error("Demande introuvable."), { statut: 404 }));
    }

    groupe.demandesEnAttente.splice(demandeIndex, 1);
    if (!estMembre(groupe, utilisateurId)) {
      groupe.membres.push(utilisateurId);
    }

    await groupe.save();

    return reponseSucces(res, "Membre ajouté au groupe.", groupe);
  } catch (error) {
    next(error);
  }
};

const retirerMembre = async (req, res, next) => {
  try {
    const groupe = await Group.findById(req.params.id);
    if (!groupe) {
      return next(Object.assign(new Error("Groupe introuvable."), { statut: 404 }));
    }

    if (!estAdmin(groupe, req.utilisateur._id)) {
      return next(Object.assign(new Error("Action réservée aux administrateurs."), { statut: 403 }));
    }

    const utilisateurId = req.params.userId;

    const estDernierMembre =
      groupe.membres.length === 1 &&
      groupe.membres[0].toString() === utilisateurId.toString();
    if (estDernierMembre) {
      return next(
        Object.assign(new Error("Le groupe doit conserver au moins un membre."), { statut: 409 })
      );
    }

    const estDernierAdmin =
      groupe.administrateurs.length === 1 &&
      groupe.administrateurs[0].toString() === utilisateurId.toString();
    if (estDernierAdmin) {
      return next(
        Object.assign(new Error("Le groupe doit conserver au moins un administrateur."), { statut: 409 })
      );
    }

    groupe.membres = groupe.membres.filter((id) => id.toString() !== utilisateurId);
    groupe.administrateurs = groupe.administrateurs.filter((id) => id.toString() !== utilisateurId);
    groupe.demandesEnAttente = groupe.demandesEnAttente.filter((id) => id.toString() !== utilisateurId);

    await groupe.save();

    return reponseSucces(res, "Membre retiré du groupe.", groupe);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  creerGroupe,
  listerGroupes,
  recupererGroupe,
  rejoindreGroupe,
  validerDemande,
  retirerMembre
};
