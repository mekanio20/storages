const Joi = require('joi')

const sellerSchema = {
    sellerRegister: Joi.object({
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/).required(),
        store_number: Joi.number().positive().required(),
        store_floor: Joi.number().positive().required(),
        about: Joi.string().min(10).max(255).alphanum().allow(null, ''),
        color: Joi.string().regex(/^[a-zA-Z#]+$/).required(),
        seller_type: Joi.string().valid('in-opt', 'out-opt').required(),
        sell_type: Joi.string().valid('wholesale', 'partial', 'both').required(),
        instagram: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).allow(null, ''),
        tiktok: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).allow(null, ''),
        main_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        second_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).allow(null, ''),
        userId: Joi.number().positive().required(),
        categoryId: Joi.number().positive().required(),
        subscriptionId: Joi.number().positive().required()
    }),

    fetchOneSeller: Joi.object({
        id: Joi.number().positive().required()
    }),
    
    updateSellerProfile: Joi.object({
        id: Joi.number().positive().required(),
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/).allow('', null),
        store_number: Joi.number().positive().allow('', null),
        store_floor: Joi.number().positive().allow('', null),
        about: Joi.string().min(10).max(255).allow(null, ''),
        color: Joi.string().regex(/^[a-zA-Z0-9#]+$/).allow('', null),
        seller_type: Joi.string().valid('in-opt', 'out-opt').allow('', null),
        sell_type: Joi.string().valid('wholesale', 'partial', 'both').allow('', null),
        instagram: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).allow(null, ''),
        tiktok: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).allow(null, ''),
        main_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).allow('', null),
        second_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).allow('', null),
        categoryId: Joi.number().positive()
    })
}

module.exports = sellerSchema