const Joi = require('joi')

const commentSchema = {
    // POST
    addComment: Joi.object({
        productId: Joi.number().positive().required(),
        comment: Joi.string().min(2).required()
    }),
    // GET
    allComment: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        sort: Joi.string().valid('id', 'comment').optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        sellerId: Joi.number().positive().optional(),
        productId: Joi.number().positive().optional(),
        isActive: Joi.boolean().optional()
    })
}

module.exports = commentSchema