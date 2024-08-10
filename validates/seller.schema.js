const Joi = require('joi')

const sellerSchema = {
    
    sellerRegister: Joi.object({
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/),
        store_number: Joi.number().positive().required(),
        store_floor: Joi.number().positive().required(),
        about: Joi.string().min(10).max(255).optional(),
        seller_type: Joi.string().valid('in-opt', 'out-opt').required(),
        sell_type: Joi.string().valid('wholesale', 'partial', 'both').required(),
        instagram: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).optional(),
        tiktok: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).optional(),
        main_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).required(),
        second_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).optional(),
        categoryId: Joi.number().positive().required(),
        subscriptionId: Joi.number().positive().required()
    }),

    updateSellerProfile: Joi.object({
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/).optional(),
        store_number: Joi.number().positive().optional(),
        store_floor: Joi.number().positive().optional(),
        about: Joi.string().min(10).max(255).optional(),
        seller_type: Joi.string().valid('in-opt', 'out-opt').optional(),
        sell_type: Joi.string().valid('wholesale', 'partial', 'both').optional(),
        instagram: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).optional(),
        tiktok: Joi.string().min(10).max(50).regex(/^[a-zA-Z!?@#$:/\/%^&-=+_]+$/).optional(),
        main_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).optional(),
        second_number: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Invalid phone number'}).optional(),
        categoryId: Joi.number().positive().optional()
    }),
    
    allOrders: Joi.object({
        status: Joi.string().valid('ondelivery', 'completed', 'cancelled').optional(),
        sort: Joi.string().valid('id', 'time').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional()
    }),

    allSeller: Joi.object({
        name: Joi.string().min(2).max(255).optional(),
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
        sellerId: Joi.number().positive().required(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        sort: Joi.string().valid('id', 'sale_price'),
        order: Joi.string().valid('asc', 'desc').optional(),
        start_price: Joi.number().positive().optional(),
        end_price: Joi.number().positive().optional(),
        subcategoryId: Joi.number().positive().optional(),
        brandId: Joi.number().positive().optional(),
        gender: Joi.string().valid('male', 'fmale', 'male-child', 'fmale-child', 'non-gender').optional(),
        isActive: Joi.string().valid('all').optional()
    }),

    sellerVideos: Joi.object({
        sellerId: Joi.number().positive().required(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional()
    }),

    updateOrderStatus: Joi.object({
        orderId: Joi.number().positive().required(),
        status: Joi.string().valid('pending', 'accepted', 'ondelivery', 'completed', 'cancelled').required()
    }),

    allBanners: Joi.object({
        sellerId: Joi.number().positive().required(),
        type: Joi.string().valid('home', 'product', 'profile', 'ad', 'category', 'etc').optional()
    })
}

module.exports = sellerSchema