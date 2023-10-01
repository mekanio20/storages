const Joi = require('joi')

const notificationSchema = {
    addNotification: Joi.object({
        receivers: Joi.string().valid('all', 'my-customers').required(),
        title: Joi.string().min(5).max(100).regex(/^[a-zA-Z0-9!?ÄäŇňÖöŞÜüÇçÝý\s]+$/),
        desc: Joi.string().max(255).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/),
        send_date: Joi.date().iso().required(),
        userId: Joi.number().positive().required()
    })
}

module.exports = notificationSchema