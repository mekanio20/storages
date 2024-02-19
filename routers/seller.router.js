const router = require('express').Router()
const sellerController = require('../controllers/seller.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const sellerSchema = require('../validates/seller.schema')

// POST
router.post('/register',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.SELLERS_PATH).fields([
        { name: "logo", maxCount: 1 },
        { name: "bg_img", maxCount: 1 }
    ]),
    valdidationMiddleware(sellerSchema.sellerRegister, 'body'),
    sellerController.sellerRegister)

// GET
router.get('/top',
    valdidationMiddleware(sellerSchema.queryParams, 'query'),
    sellerController.topSellers)

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
    sellerController.sellerFollowers)

router.get('/profile/:id',
    authMiddleware,
    valdidationMiddleware(sellerSchema.idControl, 'params'),
    sellerController.profileSeller)

router.get('/products',
    valdidationMiddleware(sellerSchema.sellerProucts, 'query'),
    sellerController.sellerProducts)

// PUT
router.put('/update',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.SELLERS_PATH).fields([
        { name: "logo", maxCount: 1 },
        { name: "bg_img", maxCount: 1 }
    ]),
    valdidationMiddleware(sellerSchema.updateSellerProfile, 'body'),
    sellerController.updateSellerProfile)

// DELETE
router.delete('/delete',
    authMiddleware, accessMiddleware(false),
    sellerController.deleteSeller)

module.exports = router