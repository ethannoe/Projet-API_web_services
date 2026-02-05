const Photo = require("../models/Photo");
const Album = require("../models/Album");
const Event = require("../models/Event");
const PhotoComment = require("../models/PhotoComment");
const { commentaireSchema } = require("../validators/albumValidator");
const { reponseSucces } = require("../utils/response");

const verifierParticipant = (evenement, utilisateurId) => {
  return evenement.participants.some((id) => id.toString() === utilisateurId.toString());
};

const ajouterCommentaire = async (req, res, next) => {
  try {
    const { error, value } = commentaireSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return next(Object.assign(new Error("Photo introuvable."), { statut: 404 }));
    }

    const album = await Album.findById(photo.album);
    const evenement = await Event.findById(album.evenement);

    if (!evenement || !verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const commentaire = await PhotoComment.create({
      photo: photo._id,
      auteur: req.utilisateur._id,
      contenu: value.contenu
    });

    return reponseSucces(res, "Commentaire ajouté.", commentaire, 201);
  } catch (error) {
    next(error);
  }
};

const listerCommentaires = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return next(Object.assign(new Error("Photo introuvable."), { statut: 404 }));
    }

    const album = await Album.findById(photo.album);
    const evenement = await Event.findById(album.evenement);

    if (!evenement || !verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const commentaires = await PhotoComment.find({ photo: photo._id })
      .populate("auteur", "prenom nom")
      .sort({ dateCreation: -1 });

    return reponseSucces(res, "Commentaires récupérés.", commentaires);
  } catch (error) {
    next(error);
  }
};

module.exports = { ajouterCommentaire, listerCommentaires };
