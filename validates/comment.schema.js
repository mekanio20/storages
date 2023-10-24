const Joi = require('joi')

const commentSchema = {
    addComment: Joi.object({
        userId: Joi.number().positive().required(),
        productId: Joi.number().positive().required(),
        comment: Joi.string().min(2).required()
    }),

    idControl: Joi.object({
        id: Joi.number().positive().required()
    })
}

module.exports = commentSchema