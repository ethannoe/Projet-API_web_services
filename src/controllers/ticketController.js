const TicketType = require("../models/TicketType");
const TicketPurchase = require("../models/TicketPurchase");
const Event = require("../models/Event");
const { creationTypeBilletSchema, achatBilletSchema } = require("../validators/ticketValidator");
const { reponseSucces } = require("../utils/response");

const estOrganisateur = (evenement, utilisateurId) => {
  return evenement.organisateurs.some((id) => id.toString() === utilisateurId.toString());
};

const creerTypeBillet = async (req, res, next) => {
  try {
    const { error, value } = creationTypeBilletSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const evenement = await Event.findById(value.evenement);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (evenement.visibilite !== "public") {
      return next(Object.assign(new Error("Billetterie réservée aux événements publics."), { statut: 403 }));
    }

    if (!evenement.options.billetterieActivee) {
      return next(Object.assign(new Error("La billetterie n'est pas activée pour cet événement."), { statut: 400 }));
    }

    if (!estOrganisateur(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Action réservée aux organisateurs."), { statut: 403 }));
    }

    const billet = await TicketType.create({
      evenement: value.evenement,
      nom: value.nom,
      prix: value.prix,
      stock: value.stock
    });

    return reponseSucces(res, "Type de billet créé.", billet, 201);
  } catch (error) {
    next(error);
  }
};

const listerTypesBillets = async (req, res, next) => {
  try {
    const billets = await TicketType.find({ evenement: req.params.eventId });
    return reponseSucces(res, "Types de billets récupérés.", billets);
  } catch (error) {
    next(error);
  }
};

const acheterBillet = async (req, res, next) => {
  try {
    const { error, value } = achatBilletSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const billet = await TicketType.findById(value.billetType);
    if (!billet) {
      return next(Object.assign(new Error("Type de billet introuvable."), { statut: 404 }));
    }

    const evenement = await Event.findById(billet.evenement);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (evenement.visibilite !== "public") {
      return next(Object.assign(new Error("Billetterie réservée aux événements publics."), { statut: 403 }));
    }

    if (!evenement.options.billetterieActivee) {
      return next(Object.assign(new Error("La billetterie n'est pas activée pour cet événement."), { statut: 400 }));
    }

    if (billet.stock <= 0) {
      return next(Object.assign(new Error("Stock épuisé."), { statut: 400 }));
    }

    const dejaAchete = await TicketPurchase.findOne({ evenement: billet.evenement, email: value.email });
    if (dejaAchete) {
      return next(Object.assign(new Error("Un seul billet par personne est autorisé."), { statut: 409 }));
    }

    billet.stock -= 1;
    await billet.save();

    const achat = await TicketPurchase.create({
      billetType: billet._id,
      evenement: billet.evenement,
      prenom: value.prenom,
      nom: value.nom,
      adresse: value.adresse,
      email: value.email
    });

    return reponseSucces(res, "Achat confirmé.", achat, 201);
  } catch (error) {
    if (error.code === 11000) {
      return next(Object.assign(new Error("Un seul billet par personne est autorisé."), { statut: 409 }));
    }
    next(error);
  }
};

module.exports = { creerTypeBillet, listerTypesBillets, acheterBillet };
