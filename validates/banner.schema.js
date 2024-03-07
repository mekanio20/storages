const Joi = require('joi')

const bannerSchema = {
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