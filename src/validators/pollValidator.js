const Joi = require("joi");

const creationSondageSchema = Joi.alternatives().try(
  Joi.object({
    evenement: Joi.string().required(),
    questions: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().min(5).max(300).required(),
          options: Joi.array().items(Joi.string().min(1).max(100)).min(2).max(10).required()
        })
      )
      .min(1)
      .required()
  }),
  Joi.object({
    evenement: Joi.string().required(),
    question: Joi.string().min(5).max(300).required(),
    options: Joi.array().items(Joi.string().min(1).max(100)).min(2).max(10).required()
  })
);

const reponseSondageSchema = Joi.alternatives().try(
  Joi.object({
    reponses: Joi.array()
      .items(
        Joi.object({
          questionIndex: Joi.number().integer().min(0).required(),
          optionChoisie: Joi.string().min(1).max(100).required()
        })
      )
      .min(1)
      .required()
  }),
  Joi.object({
    optionChoisie: Joi.string().min(1).max(100).required()
  })
);

module.exports = { creationSondageSchema, reponseSondageSchema };
