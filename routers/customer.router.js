const router = require('express').Router()
const customerController = require('../controllers/customer.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const customerSchema = require('../validates/customer.schema')

// GET
router.get('/all',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(customerSchema.allCustomer, 'query'),
    customerController.allCustomer)

module.exports = router