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

router.post('/add/offer',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(sellerSchema.addOffer, 'body'),
    sellerController.addOffer)

router.post('/add/coupon',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(sellerSchema.addCoupon, 'body'),
    sellerController.addCoupon)

// GET
router.get('/top', sellerController.topSellers)

router.get('/all',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(sellerSchema.allSeller, 'query'),
    sellerController.allSeller)

router.get('/orders',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(sellerSchema.allOrders, 'query'),
    sellerController.allOrders)

router.get('/order/detail/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.orderDetail)

router.get('/followers/:id',
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.fetchFollowers)

router.get('/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.fetchOneSeller)


// PUT
router.put('/update',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.updateSellerProfile, 'body'),
    sellerController.updateSellerProfile)

// DELETE
router.delete('/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.deleteSeller)

router.delete('/delete/product/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.deleteProduct)

module.exports = router