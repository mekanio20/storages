const Joi = require('joi')

const videoSchema = {
    // POST
    addVideo: Joi.object({
        desc: Joi.string().optional(),
        tags: Joi.array().items(Joi.string()).min(2).max(20).optional()
    })
}

module.exports = videoSchema