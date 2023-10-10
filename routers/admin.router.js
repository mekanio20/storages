const router = require('express').Router()
const adminController = require('../controllers/admin.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const adminSchema = require('../validates/admin.schema')

/**
 * @swagger
 *  /api/admin/add/group:
 *    post:
 *      summary: Create a new group
 *      tags: [Admin]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: Group name
 *      responses:
 *        201:
 *          description: Group created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

router.post('/add/group',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addGroup, 'body'),
    adminController.addGroup)

/**
* @swagger
*  /api/admin/add/permission:
*    post:
*      summary: Create a new permission
*      tags: [Admin]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                url:
*                  type: string
*                  description: Permission url
*                method:
*                  type: string
*                  description: Permission method
*                groupId:
*                  type: number
*                  description: Permission method
*      responses:
*        201:
*          description: Permission created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/permission',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addPermission, 'body'),
    adminController.addAccessPath)

/**
* @swagger
*  /api/admin/add/storage:
*    post:
*      summary: Create a new storage
*      tags: [Admin]
*      requestBody:
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                tm_name:
*                  type: string
*                  required: true
*                  description: Storage name
*                ru_name:
*                  type: string
*                  required: false
*                  description: Storage name
*                en_name:
*                  type: string
*                  required: false
*                  description: Storage name
*      responses:
*        201:
*          description: Storage created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/storage',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addStorage, 'body'),
    adminController.addStorage)

/**
* @swagger
*  /api/admin/add/category:
*    post:
*      summary: Create a new category
*      tags: [Admin]
*      requestBody:
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                tm_name:
*                  type: string
*                  required: true
*                  description: Category name
*                ru_name:
*                  type: string
*                  required: false
*                  description: Category name
*                en_name:
*                  type: string
*                  required: false
*                  description: Category name
*                storageId:
*                  type: number
*                  required: true
*                  description: storage id
*      responses:
*        201:
*          description: Category created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/category',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addCategory, 'body'),
    adminController.addCategory)

/**
* @swagger
*  /api/admin/add/subcateogory:
*    post:
*      summary: Create a new subcateogory
*      tags: [Admin]
*      requestBody:
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                tm_name:
*                  type: string
*                  required: true
*                  description: Subcateogory name
*                ru_name:
*                  type: string
*                  required: false
*                  description: Subcateogory name
*                en_name:
*                  type: string
*                  required: false
*                  description: Subcateogory name
*                categoryId:
*                  type: number
*                  required: true
*                  description: Sategory id
*      responses:
*        201:
*          description: Subcateogory created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/subcateogory',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addSubcategory, 'body'),
    adminController.addSubcategory)

/**
* @swagger
*  /api/admin/add/feature:
*    post:
*      summary: Create a new feature
*      tags: [Admin]
*      requestBody:
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                tm_name:
*                  type: string
*                  required: true
*                  description: Feature name
*                ru_name:
*                  type: string
*                  required: false
*                  description: Feature name
*                en_name:
*                  type: string
*                  required: false
*                  description: Feature name
*      responses:
*        201:
*          description: Feature created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/feature',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addFeature, 'body'),
    adminController.addFeature)

/**
* @swagger
*  /api/admin/add/feature/desc:
*    post:
*      summary: Create a new feature description
*      tags: [Admin]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                desc:
*                  type: string
*                  description: Feature description
*                featureId:
*                  type: number
*                  description: Feature id
*      responses:
*        201:
*          description: Feature description created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/feature/desc',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addFeatureDescription, 'body'),
    adminController.addFeatureDescription)

/**
* @swagger
*  /api/admin/add/subcategory/feature:
*    post:
*      summary: Create a new subcategory feature
*      tags: [Admin]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                subcategoryId:
*                  type: number
*                  description: Subcategory id
*                featureId:
*                  type: number
*                  description: Feature id
*      responses:
*        201:
*          description: Subcategory feature created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/subcategory/feature',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addSubcategoryFeature, 'body'),
    adminController.addSubcategoryFeature)

/**
 * @swagger
 * components:
 *   schemas:
 *     BrandImageUpload:
 *       type: object
 *       properties:
 *         brand_img:
 *           type: string
 *           format: binary
 *         name:
 *           type: string 
 *         desc:
 *           type: string
 *         userId:
 *           type: number
 */

/**
* @swagger
*  /api/admin/add/brand:
*    post:
*      summary: Create a new brand
*      tags: [Admin]
*      requestBody:
*        required: true
*        content:
*          multipart/form-data:
*            schema:
*              $ref: '#/components/schemas/BrandImageUpload'
*      responses:
*        201:
*          description: Brand created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/brand',
    // authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BRANDS_PATH).single('brand_img'),
    valdidationMiddleware(adminSchema.addBrand, 'body'),
    adminController.addBrand)

/**
* @swagger
*  /api/admin/add/staff:
*    post:
*      summary: Create a new staff
*      tags: [Admin]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                userId:
*                  type: number
*                  description: User id
*      responses:
*        201:
*          description: Staff created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/staff',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addStaff, 'body'),
    adminController.addStaff)

/**
* @swagger
*  /api/admin/add/subscription:
*    post:
*      summary: Create a new subscription
*      tags: [Admin]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                name:
*                  type: string
*                  description: Subscription name
*                order:
*                  type: number
*                  description: Subscription order
*                p_limit:
*                  type: number
*                  description: Subscription product limit
*                p_img_limit:
*                  type: number
*                  description: Subscription product image limit
*                seller_banner_limit:
*                  type: number
*                  description: Subscription seller banner limit
*                main_banner_limit:
*                  type: number
*                  description: Subscription main banner limit
*                ntf_limit:
*                  type: number
*                  description: Subscription notification limit
*                voucher_limit:
*                  type: number
*                  description: Subscription voucher limit
*                smm_support:
*                  type: boolean
*                  description: Subscription smm_support
*                tech_support:
*                  type: boolean
*                  description: Subscription tech_support
*      responses:
*        201:
*          description: Subscription created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/

router.post('/add/subscription',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(adminSchema.addSubscription, 'body'),
    adminController.addSubscription)

// DELETE
/**
* @swagger
* /api/admin/delete/permission/{id}:
*   delete:
*     tags: [Admin]
*     summary: Delete permission
*     parameters:
*       - name: id
*         description: Permission id
*         in: path
*         required: true
*         type: integer
*     responses:
*       200:
*         description: Permission deleted successfully
*       400:
*         description: Invalid request body
*       500:
*         description: Internal server error
*/

router.delete('/delete/permission/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.deletePermission, 'params'),
    adminController.deleteAccessPath)

/**
* @swagger
* /api/admin/delete/brand/{id}:
*   delete:
*     tags: [Admin]
*     summary: Delete brand
*     parameters:
*       - name: id
*         description: Brand id
*         in: path
*         required: true
*         type: integer
*     responses:
*       200:
*         description: Brand deleted successfully
*       400:
*         description: Invalid request body
*       500:
*         description: Internal server error
*/

router.delete('/delete/brand/:id',
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(adminSchema.deleteBrand, 'params'),
    adminController.deleteBrand)

// DEFAULT
router.get('/default', adminController.defaultCreate)

module.exports = router