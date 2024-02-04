const router = require('express').Router()
const productController = require('../controllers/product.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const validationMiddleware = require('../middlewares/validation.middleware')
const productSchema = require('../validates/product.schema')

// POST
router.post('/add',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.PRODUCTS_PATH).fields([
        { name: "img", maxCount: 20 }
    ]),
    validationMiddleware(productSchema.addProduct, 'body'),
    productController.addProduct)

router.post('/add/review',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(productSchema.addProductReview, 'body'),
    productController.addProductReview)

router.post('/add/coupon',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(productSchema.addCoupon, 'body'),
    productController.addCoupon)

// GET
router.get('/all',
    validationMiddleware(productSchema.allProduct, 'query'),
    productController.allProduct)

router.get('/top/selling',
    validationMiddleware(productSchema.queryParams, 'query'),
    productController.topSelling)

router.get('/top/liked',
    validationMiddleware(productSchema.queryParams, 'query'),
    productController.topLiked)

router.get('/reviews/:id',
    validationMiddleware(productSchema.idControl, 'params'),
    productController.fetchReview)

router.get('/categories',
    validationMiddleware(productSchema.queryParams, 'query'),
    productController.allCategory)

router.get('/subcategories',
    validationMiddleware(productSchema.queryParams, 'query'),
    productController.allSubcategory)

router.get('/features',
    validationMiddleware(productSchema.queryParams, 'query'),
    productController.allFeature)

router.get('/brands',
    validationMiddleware(productSchema.queryParams, 'query'),
    productController.allBrands)

router.get('/:slug', productController.fetchProduct)

// DELETE
router.delete('/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(productSchema.idControl, 'params'),
    productController.deleteProduct)

module.exports = router