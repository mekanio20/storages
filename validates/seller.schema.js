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
    }),

    addProduct: Joi.object({
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).allow('', null),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).allow('', null),
        tm_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý\s]+$/).required(),
        ru_desc: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).allow('', null),
        en_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).allow('', null),
        barcode: Joi.number().positive().required(),
        stock_code: Joi.string().min(3).max(50).alphanum().required(),
        quantity: Joi.number().positive().default(0),
        org_price: Joi.number().positive().required(),
        sale_price: Joi.number().positive().required(),
        gender: Joi.string().valid('male', 'fmale', 'male-child', 'fmale-child', 'non-gender').default('non-gender'),
        subcategoryId: Joi.number().positive().required(),
        brandId: Joi.number().positive().required(),
        sellerId: Joi.number().positive().required()
    }),

    delete: Joi.object({
        id: Joi.number().positive().required()
    }),
}

module.exports = sellerSchema