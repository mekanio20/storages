const Joi = require('joi')

const userSchema = {
    check: Joi.object({
        code: Joi.number().positive().max(9999).required()
    }),

    forgotPassword: Joi.object({
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Telefon belgi nädogry!'}).required(),
        orgPass: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required(),
        verifPass: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required()
    }),
    
    addOrder: Joi.object({
        fullname: Joi.string().min(3).max(100).required(),
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Telefon belgi nädogry!'}).required(),
        address: Joi.string().min(4).required(),
        payment: Joi.string().valid('online', 'cash', 'terminal').required(),
        amount: Joi.number().positive().required(),
        note: Joi.string().min(10).optional(),
        productId: Joi.number().positive().required()
    }),

    addBasket: Joi.object({
        quantity: Joi.number().positive().required(),
        productId: Joi.number().positive().required()
    }),

    addAddress: Joi.object({
        address: Joi.string().max(255).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý.!?-\s]+$/).required()
    }),

    addMessage: Joi.object({
        content: Joi.string().max(750).required(),
        userId: Joi.number().positive().required()
    })
}

module.exports = userSchema