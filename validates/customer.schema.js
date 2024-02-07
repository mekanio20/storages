const Joi = require('joi')

const customerSchema = {
    idControl: Joi.object({
        id: Joi.number().positive().required()
    }),

    customerRegister: Joi.object({
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).required(),
        gender: Joi.string().valid('male', 'fmale').required(),
        email: Joi.string().email().required()
    }),

    allCustomer: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        gender: Joi.string().valid('male', 'fmale').optional(),
        sort: Joi.string().valid('id', 'fullname').optional(),
        order: Joi.string().valid('asc', 'desc').optional()
    })
}

module.exports = customerSchema