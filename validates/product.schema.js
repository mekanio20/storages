const Joi = require('joi')

const productSchema = {
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
        brandId: Joi.number().positive().required()
    }),

    addProductFeature: Joi.object({
        product_features: Joi.array().items(Joi.number()).required()
    }),

    addProductReview: Joi.object({
        star: Joi.number().positive().min(1).max(5).required(),
        productId: Joi.number().positive().required(),
        customerId: Joi.number().positive().required()
    }),

    idControl: Joi.object({
        id: Joi.number().positive().required()
    }),

    allProduct: Joi.object({
        name: Joi.string().max(100).optional(),
        subcategoryId: Joi.number().positive().optional(),
        brandId: Joi.number().positive().optional(),
        sellerId: Joi.number().positive().optional(),
        gender: Joi.string().valid('male', 'fmale', 'male-child', 'fmale-child', 'non-gender').optional(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        start_price: Joi.number().positive().optional(),
        end_price: Joi.number().positive().optional(),
        sort: Joi.string().valid('id', 'org_price').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        rating: Joi.string().valid('asc', 'desc').optional(),
        isActive: Joi.string().valid('all').optional()
    }),

    addCoupon: Joi.object({
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).allow('', null),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).allow('', null),
        tm_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý\s]+$/).required(),
        ru_desc: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).allow('', null),
        en_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).allow('', null),
        conditions: Joi.string().valid('on-register', 'on-follow', 'min-buy').required(),
        min_amount: Joi.number().positive().required(),
        // amount: Joi.number().positive().required(),
        limit: Joi.number().positive().required(),
        star_date: Joi.string().isoDate().required(),
        end_date: Joi.string().isoDate().required(),
        isPublic: Joi.boolean().required()
    }),
}

module.exports = productSchema