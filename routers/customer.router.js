const router = require('express').Router()
const customerController = require('../controllers/customer.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const customerSchema = require('../validates/customer.schema')

// POST
router.post('/register',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.CUSTOMER_PATH).single('img'),
    valdidationMiddleware(customerSchema.customerRegister, 'body'),
    customerController.customerRegister)

// GET
router.get('/all',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(customerSchema.allCustomer, 'query'),
    customerController.allCustomer)

router.get('/favorite',
    authMiddleware, accessMiddleware(false),
    customerController.customerfavorite)

router.get('/basket',
    authMiddleware, accessMiddleware(false),
    customerController.customerBasket)

router.get('/followed',
    authMiddleware, accessMiddleware(false),
    customerController.customerFollowed)

router.get('/orders',
    authMiddleware, accessMiddleware(false),
    customerController.customerOrders)

router.get('/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(customerSchema.idControl, 'params'),
    customerController.customerProfile)

module.exports = router