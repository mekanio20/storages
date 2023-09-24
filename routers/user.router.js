const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const userSchema = require('../validates/user.schema')

router.get('/default', userController.defaultCreate)

router.post('/login', 
    valdidationMiddleware(userSchema.login, 'body'), 
    userController.userLogin)

router.post('/register', 
    valdidationMiddleware(userSchema.register, 'body'), 
    userController.userRegister)

router.post('/customer/register', 
    valdidationMiddleware(userSchema.customerRegister, 'body'),
    userController.customerRegister)

router.get('/profile/:id', 
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.profile, 'params'), 
    userController.userProfile)

router.get('/storages', 
    // authMiddleware, accessMiddleware(false),
    userController.allStorageList)

router.get('/categories', 
    // authMiddleware, accessMiddleware(false),
    userController.allCategoryList)

router.get('/brands', 
    // authMiddleware, accessMiddleware(false),
    userController.allBrandList)

module.exports = router