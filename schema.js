const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
       title : Joi.string().required(),
       description:Joi.string().required(),
       location:Joi.string().required(),
       country:Joi.string().required(),
       price:Joi.number().required().min(0),
       image: Joi.object({
      url: Joi.string().uri().allow("").optional(),
      category:Joi.string().optional(),
    }).optional()
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
      rating : Joi.number().min(1).max(5).required(),
      comment : Joi.string().required(),
    }).required(),
})

module.exports.subscriberSchema = Joi.object({
  subscriber: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Enter a valid e-mail.",
      "any.required": "E-mail is required."
    })
  }).required()
});