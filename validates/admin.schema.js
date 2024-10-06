const Joi = require('joi')

const stringRegex = (pattern) => Joi.string().regex(pattern)
const positiveNumber = Joi.number().positive()
const optionalBoolean = Joi.boolean().optional()
const optionalString = Joi.string().optional()

const adminSchema = {
    // POST
    addGroup: Joi.object({
        id: positiveNumber.optional(),
        name: stringRegex(/^[a-zA-Z]/).uppercase().min(3).max(20).required(),
        isActive: optionalBoolean
    }),

    addRole: Joi.object({
        role: stringRegex(/^[a-zA-Z_]/).lowercase().min(3).max(20).required()
    }),

    addPermission: Joi.object({
        id: positiveNumber.optional(),
        url: stringRegex(/^[a-zA-Z0-9\-\/]/).min(5).max(100).required(),
        method: Joi.string().uppercase().valid('GET', 'POST', 'PUT', 'DELETE').required(),
        groupId: positiveNumber.required()
    }),

    addCategory: Joi.object({
        id: positiveNumber.optional(),
        tm_name: stringRegex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+/).min(3).max(100).required(),
        ru_name: optionalString.min(3).max(100),
        en_name: optionalString.min(3).max(100),
        isActive: optionalBoolean
    }),

    addSubcategory: Joi.object({
        id: positiveNumber.optional(),
        tm_name: stringRegex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý-\s]+/).min(3).max(100).required(),
        ru_name: optionalString.min(3).max(100),
        en_name: optionalString.min(3).max(100),
        categoryId: positiveNumber.required(),
        isActive: optionalBoolean
    }),

    addFeature: Joi.object({
        id: positiveNumber.optional(),
        name: optionalString.min(3).max(100),
        isActive: optionalBoolean
    }),

    addFeatureDescription: Joi.object({
        desc: optionalString.max(50).regex(/^[a-zA-Z0-9ÄäŇňÖöŞÜüÇçÝý-\s]+$/),
        featureId: positiveNumber.required(),
        isActive: optionalBoolean
    }),

    addSubcategoryFeature: Joi.object({
        subcategoryId: positiveNumber.required(),
        featureId: Joi.ref('subcategoryId'),
        isActive: optionalBoolean
    }),

    addBrand: Joi.object({
        id: positiveNumber.optional(),
        name: stringRegex(/^[a-zA-Z-]/).min(2).max(50).required(),
        desc: optionalString.min(5).max(255).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/),
        isActive: optionalBoolean
    }),

    addSubscription: Joi.object({
        id: positiveNumber.optional(),
        name: Joi.string().max(50).required(),
        price: positiveNumber.integer().max(10000).required(),
        order: positiveNumber.integer().max(10).required(),
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
        id: positiveNumber.required(),
        isActive: optionalBoolean,
        isCustomer: Joi.ref('isActive'),
        isSeller: Joi.ref('isActive'),
        isStaff: Joi.ref('isActive')
    }),

    updateBrand: Joi.object({
        id: positiveNumber.required(),
        name: stringRegex(/^[a-zA-Z-]/).min(2).max(50),
        desc: optionalString.min(5).max(255).regex(/^[a-zA-ZÄäŇňÖöŞÜüÇçÝý\s]+$/),
        isActive: optionalBoolean
    }),

    updateSeller: Joi.object({
        id: positiveNumber.required(),
        isVerified: Joi.boolean().required()
    }),

    updateStatus: Joi.object({
        id: positiveNumber.required(),
        isActive: Joi.boolean().required()
    }),

    updateFeatureDescription: Joi.object({
        id: positiveNumber.required(),
        desc: Joi.string().required(),
        isActive: optionalBoolean
    }),

    updateSubcategoryFeature: Joi.object({
        id: positiveNumber.required(),
        featureId: positiveNumber.optional(),
        subcategoryId: Joi.ref('featureId'),
        isActive: optionalBoolean
    }),

    // GET
    subcategoryFeatures: Joi.object({
        page: positiveNumber.optional(),
        limit: Joi.ref('page'),
        order: Joi.string().valid('asc', 'desc').optional(),
        status: Joi.string().valid('all', true, false).optional(),
        subcategoryId: positiveNumber.optional()
    }),

    featureDescriptions: Joi.object({
        page: positiveNumber.optional(),
        limit: Joi.ref('page'),
        order: Joi.string().valid('asc', 'desc').optional(),
        status: Joi.string().valid('all', true, false).optional(),
        featureId: positiveNumber.optional()
    })
}

module.exports = adminSchema