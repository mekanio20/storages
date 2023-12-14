const Joi = require('joi')

const addressSchema = {     
    addAddress: Joi.object({
        address: Joi.string().max(255).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý.!?-\s]+$/).required()
    }),
}

module.exports = addressSchema