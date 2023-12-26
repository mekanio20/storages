const Joi = require('joi')

const videoSchema = {
    addVideo: Joi.object({
        video: Joi.string().max(255).required(),
        hesdek: Joi.string().min(2).max(20).optional()
    })
}

module.exports = videoSchema