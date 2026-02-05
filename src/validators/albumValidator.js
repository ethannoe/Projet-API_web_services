const Joi = require("joi");

const creationAlbumSchema = Joi.object({
  evenement: Joi.string().required(),
  nom: Joi.string().min(3).max(120).required(),
  description: Joi.string().max(500).allow("")
});

const photoSchema = Joi.object({
  url: Joi.string().uri().required(),
  description: Joi.string().max(500).allow("")
});

const commentaireSchema = Joi.object({
  contenu: Joi.string().min(1).max(1000).required()
});

module.exports = { creationAlbumSchema, photoSchema, commentaireSchema };
