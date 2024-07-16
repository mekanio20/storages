const Joi = require('joi')

const productSchema = {
    // POST
    addProduct: Joi.object({
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).optional(),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).optional(),
        tm_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý\s]+$/).required(),
        ru_desc: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).optional(),
        en_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).optional(),
        barcode: Joi.number().positive().required(),
        stock_code: Joi.string().min(3).max(50).alphanum().required(),
        quantity: Joi.number().positive().default(0),
        org_price: Joi.number().positive().required(),
        sale_price: Joi.number().positive().required(),
        gender: Joi.string().valid('male', 'fmale', 'male-child', 'fmale-child', 'non-gender').default('non-gender'),
        subcategoryId: Joi.number().positive().required(),
        brandId: Joi.number().positive().required()
    }),

    addProductReview: Joi.object({
        star: Joi.number().positive().min(1).max(5).required(),
        productId: Joi.number().positive().required()
    }),

    addCoupon: Joi.object({
        tm_name: Joi.string().min(3).max(100).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).optional(),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).optional(),
        tm_desc: Joi.string().min(3).max(100).required(),
        ru_desc: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).optional(),
        en_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).optional(),
        conditions: Joi.string().valid('on-register', 'on-follow', 'min-buy').required(),
        min_amount: Joi.number().positive().optional(),
        limit: Joi.number().positive().required(),
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
        isPublic: Joi.boolean().required()
    }),

    addOffer: Joi.object({
        currency: Joi.string().valid('manat', 'goterim').required(),
        discount: Joi.number().positive().required(),
        productId: Joi.number().positive().required()
    }),

    allProduct: Joi.object({
        subcategoryId: Joi.number().positive().optional(),
        brandId: Joi.number().positive().optional(),
        gender: Joi.string().valid('male', 'fmale', 'male-child', 'fmale-child', 'non-gender').optional(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        start_price: Joi.number().positive().optional(),
        end_price: Joi.number().positive().optional(),
        sort: Joi.string().valid('id', 'sale_price').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        isActive: Joi.string().valid('all').optional()
    }),
    // PUT
    updateProduct: Joi.object({
        productId: Joi.number().positive().required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).optional(),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).optional(),
        tm_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý\s]+$/).optional(),
        ru_desc: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9]+$/).optional(),
        en_desc: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9]/).optional(),
        stock_code: Joi.string().min(3).max(50).alphanum().optional(),
        barcode: Joi.number().positive().optional(),
        quantity: Joi.number().positive().default(0),
        org_price: Joi.number().positive().optional(),
        sale_price: Joi.number().positive().optional(),
        gender: Joi.string().valid('male', 'fmale', 'male-child', 'fmale-child', 'non-gender').default('non-gender'),
        subcategoryId: Joi.number().positive().optional(),
        brandId: Joi.number().positive().optional()
    }),
    // GET
    searchProduct: Joi.object({
        sellerId: Joi.number().positive().optional(),
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        name: Joi.string().max(100).required()
    }),
    productLikes: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        id: Joi.number().positive().required()
    })
}

module.exports = productSchema