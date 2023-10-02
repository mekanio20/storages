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
    imagesMiddleware(process.env.SELLERS_PATH).fields([
        { name: "logo", maxCount: 1 },
        { name: "bg_img", maxCount: 1 }
    ]),
    sellerController.sellerRegister)

router.post('/add/product',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.addProduct, 'body'),
    imagesMiddleware(process.env.PRODUCTS_PATH).fields([
        { name: "img", maxCount: 5 }
    ]),
    sellerController.addProduct)

router.get('/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.fetchOneSeller, 'params'),
    sellerController.fetchOneSeller)

router.put('/',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.updateSellerProfile, 'body'),
    sellerController.updateSellerProfile)

// DELETE
router.delete('/delete/product/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.deleteProduct, 'params'),
    sellerController.deleteProduct)

module.exports = router