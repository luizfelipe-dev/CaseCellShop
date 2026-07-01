const Joi = require('joi');

const checkoutSchema = Joi.object({
  uid: Joi.string().uuid({ version: 'uuidv4' }).required(),
  productId: Joi.string().hex().length(24).required(),
  amount: Joi.number().integer().min(1).required(),
});

function validateCheckout(payload) {
  return checkoutSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });
}

module.exports = {
  checkoutSchema,
  validateCheckout,
};
