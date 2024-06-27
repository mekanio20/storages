const Joi = require('joi')

const adminSchema = {
    // POST
    addGroup: Joi.object({
        id: Joi.number().positive().optional(),
        name: Joi.string().uppercase().min(3).max(20).regex(/^[a-zA-Z]/).required(),
        isActive: Joi.boolean().default(false)
    }),

    addRole: Joi.object({
        role: Joi.string().lowercase().min(3).max(20).regex(/^[a-zA-Z_]/).required()
    }),

    addPermission: Joi.object({
        id: Joi.number().positive().optional(),
        url: Joi.string().min(5).max(100).regex(/^[a-zA-Z0-9\-\/]/).required(),
        method: Joi.string().uppercase().valid('GET', 'POST', 'PUT', 'DELETE').required(),
        groupId: Joi.number().positive().required()
    }),

    addCategory: Joi.object({
        id: Joi.number().positive().optional(),
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).optional(),
        en_name: Joi.string().min(3).max(100).optional(),
        isActive: Joi.boolean().default(false)
    }),

    addSubcategory: Joi.object({
        id: Joi.number().positive().optional(),
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).optional(),
        en_name: Joi.string().min(3).max(100).optional(),
        categoryId: Joi.number().positive().required(),
        isActive: Joi.boolean().default(false)
    }),

    addFeature: Joi.object({
        id: Joi.number().positive().optional(),
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).optional(),
        en_name: Joi.string().min(3).max(100).optional(),
        isActive: Joi.boolean().default(false)
    }),

    addFeatureDescription: Joi.object({
        desc: Joi.string().max(50).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/),
        featureId: Joi.number().positive().required(),
        isActive: Joi.boolean().default(false)
    }),

    addSubcategoryFeature: Joi.object({
        subcategoryId: Joi.number().positive().required(),
        featureId: Joi.ref('subcategoryId'),
        isActive: Joi.boolean().default(false)
    }),

    addBrand: Joi.object({
        id: Joi.number().positive().optional(),
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/).required(),
        desc: Joi.string().min(5).max(255).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).optional(),
        isActive: Joi.boolean().default(false)
    }),

    addSubscription: Joi.object({
        id: Joi.number().positive().optional(),
        name: Joi.string().max(50).required(),
        price: Joi.number().integer().max(10000).positive().required(),
        order: Joi.number().integer().max(10).positive().required(),
        p_limit: Joi.ref('price'),
        p_img_limit: Joi.ref('price'),
        seller_banner_limit: Joi.ref('price'),
        main_banner_limit: Joi.ref('price'),
        ntf_limit: Joi.ref('price'),
        voucher_limit: Joi.ref('price'),
        smm_support: Joi.boolean().required(),
        tech_support: Joi.ref('smm_support'),
    }),

    // PUT
    updateUser: Joi.object({
        id: Joi.number().positive().required(),
        isActive: Joi.boolean().default(false),
        isCustomer: Joi.ref('isActive'),
        isSeller: Joi.ref('isActive'),
        isStaff: Joi.ref('isActive')
    }),

    updateBrand: Joi.object({
        id: Joi.number().positive().required(),
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/).optional(),
        desc: Joi.string().min(5).max(255).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).optional(),
        isActive: Joi.boolean().optional()
    }),

    updateSeller: Joi.object({
        id: Joi.number().positive().required(),
        isVerified: Joi.boolean().required()
    }),

    updateStatus: Joi.object({
        id: Joi.number().positive().required(),
        isActive: Joi.boolean().required()
    }),

    updateFetureDescription: Joi.object({
        id: Joi.number().positive().required(),
        desc: Joi.string().required(),
        isActive: Joi.boolean().default(false)
    }),

    updateSubcategoryFeature: Joi.object({
        id: Joi.number().positive().required(),
        featureId: Joi.number().positive().optional(),
        subcategoryId: Joi.ref('featureId'),
        isActive: Joi.boolean().default(false)
    }),

    // GET
    subcategoryFeatures: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.ref('page'),
        order: Joi.string().valid('asc', 'desc').optional(),
        status: Joi.string().valid('all', true, false).optional(),
        subcategoryId: Joi.number().positive().optional()
    }),

    featureDescriptions: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.ref('page'),
        order: Joi.string().valid('asc', 'desc').optional(),
        status: Joi.string().valid('all', true, false).optional(),
        featureId: Joi.number().positive().optional()
    })
}

module.exports = adminSchema