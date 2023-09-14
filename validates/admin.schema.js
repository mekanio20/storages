const Joi = require('joi')

const adminSchema = {
    addGroup: Joi.object({
        name: Joi.string().uppercase().min(3).max(20).regex(/^[a-zA-Z]/).required()
    }),
    
    addRole: Joi.object({
        role: Joi.string().lowercase().min(3).max(20).regex(/^[a-zA-Z_]/).required()
    }),

    addPermission: Joi.object({
       url: Joi.string().min(5).max(100).regex(/^[a-zA-Z0-9\-\/]/).required(),
       method: Joi.string().uppercase().valid('GET', 'POST', 'PUT', 'DELETE').required(),
       groupId: Joi.number().positive().required()
    }),

    addStorage: Joi.object({
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF]+$/).allow('', null),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z]/).allow('', null),
        slug: Joi.string().min(3).max(100).regex(/^[a-zA-Z!?@#$%^&-=+_]+$/).required()
    }),

    addCategory: Joi.object({
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF]+$/).allow('', null),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z-]/).allow('', null),
        slug: Joi.string().min(3).max(100).regex(/^[a-zA-Z!?@#$%^&-=+_]+$/).required(),
        storageId: Joi.number().positive().required()
    }),

    deleteGroup: Joi.object({
       id: Joi.number().positive().required() 
    })

}

module.exports = adminSchema