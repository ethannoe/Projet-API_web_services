const Joi = require("joi");

const creationTypeBilletSchema = Joi.object({
  evenement: Joi.string().required(),
  nom: Joi.string().min(2).max(80).required(),
  prix: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required()
});

const achatBilletSchema = Joi.object({
  billetType: Joi.string().required(),
  prenom: Joi.string().min(2).max(50).required(),
  nom: Joi.string().min(2).max(50).required(),
  adresse: Joi.string().min(5).max(200).required(),
  email: Joi.string().email().required()
});

module.exports = { creationTypeBilletSchema, achatBilletSchema };
