const router = require('express').Router()
const customerController = require('../controllers/customer.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const customerSchema = require('../validates/customer.schema')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/register',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.CUSTOMER_PATH).single('img'),
    valdidationMiddleware(customerSchema.customerRegister, 'body'),
    customerController.customerRegister)

// GET
router.get('/all',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(baseSchema.queryControl, 'query'),
    customerController.allCustomer)

router.get('/favorite',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(baseSchema.queryControl, 'query'),
    customerController.customerfavorite)

router.get('/basket',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(baseSchema.queryControl, 'query'),
    customerController.customerBasket)

router.get('/followed',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(baseSchema.queryControl, 'query'),
    customerController.customerFollowed)

router.get('/orders',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(baseSchema.queryControl, 'query'),
    customerController.customerOrders)

router.get('/profile',
    authMiddleware, accessMiddleware(false),
    customerController.customerProfile)

module.exports = router