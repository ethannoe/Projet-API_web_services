const Joi = require("joi");

const creationGroupeSchema = Joi.object({
  nom: Joi.string().min(3).max(80).required(),
  description: Joi.string().min(10).max(500).required(),
  icone: Joi.string().uri().required(),
  photoCouverture: Joi.string().uri().required(),
  type: Joi.string().valid("public", "prive", "secret").required(),
  autoriserPublicationMembres: Joi.boolean().default(true),
  autoriserCreationEvenementsMembres: Joi.boolean().default(false)
});

module.exports = { creationGroupeSchema };
