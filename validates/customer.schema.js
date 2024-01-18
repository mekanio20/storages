const Joi = require('joi')

const customerSchema = {
    allCustomer: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        gender: Joi.string().valid('male', 'fmale').optional(),
        sort: Joi.string().valid('id', 'fullname').optional(),
        order: Joi.string().valid('asc', 'desc').optional()
    })
}

module.exports = customerSchema