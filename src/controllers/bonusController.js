const Event = require("../models/Event");
const ShoppingItem = require("../models/ShoppingItem");
const Carpool = require("../models/Carpool");
const { creationShoppingSchema, creationCovoiturageSchema } = require("../validators/bonusValidator");
const { reponseSucces } = require("../utils/response");

const verifierParticipant = (evenement, utilisateurId) => {
  return evenement.participants.some((id) => id.toString() === utilisateurId.toString());
};

const creerShoppingItem = async (req, res, next) => {
  try {
    const { error, value } = creationShoppingSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const evenement = await Event.findById(req.params.id);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (!evenement.options.shoppingList) {
      return next(Object.assign(new Error("La shopping list n'est pas activée pour cet événement."), { statut: 400 }));
    }

    if (!verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const item = await ShoppingItem.create({
      evenement: evenement._id,
      nom: value.nom,
      quantite: value.quantite,
      creePar: req.utilisateur._id
    });

    return reponseSucces(res, "Article ajouté à la shopping list.", item, 201);
  } catch (error) {
    next(error);
  }
};

const listerShoppingItems = async (req, res, next) => {
  try {
    const evenement = await Event.findById(req.params.id);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (!evenement.options.shoppingList) {
      return next(Object.assign(new Error("La shopping list n'est pas activée pour cet événement."), { statut: 400 }));
    }

    if (!verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const items = await ShoppingItem.find({ evenement: evenement._id }).sort({ dateCreation: -1 });
    return reponseSucces(res, "Shopping list récupérée.", items);
  } catch (error) {
    next(error);
  }
};

const creerCovoiturage = async (req, res, next) => {
  try {
    const { error, value } = creationCovoiturageSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const evenement = await Event.findById(req.params.id);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (!evenement.options.covoiturage) {
      return next(Object.assign(new Error("Le covoiturage n'est pas activé pour cet événement."), { statut: 400 }));
    }

    if (!verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const covoiturage = await Carpool.create({
      evenement: evenement._id,
      conducteur: req.utilisateur._id,
      pointDepart: value.pointDepart,
      placesTotal: value.placesTotal,
      placesRestantes: value.placesTotal,
      commentaire: value.commentaire
    });

    return reponseSucces(res, "Covoiturage créé.", covoiturage, 201);
  } catch (error) {
    next(error);
  }
};

const listerCovoiturages = async (req, res, next) => {
  try {
    const evenement = await Event.findById(req.params.id);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (!evenement.options.covoiturage) {
      return next(Object.assign(new Error("Le covoiturage n'est pas activé pour cet événement."), { statut: 400 }));
    }

    if (!verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const covoiturages = await Carpool.find({ evenement: evenement._id }).sort({ dateCreation: -1 });
    return reponseSucces(res, "Covoiturages récupérés.", covoiturages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  creerShoppingItem,
  listerShoppingItems,
  creerCovoiturage,
  listerCovoiturages
};
