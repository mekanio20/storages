const Joi = require('joi')

const customerSchema = {
    // POST
    customerRegister: Joi.object({
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).required(),
        gender: Joi.string().valid('male', 'fmale').required(),
        email: Joi.string().email().required()
    }),
    customerEditProfile: Joi.object({
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).optional(),
        email: Joi.string().email().optional()
    }),
    editBasket: Joi.object({
        id: Joi.number().positive().required(),
        quantity: Joi.number().positive().required()
    }),
    customerOrders: Joi.object({
        status: Joi.string().valid('pending', 'accepted', 'ondelivery', 'completed', 'cancelled').optional()
    }),
    editOrder: Joi.object({
        id: Joi.number().positive().required(),
        status: Joi.string().valid('cancelled').optional()
    })
}

module.exports = customerSchema