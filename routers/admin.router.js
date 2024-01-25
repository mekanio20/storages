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

router.post('/add/category',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.STORAGE_PATH).single('logo'),
    valdidationMiddleware(adminSchema.addCategory, 'body'),
    adminController.addCategory)

router.post('/add/subcategory',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.STORAGE_PATH).single('logo'),
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
    valdidationMiddleware(adminSchema.allGroups, 'query'),
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
router.put('/update/group',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addGroup, 'body'),
    adminController.udpateGroup)

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

router.put('/update/category',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('logo'),
    valdidationMiddleware(adminSchema.addCategory, 'body'),
    adminController.updateCategory)

router.put('/update/subcategory',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('logo'),
    valdidationMiddleware(adminSchema.addSubcategory, 'body'),
    adminController.updateSubCategory)

router.put('/update/user',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.updateUser, 'body'),
    adminController.updateUser)

router.put('/update/seller',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.updateSeller, 'body'),
    adminController.updateSeller)

router.put('/update/product',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.updateStatus, 'body'),
    adminController.updateProduct)

router.put('/update/comment',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.updateStatus, 'body'),
    adminController.updateComment)

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

router.delete('/delete/category/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteCategory)

router.delete('/delete/subcategory/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteSubCategory)

router.delete('/delete/user/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteUser)

router.delete('/delete/customer/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteCustomer)

router.delete('/delete/seller/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.idControl, 'params'),
    adminController.deleteSeller)

// DEFAULT
router.get('/default', adminController.defaultCreate)

module.exports = router