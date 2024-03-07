const Joi = require('joi')

const notificationSchema = {
    // POST
    addNotification: Joi.object({
        receivers: Joi.string().valid('all', 'my-customers').required(),
        title: Joi.string().min(5).max(100).regex(/^[a-zA-Z0-9!?ÄäŇňÖöŞÜüÇçÝý\s]+$/).required(),
        desc: Joi.string().max(255).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
    }),
    // PUT
    updateNotification: Joi.object({
        id: Joi.number().positive().required(),
        status: Joi.string().valid('on-wait', 'sent').required()
    })
}

module.exports = notificationSchema