const Joi = require('joi')

const bannerSchema = {
    // GET
    allBanner: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        sort: Joi.string().valid('sort_order', 'id').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        type: Joi.string().valid('ad', 'home', 'category', 'product', 'profile').optional(),
        size: Joi.string().valid('small', 'medium', 'large').optional(),
        isMain: Joi.boolean().optional()
    }),
    // POST
    addBanner: Joi.object({
        url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
        type: Joi.string().valid('ad', 'home', 'category', 'product', 'profile').required(),
        size: Joi.string().valid('small', 'medium', 'large').optional(),
        sort_order: Joi.number().positive().required(),
        start_date: Joi.date().required(),
        end_date: Joi.date().required()
    })
}

module.exports = bannerSchema