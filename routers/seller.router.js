const router = require('express').Router()
const sellerController = require('../controllers/seller.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const sellerSchema = require('../validates/seller.schema')

router.post('/register', 
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(sellerSchema.sellerRegister),
    sellerController.sellerRegister)

module.exports = router