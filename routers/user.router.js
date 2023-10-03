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

router.post('/forgot', // should be updated
    valdidationMiddleware(userSchema.forgotPassword, 'body'), 
    userController.forgotPassword)

router.post('/register',
    valdidationMiddleware(userSchema.register, 'body'), 
    userController.userRegister)

router.post('/customer/register',
    valdidationMiddleware(userSchema.customerRegister, 'body'),
    userController.customerRegister)

router.post('/add/contact',
    valdidationMiddleware(userSchema.addContact, 'body'),
    userController.addContact)

router.get('/profile/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.profile, 'params'), 
    userController.userProfile)

router.get('/storages', userController.allStorageList)

router.get('/categories', userController.allCategoryList)

router.get('/brands', userController.allBrandList)

router.get('/product/search', userController.productSearch)

module.exports = router