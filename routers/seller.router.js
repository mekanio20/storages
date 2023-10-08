const router = require('express').Router()
const sellerController = require('../controllers/seller.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const sellerSchema = require('../validates/seller.schema')

/**
 * @swagger
 * components:
 *   schemas:
 *     SellerImageUpload:
 *       type: object
 *       properties:
 *         logo:
 *           type: string
 *           format: binary
 *         bg_img:
 *           type: string
 *           format: binary
 *         name:
 *           type: string
 *         store_number:
 *           type: number
 *         store_floor:
 *           type: number
 *         about:
 *           type: string
 *         color:
 *           type: string
 *         seller_type:
 *           type: string
 *           enum:
 *             - in-opt
 *             - out-opt
 *         sell_type:
 *           type: string
 *           enum:
 *             - wholesale
 *             - partial
 *             - both
 *         instagram:
 *           type: string
 *         tiktok:
 *           type: string
 *         main_number:
 *           type: string
 *         second_number:
 *           type: string
 *         userId:
 *           type: number
 *         categoryId:
 *           type: number
 *         subscriptionId:
 *           type: number
 */

/**
* @swagger
*  /api/seller/register:
*    post:
*      summary: Create a new seller
*      tags: [Seller]
*      requestBody:
*        content:
*          multipart/form-data:
*            schema:
*              $ref: '#/components/schemas/SellerImageUpload'
*      responses:
*        201:
*          description: Seller created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/register',
    // authMiddleware, accessMiddleware(false),
    // valdidationMiddleware(sellerSchema.sellerRegister, 'body'),
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