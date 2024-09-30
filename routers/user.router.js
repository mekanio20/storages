const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const userSchema = require('../validates/user.schema')
const otpMiddleware = require('../middlewares/otp.middleware')
const fileMiddleware = require('../middlewares/file.middleware')
const limitterMiddleware = require('../middlewares/limitter.middleware')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/login',
    limitterMiddleware(),
    valdidationMiddleware(baseSchema.loginControl, 'body'),
    userController.userLogin)

router.post('/verification', // customer login ucin
    limitterMiddleware(),
    otpMiddleware,
    valdidationMiddleware(userSchema.check, 'body'),
    userController.userVerification)

router.post('/register',
    limitterMiddleware(),
    valdidationMiddleware(baseSchema.loginControl, 'body'),
    userController.userRegister)

router.post('/check', // user register ucin
    limitterMiddleware(),
    otpMiddleware,
    valdidationMiddleware(userSchema.check, 'body'),
    userController.checkControl)

router.post('/forgot', // paroly tazelemek ucin
    limitterMiddleware(),
    valdidationMiddleware(userSchema.forgotPassword, 'body'),
    userController.forgotPassword)

router.post('/reset/password', // paroly tazelemek ucin
    limitterMiddleware(),
    otpMiddleware,
    valdidationMiddleware(userSchema.check, 'body'),
    userController.resetPassword)

router.post('/reset/subscription', // seller login ucin
    limitterMiddleware(),
    otpMiddleware,
    valdidationMiddleware(userSchema.check, 'body'),
    userController.resetSubscription)

// ---------

router.post('/add/like',
    authMiddleware,
    // accessMiddleware(false),
    valdidationMiddleware(baseSchema.idControl, 'body'),
    userController.addLike)

router.post('/add/order',
    limitterMiddleware(null, 5),
    authMiddleware,
    // accessMiddleware(false),
    valdidationMiddleware(userSchema.addOrder, 'body'),
    userController.addOrder)

router.post('/add/basket',
    authMiddleware,
    // accessMiddleware(false),
    valdidationMiddleware(userSchema.addBasket, 'body'),
    userController.addBasket)

router.post('/add/follower/:id',
    authMiddleware,
    // accessMiddleware(true),
    valdidationMiddleware(baseSchema.idControl, 'params'),
    userController.addFollower)

router.post('/add/message',
    authMiddleware,
    // accessMiddleware(false),
    fileMiddleware(process.env.MESSAGE_FILES).single('file'),
    valdidationMiddleware(userSchema.addMessage, 'body'),
    userController.addMessage)

// GET
router.get('/all',
    authMiddleware,
    // accessMiddleware(false),
    valdidationMiddleware(baseSchema.queryControl, 'query'),
    userController.allUsers)

router.get('/messages/:id',
    authMiddleware,
    // accessMiddleware(true),
    valdidationMiddleware(baseSchema.idControl, 'params'),
    userController.allMessages)

router.get('/logout',
    authMiddleware,
    // accessMiddleware(false),
    userController.userLogout)

module.exports = router