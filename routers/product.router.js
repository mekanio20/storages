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

router.post('/add/feature',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(productSchema.addProductFeature, 'body'),
    productController.addProductFeature)

router.post('/add/review',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(productSchema.addProductReview, 'body'),
    productController.addProductReview)

// GET
router.get('/all', 
    validationMiddleware(productSchema.allProduct, 'query'),
    productController.allProduct)

router.get('/:slug', productController.fetchProduct)

router.get('/reviews/:id', 
    validationMiddleware(productSchema.idControl, 'params'),
    productController.fetchReview)

module.exports = router