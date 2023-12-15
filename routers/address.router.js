const router = require('express').Router()
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const addressController = require('../controllers/address.controller')
const addressSchema = require('../validates/address.schema')

// POST
router.post('/add',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(addressSchema.addAddress, 'body'),
    addressController.addAddress)

// GET
router.get('/all',
    authMiddleware, accessMiddleware(false),
    addressController.allAddress)

module.exports = router