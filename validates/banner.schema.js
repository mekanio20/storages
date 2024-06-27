const Joi = require('joi')

const bannerSchema = {
    // GET
    allBanner: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        sort: Joi.string().valid('sort_order', 'id').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        type: Joi.string().valid('home', 'product', 'profile', 'ad', 'category', 'etc').optional()
    }),
    // POST
    addBanner: Joi.object({
        url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
        type: Joi.string().valid('home', 'product', 'profile', 'ad', 'category', 'etc').required(),
        sort_order: Joi.number().positive().required(),
        start_date: Joi.date().required(),
        end_date: Joi.date().required()
    })
}

module.exports = bannerSchema