const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const userSchema = require('../validates/user.schema')

// POST
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

router.post('/add/product/review',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addProductReview, 'body'),
    userController.addProductReview)

router.post('/add/like',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addLike, 'body'),
    userController.addLike)

router.post('/add/comment',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addComment, 'body'),
    userController.addComment)

router.post('/add/order',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addOrder, 'body'),
    userController.addOrder)

// GET
router.get('/profile/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.profile, 'params'),
    userController.userProfile)

router.get('/storages', userController.allStorageList)
router.get('/categories', userController.allCategoryList)
router.get('/brands', userController.allBrandList)
router.get('/product/search', userController.productSearch)

// DELETE
router.delete('/delete/product/:productId/user/:userId',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.addProductLike, 'params'),
    userController.deleteLike)

module.exports = router