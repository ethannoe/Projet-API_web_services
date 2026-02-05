const Poll = require("../models/Poll");
const PollResponse = require("../models/PollResponse");
const Event = require("../models/Event");
const { creationSondageSchema, reponseSondageSchema } = require("../validators/pollValidator");
const { reponseSucces } = require("../utils/response");

const estOrganisateur = (evenement, utilisateurId) => {
  return evenement.organisateurs.some((id) => id.toString() === utilisateurId.toString());
};

const estParticipant = (evenement, utilisateurId) => {
  return evenement.participants.some((id) => id.toString() === utilisateurId.toString());
};

const creerSondage = async (req, res, next) => {
  try {
    const { error, value } = creationSondageSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const questions = value.questions
      ? value.questions
      : [
          {
            question: value.question,
            options: value.options
          }
        ];

    const evenement = await Event.findById(value.evenement);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (!estOrganisateur(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Action réservée aux organisateurs."), { statut: 403 }));
    }

    const sondage = await Poll.create({
      evenement: value.evenement,
      questions,
      createur: req.utilisateur._id
    });

    return reponseSucces(res, "Sondage créé.", sondage, 201);
  } catch (error) {
    next(error);
  }
};

const recupererSondage = async (req, res, next) => {
  try {
    const sondage = await Poll.findById(req.params.id);
    if (!sondage) {
      return next(Object.assign(new Error("Sondage introuvable."), { statut: 404 }));
    }

    return reponseSucces(res, "Sondage récupéré.", sondage);
  } catch (error) {
    next(error);
  }
};

const repondreSondage = async (req, res, next) => {
  try {
    const { error, value } = reponseSondageSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const reponses = value.reponses
      ? value.reponses
      : [
          {
            questionIndex: 0,
            optionChoisie: value.optionChoisie
          }
        ];

    const sondage = await Poll.findById(req.params.id);
    if (!sondage) {
      return next(Object.assign(new Error("Sondage introuvable."), { statut: 404 }));
    }

    const evenement = await Event.findById(sondage.evenement);
    if (!evenement || !estParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    if (!Array.isArray(sondage.questions) || sondage.questions.length === 0) {
      return next(Object.assign(new Error("Sondage invalide."), { statut: 400 }));
    }

    const indexUtilises = new Set();
    if (reponses.length !== sondage.questions.length) {
      return next(Object.assign(new Error("Toutes les questions doivent être renseignées."), { statut: 400 }));
    }

    for (const reponse of reponses) {
      if (indexUtilises.has(reponse.questionIndex)) {
        return next(Object.assign(new Error("Réponse dupliquée pour une même question."), { statut: 400 }));
      }
      indexUtilises.add(reponse.questionIndex);

      const question = sondage.questions[reponse.questionIndex];
      if (!question) {
        return next(Object.assign(new Error("Question introuvable dans le sondage."), { statut: 400 }));
      }
      if (!question.options.includes(reponse.optionChoisie)) {
        return next(Object.assign(new Error("Option invalide."), { statut: 400 }));
      }
    }

    const reponse = await PollResponse.create({
      sondage: sondage._id,
      participant: req.utilisateur._id,
      reponses
    });

    return reponseSucces(res, "Réponse enregistrée.", reponse, 201);
  } catch (error) {
    if (error.code === 11000) {
      return next(Object.assign(new Error("Vous avez déjà répondu à ce sondage."), { statut: 409 }));
    }
    next(error);
  }
};

module.exports = { creerSondage, recupererSondage, repondreSondage };
