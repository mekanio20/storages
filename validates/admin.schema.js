const Joi = require('joi')

const adminSchema = {
    idControl: Joi.object({
        id: Joi.number().positive().required()
    }),

    // ADD
    login: Joi.object({
        phone: Joi.string().regex(/^6[0-9]{7}$/).messages({'string.pattern.base': 'Telefon belgi nädogry!'}).required(),
        password: Joi.string().min(4).max(25).regex(/^[a-zA-Z0-9!?^.,_@#$%&*:;=+]{4,25}$/).required(),
    }),

    addGroup: Joi.object({
        id: Joi.number().positive().optional(),
        name: Joi.string().uppercase().min(3).max(20).regex(/^[a-zA-Z]/).required(),
        isActive: Joi.boolean().optional()
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
        ru_name: Joi.string().min(3).max(100).optional(), // .regex(/^[\u0400-\u04FF]+$/),
        en_name: Joi.string().min(3).max(100).optional(), //regex(/^[a-zA-Z-]/),
        isActive: Joi.boolean().optional()
    }),

    addSubcategory: Joi.object({
        id: Joi.number().positive().optional(),
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).optional(), // .regex(/^[\u0400-\u04FF]+$/),
        en_name: Joi.string().min(3).max(100).optional(), //regex(/^[a-zA-Z-]/),
        categoryId: Joi.number().positive().required(),
        isActive: Joi.boolean().optional()
    }),

    addFeature: Joi.object({
        id: Joi.number().positive().optional(),
        tm_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/).required(),
        ru_name: Joi.string().min(3).max(100).regex(/^[\u0400-\u04FF0-9-]+$/).allow('', null),
        en_name: Joi.string().min(3).max(100).regex(/^[a-zA-Z0-9-]/).allow('', null),
        isActive: Joi.boolean().optional()
    }),

    addFeatureDescription: Joi.object({
        desc: Joi.string().max(50).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/),
        featureId: Joi.number().positive().required(),
        isActive: Joi.boolean().optional()
    }),

    addSubcategoryFeature: Joi.object({
        subcategoryId: Joi.number().positive().required(),
        featureId: Joi.number().positive().required(),
        isActive: Joi.boolean().optional()
    }),

    addBrand: Joi.object({
        id: Joi.number().positive().optional(),
        name: Joi.string().min(2).max(50).regex(/^[a-zA-Z-]/).required(),
        desc: Joi.string().min(5).max(255).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/).allow('', null),
        isActive: Joi.boolean().optional()
    }),

    addSubscription: Joi.object({
        id: Joi.number().positive().optional(),
        name: Joi.string().max(50).required(),
        price: Joi.number().integer().max(10000).positive().required(),
        order: Joi.number().integer().max(10).positive().required(),
        p_limit: Joi.number().integer().max(10000).positive().required(),
        p_img_limit: Joi.number().integer().max(10000).positive().required(),
        seller_banner_limit: Joi.number().integer().max(10000).positive().required(),
        main_banner_limit: Joi.number().integer().max(10000).positive().required(),
        ntf_limit: Joi.number().integer().max(10000).positive().required(),
        voucher_limit: Joi.number().integer().max(10000).positive().required(),
        smm_support: Joi.boolean().required(),
        tech_support: Joi.boolean().required(),
    }),

    // UPDATE
    updateUser: Joi.object({
        id: Joi.number().positive().required(),
        isActive: Joi.boolean().optional(),
        isCustomer: Joi.boolean().optional(),
        isSeller: Joi.boolean().optional(),
        isStaff: Joi.boolean().optional()
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
        isActive: Joi.boolean().optional()
    }),

    updateSubcategoryFeature: Joi.object({
        id: Joi.number().positive().required(),
        featureId: Joi.number().positive().optional(),
        subcategoryId: Joi.number().positive().optional(),
        isActive: Joi.boolean().optional()
    }),

    // GET
    queryParams: Joi.object({
        page: Joi.number().positive().optional(),
        limit: Joi.number().positive().optional(),
        order: Joi.string().valid('asc', 'desc').optional(),
        status: Joi.string().valid('all', true, false).optional()
    })
    
}

module.exports = adminSchema