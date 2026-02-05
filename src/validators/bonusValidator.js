const Joi = require("joi");

const creationShoppingSchema = Joi.object({
  nom: Joi.string().min(2).max(120).required(),
  quantite: Joi.number().integer().min(1).required()
});

const creationCovoiturageSchema = Joi.object({
  pointDepart: Joi.string().min(2).max(200).required(),
  placesTotal: Joi.number().integer().min(1).required(),
  commentaire: Joi.string().max(500).allow("")
});

module.exports = { creationShoppingSchema, creationCovoiturageSchema };
