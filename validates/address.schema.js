const Joi = require('joi')

const addressSchema = {     
    addAddress: Joi.object({
        address: Joi.string().max(255).required(),
        isDefault: Joi.boolean().optional()
    }),

    idControl: Joi.object({
        id: Joi.number().positive().required()
    })
}

module.exports = addressSchema