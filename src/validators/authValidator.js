const Joi = require("joi");

const inscriptionSchema = Joi.object({
  prenom: Joi.string().min(2).max(50).required(),
  nom: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  motDePasse: Joi.string().min(8).required()
});

const connexionSchema = Joi.object({
  email: Joi.string().email().required(),
  motDePasse: Joi.string().required()
});

module.exports = { inscriptionSchema, connexionSchema };
