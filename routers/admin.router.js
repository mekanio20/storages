const router = require('express').Router()
const adminController = require('../controllers/admin.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const adminSchema = require('../validates/admin.schema')

// POST
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
router.get('/all/groups',
    authMiddleware, accessMiddleware(false),
    adminController.allGroups)

router.get('/all/permissions',
    authMiddleware, accessMiddleware(false),
    adminController.allPermissions)

router.get('/all/subscriptions',
    authMiddleware, accessMiddleware(false),
    adminController.allSubscriptions)

router.get('/all/contacts',
    authMiddleware, accessMiddleware(false),
    adminController.allContacts)

// PUT
router.put('/update/permission',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addPermission, 'body'),
    adminController.updatePermission)

router.put('/update/subscription',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addSubscription, 'body'),
    adminController.updateSubscription)

router.put('/update/brand',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('brand_img'),
    valdidationMiddleware(adminSchema.addBrand, 'body'),
    adminController.updateBrand)

// DELETE
router.delete('/delete/group/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteGroup)

router.delete('/delete/permission/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteAccessPath)

router.delete('/delete/subscription/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteScubscription)

router.delete('/delete/brand/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteBrand)

router.put('/delete/storage/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteStorage)

router.put('/delete/category/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteCategory)

router.put('/delete/feature/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteFeature)

router.put('/delete/contact/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteContact)

// DEFAULT
router.get('/default', adminController.defaultCreate)

module.exports = router