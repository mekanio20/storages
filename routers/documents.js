// -------------- ADMIN --------------- //


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


// -------------------- BANNER ---------------- //


/**
 * @swagger
 * components:
 *   schemas:
 *     BannerImageUpload:
 *       type: object
 *       properties:
 *         tm_img:
 *           type: string
 *           format: binary
 *         ru_img:
 *           type: string
 *           format: binary
 *         en_img:
 *           type: string
 *           format: binary
 *         url:
 *           type: string
 *         type:
 *           type: string
 *           enum:
 *             - home
 *             - profile
 *             - product
 *             - category
 *             - ad
 *             - etc
 *         sort_order:
 *           type: number
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         userId:
 *           type: number
 */

/**
* @swagger
*  /api/banner/add:
*    post:
*      summary: Create a new banner
*      tags: [Banner]
*      requestBody:
*        content:
*          multipart/form-data:
*            schema:
*              $ref: '#/components/schemas/BannerImageUpload'
*      responses:
*        201:
*          description: Banner created successfully
*        400:
*          description: Invalid request body
*        500:
*          description: Internal server error
*/


// ------------- NOTIFICATION ------------- //


/**
 * @swagger
 *  /api/notification/add:
 *    post:
 *      summary: Create a new notification
 *      tags: [Notification]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                receivers:
 *                  type: string
 *                  enum:
 *                    - all
 *                    - my-customers
 *                title:
 *                  type: string
 *                desc:
 *                  type: string
 *                send_date:
 *                  type: string
 *                  format: date
 *                userId:
 *                  type: number
 *      responses:
 *        201:
 *          description: Notification created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */


// --------------- SELLER -------------- //


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


// -------------- USER ------------- //


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