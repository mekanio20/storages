const Joi = require('joi')

const commentSchema = {
    addComment: Joi.object({
        productId: Joi.number().positive().required(),
        comment: Joi.string().min(2).required()
    }),

    idControl: Joi.object({
        id: Joi.number().positive().required()
    }),

    allComment: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        productId: Joi.number().positive().required()
    })
}

module.exports = commentSchema