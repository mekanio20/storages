const Joi = require('joi')

const notificationSchema = {

    idControl: Joi.object({
        id: Joi.number().positive().required()
    }),

    addNotification: Joi.object({
        receivers: Joi.string().valid('all', 'my-customers').required(),
        title: Joi.string().min(5).max(100).regex(/^[a-zA-Z0-9!?ÄäŇňÖöŞÜüÇçÝý\s]+$/),
        desc: Joi.string().max(255).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/)
    }),

    updateNotification: Joi.object({
        id: Joi.number().positive().required(),
        status: Joi.string().valid('on-wait', 'sent').required()
    }),

    allNotification: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        sort: Joi.string().valid('id').optional(),
        order: Joi.string().valid('desc', 'asc').optional()
    })
}

module.exports = notificationSchema