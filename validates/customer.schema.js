const Joi = require('joi')

const customerSchema = {
    // POST
    customerRegister: Joi.object({
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).required(),
        gender: Joi.string().valid('male', 'fmale').required(),
        email: Joi.string().email().required()
    }),
    customerEditProfile: Joi.object({
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).required(),
        email: Joi.string().email().optional()
    })
}

module.exports = customerSchema