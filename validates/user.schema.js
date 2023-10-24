const Joi = require('joi')

const userSchema = {
    login: Joi.object({
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        password: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required(),
    }),

    forgotPassword: Joi.object({
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        orgPass: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required(),
        verifPass: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required()
    }),
    
    register: Joi.object({
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        password: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required()
    }),

    customerRegister: Joi.object({
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).required(),
        gender: Joi.string().valid('male', 'fmale').required(),
        email: Joi.string().email().required(),
        userId: Joi.number().positive().required()
    }),

    addContact: Joi.object({
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        email: Joi.string().email().required(),
        fullname: Joi.string().min(3).max(30).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).messages({'string.pattern.base': 'Invalid fullname'}).required(),
        message: Joi.string().min(5).max(255).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý.!?-\s]+$/).required(),
        userId: Joi.number().positive().required()
    }),

    idControl: Joi.object({
       id: Joi.number().positive().required()
    }),

    likeControl: Joi.object({
        productId: Joi.number().positive().required(),
        userId: Joi.number().positive().required()
    }),

    addOrder: Joi.object({
        fullname: Joi.string().min(3).max(100).regex(/^[A-Za-z]+ [A-Za-z]+$/).required(),
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        address: Joi.string().min(4).required(),
        payment: Joi.string().valid('online', 'cash', 'terminal').required(),
        amount: Joi.number().positive().required(),
        note: Joi.string().min(10).allow(null, ''),
        customerId: Joi.number().positive().required(),
        productId: Joi.number().positive().required()
    }),

    addBasket: Joi.object({
        quantity: Joi.number().positive().required(),
        productId: Joi.number().positive().required(),
        customerId: Joi.number().positive().required()
    }),

    addFollower: Joi.object({
        sellerId: Joi.number().positive().required(),
        customerId: Joi.number().positive().required()
    })
}

module.exports = userSchema