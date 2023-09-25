const Joi = require('joi')

const adminSchema = {
    // ADD
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
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z]/).allow('', null)
    }),

    addCategory: Joi.object({
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF]+$/).allow('', null),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z-]/).allow('', null),
        storageId: Joi.number().positive().required()
    }),

    addSubcategory: Joi.object({
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF]+$/).allow('', null),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z-]/).allow('', null),
        categoryId: Joi.number().positive().required()
    }),
    
    addFeature: Joi.object({
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF]+$/).allow('', null),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z-]/).allow('', null)
    }),
    
    addFeatureDescription: Joi.object({
        desc: Joi.string().max(50).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/),
        featureId: Joi.number().positive().required()
    }),
    
    addSubcategoryFeature: Joi.object({
        subcategoryId: Joi.number().positive().required(),
        featureId: Joi.number().positive().required()
    }),

    addBrand: Joi.object({
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/).required(),
        desc: Joi.string().min(10).max(255).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).allow('', null),
        userId: Joi.number().positive().required()
    }),

    // DELETE
    deleteGroup: Joi.object({
       id: Joi.number().positive().required() 
    })

}

module.exports = adminSchema