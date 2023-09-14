const router = require('express').Router()
const adminController = require('../controllers/admin.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const adminSchema = require('../validates/admin.schema')

router.post('/add/group',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addGroup, 'body'),
    adminController.addGroup)

router.post('/add/role',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addRole, 'body'),
    adminController.addRole)

router.post('/add/permission',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addPermission, 'body'), 
    adminController.addAccessPath)

router.post('/add/storage',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addStorage, 'body'),
    adminController.addStorage)

router.post('/add/category', 
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addCategory, 'body'),
    adminController.addCategory)

router.delete('/delete/')

router.delete('/delete/permission/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.deleteGroup, 'params'), 
    adminController.deleteAccessPath)

module.exports = router