const Joi = require('joi')

const sellerSchema = {
    sellerRegister: Joi.object({
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/),
        store_number: Joi.number().positive().required(),
        store_floor: Joi.number().positive().required(),
        about: Joi.string().min(10).max(255).allow(null, ''),
        color: Joi.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/).required(),
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
    }),

    idControl: Joi.object({
        id: Joi.number().positive().required()
    }),

    addOffer: Joi.object({
        // promocde: Joi.string().max(50).allow(null, ''),
        currency: Joi.string().valid('manat', 'goterim').required(),
        discount: Joi.number().positive().required(),
        productId: Joi.number().positive().required()
    }),
    
    allOrders: Joi.object({
        id: Joi.number().positive().required(),
        sort: Joi.string().valid('id', 'time').optional(),
        order: Joi.string().valid('asc', 'desc').optional()
    }),

    allSeller: Joi.object({
        store_number: Joi.number().positive().optional(),
        store_floor: Joi.number().positive().optional(),
        categoryId: Joi.number().positive().optional(),
        sort: Joi.string().valid('name', 'store_number').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional()
    })
}

module.exports = sellerSchema