const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const userSchema = require('../validates/user.schema')
const otpMiddleware = require('../middlewares/otp.middleware')

// POST
router.post('/login',
    valdidationMiddleware(userSchema.login, 'body'),
    userController.userLogin)

router.post('/forgot',
    valdidationMiddleware(userSchema.forgotPassword, 'body'),
    userController.forgotPassword)

router.post('/register',
    valdidationMiddleware(userSchema.register, 'body'),
    userController.userRegister)

router.post('/check',
    otpMiddleware,
    userController.checkControl)

router.post('/reset/password',
    otpMiddleware,
    userController.resetPassword)

router.post('/customer/register',
    valdidationMiddleware(userSchema.customerRegister, 'body'),
    userController.customerRegister)

router.post('/add/contact',
    valdidationMiddleware(userSchema.addContact, 'body'),
    userController.addContact)

router.post('/add/like',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.likeControl, 'body'),
    userController.addLike)

router.post('/add/order',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addOrder, 'body'),
    userController.addOrder)

router.post('/add/basket',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addBasket, 'body'),
    userController.addBasket)

router.post('/add/follower',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addFollower, 'body'),
    userController.addFollower)

router.post('/add/address',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addAddress, 'body'),
    userController.addAddress)

router.post('/add/message',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addMessage, 'body'),
    userController.addMessage)

// GET
router.get('/profile/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.idControl, 'params'),
    userController.userProfile)

router.get('/all',
    authMiddleware, accessMiddleware(false),
    userController.allUsers)

router.get('/likes/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.idControl), 
    userController.fetchLikes)

router.get('/storages', userController.allStorageList)
router.get('/categories', userController.allCategoryList)
router.get('/subcategories', userController.allSubcategoryList)
router.get('/features', userController.allFeatureList)
router.get('/brands', userController.allBrandList)
router.get('/product/search', userController.productSearch)

router.get('/basket/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.idControl, 'params'),
    userController.fetchOneBasket)

// DELETE
router.delete('/delete/product/:productId/user/:userId',
    authMiddleware,
    valdidationMiddleware(userSchema.likeControl, 'params'),
    userController.deleteLike)

module.exports = router