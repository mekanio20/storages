const router = require('express').Router()
const sellerController = require('../controllers/seller.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const sellerSchema = require('../validates/seller.schema')

router.post('/register', 
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(sellerSchema.sellerRegister, 'body'),
    imagesMiddleware(process.env.SELLER_PATH).fields([
        { name: "logo", maxCount: 1 },
        { name: "bg_img", maxCount: 1 }
    ]),
    sellerController.sellerRegister)

router.get('/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.fetchOneSeller, 'params'),
    sellerController.fetchOneSeller)

router.put('/',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.updateSellerProfile, 'body'),
    sellerController.updateSellerProfile)

module.exports = router