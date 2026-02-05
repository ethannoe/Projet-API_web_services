const Joi = require("joi");

const creationEvenementSchema = Joi.object({
  nom: Joi.string().min(3).max(120).required(),
  description: Joi.string().min(10).max(1000).required(),
  dateDebut: Joi.date().required(),
  dateFin: Joi.date().required(),
  lieu: Joi.string().min(3).max(200).required(),
  photoCouverture: Joi.string().uri().required(),
  visibilite: Joi.string().valid("public", "prive").required(),
  groupeAssocie: Joi.string().optional(),
  options: Joi.object({
    billetterieActivee: Joi.boolean().default(false),
    shoppingList: Joi.boolean().default(false),
    covoiturage: Joi.boolean().default(false)
  }).default({})
});

module.exports = { creationEvenementSchema };
