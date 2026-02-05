const Thread = require("../models/Thread");
const Message = require("../models/Message");
const Group = require("../models/Group");
const Event = require("../models/Event");
const { creationFilSchema, messageSchema } = require("../validators/threadValidator");
const { reponseSucces } = require("../utils/response");

const verifierAccesFil = async (fil, utilisateurId) => {
  if (fil.type === "groupe") {
    const groupe = await Group.findById(fil.groupe);
    if (!groupe) return false;
    return groupe.membres.some((id) => id.toString() === utilisateurId.toString());
  }

  if (fil.type === "evenement") {
    const evenement = await Event.findById(fil.evenement);
    if (!evenement) return false;
    return evenement.participants.some((id) => id.toString() === utilisateurId.toString());
  }

  return false;
};

const creerFil = async (req, res, next) => {
  try {
    const { error, value } = creationFilSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    if (value.type === "groupe") {
      const groupe = await Group.findById(value.groupe);
      if (!groupe) {
        return next(Object.assign(new Error("Groupe introuvable."), { statut: 404 }));
      }
      const estMembre = groupe.membres.some((id) => id.toString() === req.utilisateur._id.toString());
      if (!estMembre) {
        return next(Object.assign(new Error("Accès refusé."), { statut: 403 }));
      }
    }

    if (value.type === "evenement") {
      const evenement = await Event.findById(value.evenement);
      if (!evenement) {
        return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
      }
      const estParticipant = evenement.participants.some((id) => id.toString() === req.utilisateur._id.toString());
      if (!estParticipant) {
        return next(Object.assign(new Error("Accès refusé."), { statut: 403 }));
      }
    }

    const fil = await Thread.create(value);
    return reponseSucces(res, "Fil de discussion créé.", fil, 201);
  } catch (error) {
    next(error);
  }
};

const recupererFil = async (req, res, next) => {
  try {
    const fil = await Thread.findById(req.params.id);
    if (!fil) {
      return next(Object.assign(new Error("Fil introuvable."), { statut: 404 }));
    }

    const acces = await verifierAccesFil(fil, req.utilisateur._id);
    if (!acces) {
      return next(Object.assign(new Error("Accès refusé."), { statut: 403 }));
    }

    return reponseSucces(res, "Fil récupéré.", fil);
  } catch (error) {
    next(error);
  }
};

const ajouterMessage = async (req, res, next) => {
  try {
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const fil = await Thread.findById(req.params.id);
    if (!fil) {
      return next(Object.assign(new Error("Fil introuvable."), { statut: 404 }));
    }

    const acces = await verifierAccesFil(fil, req.utilisateur._id);
    if (!acces) {
      return next(Object.assign(new Error("Accès refusé."), { statut: 403 }));
    }

    const message = await Message.create({
      fil: fil._id,
      auteur: req.utilisateur._id,
      contenu: value.contenu,
      reponseA: value.reponseA
    });

    return reponseSucces(res, "Message ajouté.", message, 201);
  } catch (error) {
    next(error);
  }
};

const listerMessages = async (req, res, next) => {
  try {
    const fil = await Thread.findById(req.params.id);
    if (!fil) {
      return next(Object.assign(new Error("Fil introuvable."), { statut: 404 }));
    }

    const acces = await verifierAccesFil(fil, req.utilisateur._id);
    if (!acces) {
      return next(Object.assign(new Error("Accès refusé."), { statut: 403 }));
    }

    const messages = await Message.find({ fil: fil._id })
      .populate("auteur", "prenom nom")
      .sort({ dateCreation: -1 });

    return reponseSucces(res, "Messages récupérés.", messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  creerFil,
  recupererFil,
  ajouterMessage,
  listerMessages
};
