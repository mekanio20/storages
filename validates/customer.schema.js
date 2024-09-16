const Joi = require('joi')

const customerSchema = {
    // POST
    customerRegister: Joi.object({
        fullname: Joi.string().min(3).max(30).required(),
        gender: Joi.string().valid('male', 'fmale').required(),
        email: Joi.string().email().optional()
    }),
    customerEditProfile: Joi.object({
        fullname: Joi.string().min(3).max(30).optional(),
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
        id: Joi.number().positive().required()
    })
}

module.exports = customerSchema