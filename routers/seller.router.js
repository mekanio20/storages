const router = require('express').Router()
const sellerController = require('../controllers/seller.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const sellerSchema = require('../validates/seller.schema')

router.post('/register',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.SELLERS_PATH).fields([
        { name: "logo", maxCount: 1 },
        { name: "bg_img", maxCount: 1 }
    ]),
    valdidationMiddleware(sellerSchema.sellerRegister, 'body'),
    sellerController.sellerRegister)

router.post('/add/product',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.PRODUCTS_PATH).fields([
        { name: "img", maxCount: 5 }
    ]),
    valdidationMiddleware(sellerSchema.addProduct, 'body'),
    sellerController.addProduct)

router.post('/add/product/feature',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(sellerSchema.addProductFeature, 'body'),
    sellerController.addProductFeature)

router.post('/add/offer',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(sellerSchema.addOffer, 'body'),
    sellerController.addOffer)

// GET
router.get('/:id',
    authMiddleware,
    // accessMiddleware(true),
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.fetchOneSeller)

router.get('/followers/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.fetchFollowers)

// PUT
router.put('/update',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.updateSellerProfile, 'body'),
    sellerController.updateSellerProfile)

// DELETE
router.delete('/:id',
    authMiddleware, 
    // accessMiddleware(true),
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.deleteSeller)

router.delete('/delete/product/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.deleteProduct)

module.exports = router