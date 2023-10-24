const router = require('express').Router()
const adminController = require('../controllers/admin.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const adminSchema = require('../validates/admin.schema')

router.post('/add/group',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addGroup, 'body'),
    adminController.addGroup)

router.post('/add/permission',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addPermission, 'body'),
    adminController.addAccessPath)

router.post('/add/storage',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addStorage, 'body'),
    adminController.addStorage)

router.post('/add/category',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addCategory, 'body'),
    adminController.addCategory)

router.post('/add/subcategory',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addSubcategory, 'body'),
    adminController.addSubcategory)

router.post('/add/feature',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addFeature, 'body'),
    adminController.addFeature)

router.post('/add/feature/desc',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addFeatureDescription, 'body'),
    adminController.addFeatureDescription)

router.post('/add/subcategory/feature',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addSubcategoryFeature, 'body'),
    adminController.addSubcategoryFeature)

router.post('/add/brand',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('brand_img'),
    valdidationMiddleware(adminSchema.addBrand, 'body'),
    adminController.addBrand)

router.post('/add/staff',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.idControl, 'body'),
    adminController.addStaff)

router.post('/add/subscription',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addSubscription, 'body'),
    adminController.addSubscription)

// GET
router.get('/all/permissions',
    // authMiddleware, accessMiddleware(false),
    adminController.allPermissions)

// DELETE
router.delete('/delete/group/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteGroup)

router.delete('/delete/permission/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteAccessPath)

router.delete('/delete/brand/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteBrand)

router.delete('/delete/feature/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteFeature)

// DEFAULT
router.get('/default', adminController.defaultCreate)

module.exports = router