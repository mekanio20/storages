const router = require('express').Router()
const adminController = require('../controllers/admin.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const limitterMiddleware = require('../middlewares/limitter.middleware')
const validationMiddleware = require('../middlewares/validation.middleware')
const adminSchema = require('../validates/admin.schema')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/login-page',
    limitterMiddleware(),
    validationMiddleware(baseSchema.loginControl, 'body'),
    adminController.adminLogin)

router.post('/add/group',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addGroup, 'body'),
    adminController.addGroup)

router.post('/add/permission',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addPermission, 'body'),
    adminController.addPermission)

router.post('/add/category',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.STORAGE_PATH).single('logo'),
    validationMiddleware(adminSchema.addCategory, 'body'),
    adminController.addCategory)

router.post('/add/subcategory',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.STORAGE_PATH).single('logo'),
    validationMiddleware(adminSchema.addSubcategory, 'body'),
    adminController.addSubcategory)

router.post('/add/feature',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addFeature, 'body'),
    adminController.addFeature)

router.post('/add/feature/desc',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addFeatureDescription, 'body'),
    adminController.addFeatureDescription)

router.post('/add/subcategory/feature',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addSubcategoryFeature, 'body'),
    adminController.addSubcategoryFeature)

router.post('/add/brand',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('brand_img'),
    validationMiddleware(adminSchema.addBrand, 'body'),
    adminController.addBrand)

router.post('/add/staff',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(baseSchema.idControl, 'body'),
    adminController.addStaff)

router.post('/add/subscription',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addSubscription, 'body'),
    adminController.addSubscription)

// GET
router.get('/all/groups',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(baseSchema.queryControl, 'query'),
    adminController.allGroups)

router.get('/all/permissions',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(baseSchema.queryControl, 'query'),
    adminController.allPermissions)

router.get('/all/subscriptions',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(baseSchema.queryControl, 'query'),
    adminController.allSubscriptions)

router.get('/all/features',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(baseSchema.queryControl, 'query'),
    adminController.allFeatures)

router.get('/feature/descriptions',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.featureDescriptions, 'query'),
    adminController.allFeatureDescriptions)

router.get('/subcategory/features',
    authMiddleware,
    validationMiddleware(adminSchema.subcategoryFeatures, 'query'),
    adminController.allSubcategoryFeatures)

// -- statistic

router.get('/all/systems',
    authMiddleware, accessMiddleware(false),
    adminController.allSystems)

router.get('/register/statistic',
    authMiddleware, accessMiddleware(false),
    adminController.registerStatistic)

// PUT
router.put('/update/group',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addGroup, 'body'),
    adminController.udpateGroup)

router.put('/update/permission',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addPermission, 'body'),
    adminController.updatePermission)

router.put('/update/subscription',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addSubscription, 'body'),
    adminController.updateSubscription)

router.put('/update/brand',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('brand_img'),
    validationMiddleware(adminSchema.updateBrand, 'body'),
    adminController.updateBrand)

router.put('/update/category',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('logo'),
    validationMiddleware(adminSchema.addCategory, 'body'),
    adminController.updateCategory)

router.put('/update/subcategory',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('logo'),
    validationMiddleware(adminSchema.addSubcategory, 'body'),
    adminController.updateSubCategory)

router.put('/update/user',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.updateUser, 'body'),
    adminController.updateUser)

router.put('/update/seller',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.updateSeller, 'body'),
    adminController.updateSeller)

router.put('/update/product',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.updateStatus, 'body'),
    adminController.updateProduct)

router.put('/update/comment',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.updateStatus, 'body'),
    adminController.updateComment)

router.put('/update/feature',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.addFeature, 'body'),
    adminController.updateFeature)

router.put('/update/feature/descriptions',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.updateFetureDescription, 'body'),
    adminController.updateFeatureDescription)

router.put('/update/subcategory/feature',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(adminSchema.updateSubcategoryFeature, 'body'),
    adminController.updateSubcategoryFeature)

// DELETE
router.delete('/delete/group/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteGroup)

router.delete('/delete/permission/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deletePermission)

router.delete('/delete/subscription/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteScubscription)

router.delete('/delete/brand/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteBrand)

router.delete('/delete/category/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteCategory)

router.delete('/delete/subcategory/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteSubCategory)

router.delete('/delete/user/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteUser)

router.delete('/delete/customer/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteCustomer)

router.delete('/delete/seller/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteSeller)

router.delete('/delete/feature/desc/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteFeatureDesc)

router.delete('/delete/feature/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteFeature)

router.delete('/delete/subcategory/feature/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    adminController.deleteSubcategoryFeature)

// DEFAULT
router.get('/default', adminController.defaultCreate)

module.exports = router