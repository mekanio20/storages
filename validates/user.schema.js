const Joi = require('joi')

const userSchema = {
    login: Joi.object({
        // password: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required(),
        // phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required()
    }),
    
    register: Joi.object({
        password: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required(),
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required()
    }),

    customerRegister: Joi.object({
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).required(),
        gender: Joi.string().valid('male', 'fmale').required(),
        email: Joi.string().email().required(),
        userId: Joi.number().positive().required()
    }),

    profile: Joi.object({
       id: Joi.number().positive().required() 
    }),

    

}

module.exports = userSchema