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
    imagesMiddleware(process.env.SELLERS_PATH).fields([
        { name: "logo", maxCount: 1 },
        { name: "bg_img", maxCount: 1 }
    ]),
    valdidationMiddleware(sellerSchema.sellerRegister, 'body'),
    sellerController.sellerRegister)

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImageUpload:
 *       type: object
 *       properties:
 *         img:
 *           type: string
 *           format: binary
 *         tm_name:
 *           type: string
 *         ru_name:
 *           type: string
 *         en_name:
 *           type: string
 *         tm_desc:
 *           type: string
 *         ru_desc:
 *           type: string
 *         en_desc:
 *           type: string
 *         barcode:
 *           type: number
 *         stock_code:
 *           type: string
 *         quantity:
 *           type: number
 *         org_price:
 *           type: number
 *         sale_price:
 *           type: number
 *         gender:
 *           type: string
 *           enum:
 *             - male
 *             - fmale
 *             - male-child
 *             - fmale-child
 *             - non-gender
 *         subcategoryId:
 *           type: number
 *         brandId:
 *           type: number
 *         sellerId:
 *           type: number
 */

/**
* @swagger
*  /api/seller/add/product:
*    post:
*      summary: Create a new product
*      tags: [Seller]
*      requestBody:
*        content:
*          multipart/form-data:
*            schema:
*              $ref: '#/components/schemas/ProductImageUpload'
*      responses:
*        201:
*          description: Product created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/product',
    // authMiddleware, accessMiddleware(true),
    imagesMiddleware(process.env.PRODUCTS_PATH).fields([
        { name: "img", maxCount: 5 }
    ]),
    valdidationMiddleware(sellerSchema.addProduct, 'body'),
    sellerController.addProduct)

// GET
/**
* @swagger
*  /api/seller/{id}:
*    get:
*      summary: Get seller
*      tags: [Seller]
*      parameters:
*        - name: id
*          in: path
*          required: true
*          description: Seller id
*          type: integer
*      responses:
*        200:
*          description: Seller fetched successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.get('/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.fetchOneSeller, 'params'),
    sellerController.fetchOneSeller)

// PUT
/**
 * @swagger
 * components:
 *   schemas:
 *     SellerUpdateProfile:
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
 *         categoryId:
 *           type: number
 */

/**
* @swagger
*  /api/seller/:
*    put:
*      summary: Update seller
*      tags: [Seller]
*      requestBody:
*        content:
*          multipart/form-data:
*            schema:
*              $ref: '#/components/schemas/SellerUpdateProfile'
*      responses:
*        200:
*          description: Seller updated successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.put('/',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.updateSellerProfile, 'body'),
    sellerController.updateSellerProfile)

// DELETE
/**
* @swagger
* /api/seller/product/{id}:
*   delete:
*     tags: [Seller]
*     summary: Delete product
*     parameters:
*       - name: id
*         description: Product id
*         in: path
*         required: true
*         type: integer
*     responses:
*       200:
*         description: Product deleted successfully
*       400:
*         description: Invalid request body
*       500:
*         description: Internal server error
*/
router.delete('/delete/product/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(sellerSchema.deleteProduct, 'params'),
    sellerController.deleteProduct)

module.exports = router