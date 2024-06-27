const Joi = require('joi')

const sellerSchema = {
    
    sellerRegister: Joi.object({
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/),
        store_number: Joi.number().positive().required(),
        store_floor: Joi.number().positive().required(),
        about: Joi.string().min(10).max(255).allow(null, ''),
        seller_type: Joi.string().valid('in-opt', 'out-opt').required(),
        sell_type: Joi.string().valid('wholesale', 'partial', 'both').required(),
        instagram: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).allow(null, ''),
        tiktok: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).allow(null, ''),
        main_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        second_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).allow(null, ''),
        categoryId: Joi.number().positive().required(),
        subscriptionId: Joi.number().positive().required()
    }),

    updateSellerProfile: Joi.object({
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/).allow('', null),
        store_number: Joi.number().positive().allow('', null),
        store_floor: Joi.number().positive().allow('', null),
        about: Joi.string().min(10).max(255).allow(null, ''),
        seller_type: Joi.string().valid('in-opt', 'out-opt').allow('', null),
        sell_type: Joi.string().valid('wholesale', 'partial', 'both').allow('', null),
        instagram: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).allow(null, ''),
        tiktok: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).allow(null, ''),
        main_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).allow('', null),
        second_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).allow('', null),
        categoryId: Joi.number().positive().optional()
    }),
    
    allOrders: Joi.object({
        status: Joi.string().valid('new', 'ondelivery', 'completed', 'cancelled'),
        sort: Joi.string().valid('id', 'time').optional(),
        order: Joi.string().valid('asc', 'desc').optional()
    }),

    allSeller: Joi.object({
        store_number: Joi.number().positive().optional(),
        store_floor: Joi.number().positive().optional(),
        categoryId: Joi.number().positive().optional(),
        status: Joi.string().valid('false', 'true'),
        sort: Joi.string().valid('id', 'name', 'store_number').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional()
    }),

    sellerProducts: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        sort: Joi.string().valid('id', 'sale_price'),
        order: Joi.string().valid('asc', 'desc').optional(),
        sellerId: Joi.number().positive().required(),
        start_price: Joi.number().positive().optional(),
        end_price: Joi.number().positive().optional(),
        subcategoryId: Joi.number().positive().optional(),
        brandId: Joi.number().positive().optional(),
        gender: Joi.string().valid('male', 'fmale').optional(),
        isActive: Joi.string().valid('all').optional()
    }),

    sellerVideos: Joi.object({
        sellerId: Joi.number().positive().required(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional()
    })
}

module.exports = sellerSchema