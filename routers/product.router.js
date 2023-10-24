const router = require('express').Router()
const productController = require('../controllers/product.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const productSchema = require('../validates/product.schema')

router.post('/add',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.PRODUCTS_PATH).fields([
        { name: "img", maxCount: 5 }
    ]),
    valdidationMiddleware(productSchema.addProduct, 'body'),
    productController.addProduct)

router.post('/add/feature',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(productSchema.addProductFeature, 'body'),
    productController.addProductFeature)

router.post('/add/review',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(productSchema.addProductReview, 'body'),
    productController.addProductReview)

module.exports = router