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
        star: Joi.string().valid('1', '2', '3', '4', '5').required(),
        productId: Joi.number().positive().required(),
        customerId: Joi.number().positive().required()
    }),

    idControl: Joi.object({
        id: Joi.number().positive().required()
    }),

    allProduct: Joi.object({
        subcategoryId: Joi.number().positive().allow(null, ''),
        brandId: Joi.number().positive().allow(null, ''),
        sellerId: Joi.number().positive().allow(null, ''),
        gender: Joi.string().valid('male', 'fmale', 'male-child', 'fmale-child', 'non-gender').allow(null, ''),
        page: Joi.number().positive().allow(null, ''),
        limit: Joi.number().positive().allow(null, '')
    })
}

module.exports = productSchema