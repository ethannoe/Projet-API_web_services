const Album = require("../models/Album");
const Photo = require("../models/Photo");
const Event = require("../models/Event");
const { creationAlbumSchema, photoSchema } = require("../validators/albumValidator");
const { reponseSucces } = require("../utils/response");

const verifierParticipant = (evenement, utilisateurId) => {
  return evenement.participants.some((id) => id.toString() === utilisateurId.toString());
};

const creerAlbum = async (req, res, next) => {
  try {
    const { error, value } = creationAlbumSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const evenement = await Event.findById(value.evenement);
    if (!evenement) {
      return next(Object.assign(new Error("Événement introuvable."), { statut: 404 }));
    }

    if (!verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const album = await Album.create({
      evenement: value.evenement,
      nom: value.nom,
      description: value.description
    });

    return reponseSucces(res, "Album créé.", album, 201);
  } catch (error) {
    next(error);
  }
};

const recupererAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return next(Object.assign(new Error("Album introuvable."), { statut: 404 }));
    }

    const evenement = await Event.findById(album.evenement);
    if (!evenement || !verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const photos = await Photo.find({ album: album._id }).sort({ dateCreation: -1 });

    return reponseSucces(res, "Album récupéré.", { album, photos });
  } catch (error) {
    next(error);
  }
};

const ajouterPhoto = async (req, res, next) => {
  try {
    const { error, value } = photoSchema.validate(req.body);
    if (error) {
      return next(Object.assign(new Error(error.details[0].message), { statut: 400 }));
    }

    const album = await Album.findById(req.params.id);
    if (!album) {
      return next(Object.assign(new Error("Album introuvable."), { statut: 404 }));
    }

    const evenement = await Event.findById(album.evenement);
    if (!evenement || !verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const photo = await Photo.create({
      album: album._id,
      url: value.url,
      description: value.description,
      auteur: req.utilisateur._id
    });

    return reponseSucces(res, "Photo ajoutée.", photo, 201);
  } catch (error) {
    next(error);
  }
};

const listerPhotos = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return next(Object.assign(new Error("Album introuvable."), { statut: 404 }));
    }

    const evenement = await Event.findById(album.evenement);
    if (!evenement || !verifierParticipant(evenement, req.utilisateur._id)) {
      return next(Object.assign(new Error("Accès réservé aux participants."), { statut: 403 }));
    }

    const photos = await Photo.find({ album: album._id }).sort({ dateCreation: -1 });

    return reponseSucces(res, "Photos récupérées.", photos);
  } catch (error) {
    next(error);
  }
};

module.exports = { creerAlbum, recupererAlbum, ajouterPhoto, listerPhotos };
