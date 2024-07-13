const router = require('express').Router()
const sellerController = require('../controllers/seller.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const validationMiddleware = require('../middlewares/validation.middleware')
const sellerSchema = require('../validates/seller.schema')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/register',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.SELLERS_PATH).fields([
        { name: "logo", maxCount: 1 },
        { name: "bg_img", maxCount: 1 }
    ]),
    validationMiddleware(sellerSchema.sellerRegister, 'body'),
    sellerController.sellerRegister)

// GET
router.get('/',
    authMiddleware, accessMiddleware(false),
    sellerController.fetchSeller)

router.get('/top',
    validationMiddleware(baseSchema.queryControl, 'query'),
    sellerController.topSellers)

router.get('/all',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(sellerSchema.allSeller, 'query'),
    sellerController.allSeller)

router.get('/banners',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(sellerSchema.allBanners, 'query'),
    sellerController.allBanners)

router.get('/orders',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(sellerSchema.allOrders, 'query'),
    sellerController.allOrders)

router.get('/order/detail/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    sellerController.orderDetail)

router.get('/followers/:id',
    validationMiddleware(baseSchema.idControl, 'params'),
    sellerController.sellerFollowers)

router.get('/profile/:id', // customer ucin
    authMiddleware,
    validationMiddleware(baseSchema.idControl, 'params'),
    sellerController.profileSeller)

router.get('/products',
    validationMiddleware(sellerSchema.sellerProducts, 'query'),
    sellerController.sellerProducts)

router.get('/statistic',
    authMiddleware, accessMiddleware(false),
    sellerController.sellerStatistic)

router.get('/videos',
    authMiddleware,  accessMiddleware(false),
    validationMiddleware(sellerSchema.sellerVideos, 'query'),
    sellerController.sellerVideos)

// PUT
router.put('/update',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.SELLERS_PATH).fields([
        { name: "logo", maxCount: 1 },
        { name: "bg_img", maxCount: 1 }
    ]),
    validationMiddleware(sellerSchema.updateSellerProfile, 'body'),
    sellerController.updateSellerProfile)

router.put('/update/status',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(sellerSchema.updateOrderStatus, 'body'),
    sellerController.updateOrderStatus)

// DELETE
router.delete('/delete',
    authMiddleware, accessMiddleware(false),
    sellerController.deleteSeller)

module.exports = router