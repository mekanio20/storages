const router = require('express').Router()
const productController = require('../controllers/product.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const validationMiddleware = require('../middlewares/validation.middleware')
const productSchema = require('../validates/product.schema')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/add',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.PRODUCTS_PATH).fields([
        { name: "img", maxCount: 10 }
    ]),
    validationMiddleware(productSchema.addProduct, 'body'),
    productController.addProduct)

router.post('/add/image',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.PRODUCTS_PATH).fields([
        { name: 'img', maxCount: 10 }
    ]),
    validationMiddleware(baseSchema.idControl, 'body'),
    productController.addProductImage)

router.post('/add/review',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(productSchema.addProductReview, 'body'),
    productController.addProductReview)

router.post('/add/coupon',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.PRODUCTS_PATH).single('img'),
    validationMiddleware(productSchema.addCoupon, 'body'),
    productController.addCoupon)

router.post('/add/offer',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(productSchema.addOffer, 'body'),
    productController.addOffer)

// GET
router.get('/all',
    validationMiddleware(productSchema.allProduct, 'query'),
    productController.allProduct)

router.get('/search',
    validationMiddleware(productSchema.searchProduct, 'query'),
    productController.searchProduct)

router.get('/offers',
    validationMiddleware(baseSchema.queryControl, 'query'),
    productController.offerProduct)

router.get('/top/selling',
    validationMiddleware(baseSchema.queryControl, 'query'),
    productController.topSelling)

router.get('/top/liked',
    validationMiddleware(baseSchema.queryControl, 'query'),
    productController.topLiked)

router.get('/top/rated',
    validationMiddleware(baseSchema.queryControl, 'query'),
    productController.topRated)

router.get('/reviews/:id',
    validationMiddleware(baseSchema.idControl, 'params'),
    productController.fetchReview)

router.get('/categories',
    validationMiddleware(baseSchema.queryControl, 'query'),
    productController.allCategory)

router.get('/subcategories',
    validationMiddleware(baseSchema.queryControl, 'query'),
    productController.allSubcategory)

router.get('/brands',
    validationMiddleware(baseSchema.queryControl, 'query'),
    productController.allBrands)

router.get('/likes',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(productSchema.productLikes, 'query'),
    productController.productLikes)

router.get('/:slug', productController.fetchProduct)

// PUT
router.put('/update',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(productSchema.updateProduct, 'body'),
    productController.updateProduct)

// DELETE
router.delete('/image/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    productController.deleteProductImage)

router.delete('/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    productController.deleteProduct)

module.exports = router