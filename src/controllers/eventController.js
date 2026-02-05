const Event = require("../models/Event");
const Group = require("../models/Group");
const Thread = require("../models/Thread");
const { creationEvenementSchema } = require("../validators/eventValidator");
const { reponseSucces } = require("../utils/response");

const estOrganisateur = (evenement, utilisateurId) => {
  return evenement.organisateurs.some((id) => id.toString() === utilisateurId.toString());
};

const creerEvenement = async (req, res, next) => {
  try {
    const { error, value } = creationEvenementSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    if (value.options?.billetterieActivee && value.visibilite !== "public") {
      return next(
        Object.assign(
          new Error("La billetterie n'est autorisée que pour les événements publics."),
          { statut: 400 }
        )
      );
    }

    if (value.groupeAssocie) {
      const groupe = await Group.findById(value.groupeAssocie);
      if (!groupe) {
        return next(Object.assign(new Error("Groupe associé introuvable."), { statut: 404 }));
      }
      const estMembre = groupe.membres.some((id) => id.toString() === req.utilisateur._id.toString());
      if (!estMembre) {
        return next(Object.assign(new Error("Vous devez être membre du groupe associé."), { statut: 403 }));
      }
    }

    const evenement = await Event.create({
      ...value,
      organisateurs: [req.utilisateur._id],
      participants: [req.utilisateur._id]
    });

    await Thread.create({
      type: "evenement",
      evenement: evenement._id
    });

    return reponseSucces(res, "Événement créé.", evenement, 201);
  } catch (error) {
    next(error);
  }
};

const listerEvenements = async (_req, res, next) => {
  try {
    const evenements = await Event.find().populate("organisateurs", "prenom nom");
    return reponseSucces(res, "Événements récupérés.", evenements);
  } catch (error) {
    next(error);
  }
};

const recupererEvenement = async (req, res, next) => {
  try {
    const evenement = await Event.findById(req.params.id)
      .populate("organisateurs", "prenom nom")
      .populate("participants", "prenom nom")
      .populate("groupeAssocie", "nom");

    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    return reponseSucces(res, "Événement récupéré.", evenement);
  } catch (error) {
    next(error);
  }
};

const rejoindreEvenement = async (req, res, next) => {
  try {
    const evenement = await Event.findById(req.params.id);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (evenement.visibilite === "prive") {
      return next(Object.assign(new Error("Événement privé, accès restreint."), { statut: 403 }));
    }

    if (evenement.participants.some((id) => id.toString() === req.utilisateur._id.toString())) {
      return next(Object.assign(new Error("Vous participez déjà à cet événement."), { statut: 400 }));
    }

    evenement.participants.push(req.utilisateur._id);
    await evenement.save();

    return reponseSucces(res, "Participation confirmée.", evenement);
  } catch (error) {
    next(error);
  }
};

const ajouterOrganisateur = async (req, res, next) => {
  try {
    const evenement = await Event.findById(req.params.id);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (!estOrganisateur(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Action réservée aux organisateurs."), { statut: 403 }));
    }

    const utilisateurId = req.params.userId;
    if (!evenement.organisateurs.some((id) => id.toString() === utilisateurId)) {
      evenement.organisateurs.push(utilisateurId);
    }

    if (!evenement.participants.some((id) => id.toString() === utilisateurId)) {
      evenement.participants.push(utilisateurId);
    }

    await evenement.save();

    return reponseSucces(res, "Organisateur ajouté.", evenement);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  creerEvenement,
  listerEvenements,
  recupererEvenement,
  rejoindreEvenement,
  ajouterOrganisateur
};
