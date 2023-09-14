const Joi = require('joi')

const userSchema = {
    login: Joi.object({
        username: Joi.string().min(3).max(20).regex(/^[a-zA-Z0-9_]/).messages({'string.pattern.base': 'Invalid username'}).required(),
        password: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required(),
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required()
    }),
    
    register: Joi.object({
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).required(),
        username: Joi.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).messages({'string.pattern.base': 'Invalid username'}).required(),
        password: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required(),
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        address: Joi.string().regex(/^[a-zA-Z0-9,-]/).allow('', null)
    }),

    profile: Joi.object({
       id: Joi.number().positive().required() 
    })

}

module.exports = userSchema