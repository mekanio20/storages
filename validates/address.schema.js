const Joi = require('joi')

const addressSchema = {     
    addAddress: Joi.object({
        address: Joi.string().max(255).required()
    }),
}

module.exports = addressSchema