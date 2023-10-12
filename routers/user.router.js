const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const userSchema = require('../validates/user.schema')

// POST
/**
 * @swagger
 *  /api/user/login:
 *    post:
 *      summary: Login user
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phone:
 *                  type: string
 *                  description: User phone
 *                password:
 *                  type: string
 *                  description: User password
 *      responses:
 *        200:
 *          description: User login successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

router.post('/login',
    valdidationMiddleware(userSchema.login, 'body'),
    userController.userLogin)

/**
* @swagger
*  /api/user/forgot:
*    post:
*      summary: Forgot password
*      tags: [User]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                phone:
*                  type: string
*                  description: User phone
*                orgPass:
*                  type: string
*                  description: User original password
*                verifPass:
*                  type: string
*                  description: User verify password
*      responses:
*        200:
*          description: Forgot password successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/forgot', // should be updated
    valdidationMiddleware(userSchema.forgotPassword, 'body'),
    userController.forgotPassword)

/**
* @swagger
*  /api/user/register:
*    post:
*      summary: User register
*      tags: [User]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                phone:
*                  type: string
*                  description: User phone
*                password:
*                  type: string
*                  description: User password
*      responses:
*        201:
*          description: User register successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/register',
    valdidationMiddleware(userSchema.register, 'body'),
    userController.userRegister)

/**
* @swagger
*  /api/user/customer/register:
*    post:
*      summary: Customer register
*      tags: [User]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                fullname:
*                  type: string
*                  description: Customer fullname
*                gender:
*                  type: string
*                  description: Customer gender
*                email:
*                  type: string
*                  description: Customer email
*                userId:
*                  type: number
*                  description: Customer user id
*      responses:
*        201:
*          description: Customer register successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/customer/register',
    valdidationMiddleware(userSchema.customerRegister, 'body'),
    userController.customerRegister)

/**
* @swagger
*  /api/user/add/contact:
*    post:
*      summary: Add Contact
*      tags: [User]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                phone:
*                  type: string
*                  description: User phone
*                email:
*                  type: string
*                  description: User email
*                fullname:
*                  type: string
*                  description: User fullname
*                message:
*                  type: string
*                  description: User message
*                userId:
*                  type: number
*                  description: User id
*      responses:
*        201:
*          description: Contact add successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/contact',
    valdidationMiddleware(userSchema.addContact, 'body'),
    userController.addContact)

/**
* @swagger
*  /api/user/add/product/review:
*    post:
*      summary: Add Review
*      tags: [User]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                star:
*                  type: string
*                  description: Review star
*                productId:
*                  type: number
*                  description: Product id
*                customerId:
*                  type: number
*                  description: Customer id
*      responses:
*        201:
*          description: Review add successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/product/review',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addProductReview, 'body'),
    userController.addProductReview)

/**
* @swagger
*  /api/user/add/like:
*    post:
*      summary: Add Like
*      tags: [User]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                productId:
*                  type: number
*                  description: Product id
*                userId:
*                  type: number
*                  description: Customer id
*      responses:
*        201:
*          description: Like add successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/like',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addLike, 'body'),
    userController.addLike)

/**
* @swagger
*  /api/user/add/comment:
*    post:
*      summary: Add Comments
*      tags: [User]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                customerId:
*                  type: number
*                  description: Customer id
*                productId:
*                  type: number
*                  description: Product id
*                comment:
*                  type: string
*                  description: Comment
*      responses:
*        201:
*          description: Comment add successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/comment',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addComment, 'body'),
    userController.addComment)

/**
* @swagger
*  /api/user/add/order:
*    post:
*      summary: Add Orders
*      tags: [User]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                fullname:
*                  type: string
*                  description: Fullname
*                phone:
*                  type: number
*                  description: Customer phone
*                address:
*                  type: string
*                  description: Customer address
*                payment:
*                  type: string
*                  description: Customer payment
*                amount:
*                  type: string
*                  description: Customer amount
*                note:
*                  type: string
*                  description: Customer note
*                customerId:
*                  type: number
*                  description: CustomerId
*                productId:
*                  type: number
*                  description: ProductId
*      responses:
*        201:
*          description: Order add successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/order',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(userSchema.addOrder, 'body'),
    userController.addOrder)

// GET
/**
* @swagger
*  /api/user/profile/{id}:
*    get:
*      summary: Get profile
*      tags: [User]
*      parameters:
*        - name: id
*          in: path
*          required: true
*          description: User id
*          type: integer
*      responses:
*        200:
*          description: Profile fetched successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.get('/profile/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.profile, 'params'),
    userController.userProfile)

/**
* @swagger
*  /api/user/storages:
*    get:
*      summary: Get all storages
*      tags: [User]
*      responses:
*        200:
*          description: Storages fetched successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.get('/storages', userController.allStorageList)

/**
* @swagger
*  /api/user/categories:
*    get:
*      summary: Get all categories
*      tags: [User]
*      responses:
*        200:
*          description: Categories fetched successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.get('/categories', userController.allCategoryList)

/**
* @swagger
*  /api/user/brands:
*    get:
*      summary: Get all brands
*      tags: [User]
*      responses:
*        200:
*          description: Brands fetched successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.get('/brands', userController.allBrandList)

/**
* @swagger
*  /api/user/product/search:
*    get:
*      summary: Product search
*      tags: [User]
*      parameters:
*        - name: name
*          in: query
*          required: true
*          description: Search name
*          type: string
*        - name: page
*          in: query
*          required: false
*          description: Search page
*          type: number
*        - name: limit
*          in: query
*          required: false
*          description: Search limit
*          type: number
*      responses:
*        200:
*          description: Search operation successful
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.get('/product/search', userController.productSearch)

// DELETE

/**
* @swagger
* /api/user/product/{productId}/user/{userId}:
*   delete:
*     tags: [User]
*     summary: Delete product like
*     parameters:
*       - name: productId
*         description: Product id
*         in: path
*         required: true
*         type: integer
*       - name: userId
*         description: User id
*         in: path
*         required: true
*         type: integer
*     responses:
*       200:
*         description: Product like deleted successfully
*       400:
*         description: Invalid request body
*       500:
*         description: Internal server error
*/
router.delete('/delete/product/:productId/user/:userId',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.addProductLike, 'params'),
    userController.deleteLike)

module.exports = router