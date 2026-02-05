const Joi = require("joi");

const creationFilSchema = Joi.object({
  type: Joi.string().valid("groupe", "evenement").required(),
  groupe: Joi.string().when("type", {
    is: "groupe",
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  evenement: Joi.string().when("type", {
    is: "evenement",
    then: Joi.required(),
    otherwise: Joi.forbidden()
  })
});

const messageSchema = Joi.object({
  contenu: Joi.string().min(1).max(2000).required(),
  reponseA: Joi.string().optional()
});

module.exports = { creationFilSchema, messageSchema };
