// -------------- ADMIN --------------- //

/**
 * @swagger
 *  /api/admin/login-page:
 *    post:
 *      summary: Admin login
 *      tags: [Admin]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phone:
 *                  type: string
 *                  description: Phone number
 *                password:
 *                  type: string
 *                  description: Password
 *      responses:
 *        201:
 *          description: Login successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/add/group:
 *    post:
 *      summary: Create a new group
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  required: true
 *                isActive:
 *                  type: boolean
 *                  default: false
 *                  required: false
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
 * components:
 *   schemas:
 *     CategoryImageUpload:
 *       type: object
 *       properties:
 *         logo:
 *           type: string
 *           format: binary
 *         tm_name:
 *           type: string
 *         ru_name:
 *           type: string
 *         en_name:
 *           type: string
 *         isActive:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 *  /api/admin/add/category:
 *    post:
 *      summary: Create a new category
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CategoryImageUpload'
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
 * components:
 *   schemas:
 *     SubCategoryImageUpload:
 *       type: object
 *       properties:
 *         logo:
 *           type: string
 *           format: binary
 *         tm_name:
 *           type: string
 *         ru_name:
 *           type: string
 *         en_name:
 *           type: string
 *         categoryId:
 *           type: number
 *         isActive:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 *  /api/admin/add/subcateogory:
 *    post:
 *      summary: Create a new subcateogory
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/SubCategoryImageUpload'
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
 *                ru_name:
 *                  type: string
 *                  required: false
 *                en_name:
 *                  type: string
 *                  required: false
 *                isActive:
 *                  type: boolean
 *                  default: false
 *                  required: false
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
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                desc:
 *                  type: string
 *                  required: true
 *                featureId:
 *                  type: number
 *                isActive:
 *                  type: boolean
 *                  default: false
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
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                subcategoryId:
 *                  type: number
 *                  required: true
 *                featureId:
 *                  type: number
 *                  required: true
 *                isActive:
 *                  type: boolean
 *                  default: false
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
 *           required: true
 *         desc:
 *           type: string
 *           required: true
 *         isActive:
 *           type: boolean
 *           default: false
 *           required: false
 */

/**
 * @swagger
 *  /api/admin/add/brand:
 *    post:
 *      summary: Create a new brand
 *      tags: [Admin]
 *      requestBody:
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
 *                id:
 *                  type: number
 *      responses:
 *        201:
 *          description: Staff created successfully
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
 *                price:
 *                  type: number
 *                  description: Subscription price
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
 *                  default: false
 *                  description: Subscription smm_support
 *                tech_support:
 *                  type: boolean
 *                  default: false
 *                  description: Subscription tech_support
 *      responses:
 *        201:
 *          description: Subscription created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

// SCHEMA
/**
 * @swagger
 * components:
 *   schemas:
 *     QueryControl:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           in: query
 *           required: false
 *         limit:
 *           type: number
 *           in: query
 *           required: false
 *         order:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *           in: query
 *           required: false
 *         status:
 *           type: string
 *           enum: [all, true, false]
 *           in: query
 *           required: false
 */

/**
 * @swagger
 *  /api/admin/all/groups:
 *    get:
 *      summary: Admin all groups
 *      tags: [Admin]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Admin all groups successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/all/permissions:
 *    get:
 *      summary: Admin all permissions
 *      tags: [Admin]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Admin all permissions successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/all/subscriptions:
 *    get:
 *      summary: Admin all subscriptions
 *      tags: [Admin]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Admin all subscriptions successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/admin/all/features:
 *   get:
 *     summary: Admin all features
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *     responses:
 *       200:
 *         description: Admin all features successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/feature/descriptions:
 *   get:
 *     summary: Admin all feature descriptions
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *       - in: query
 *         name: featureId
 *         type: number
 *         minimum: 1
 *     responses:
 *       200:
 *         description: Admin all feature descriptions successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/subcategory/features:
 *   get:
 *     summary: Admin all subcategory features
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *       - in: query
 *         name: subcategoryId
 *         type: number
 *         minimum: 1
 *     responses:
 *       200:
 *         description: Admin all subcategory features descriptions successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/all/systems:
 *    get:
 *      summary: Get all systems
 *      tags: [Admin]
 *      responses:
 *        200:
 *          description: Successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/register/statistic:
 *    get:
 *      summary: Get register statistic
 *      tags: [Admin]
 *      responses:
 *        200:
 *          description: Successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/group:
 *    put:
 *      summary: Update group
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                name:
 *                  type: string
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Group updated successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/permission:
 *    put:
 *      summary: Update permission
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                url:
 *                  type: string
 *                method:
 *                  type: string
 *                  enum:
 *                    - GET
 *                    - POST
 *                    - PUT
 *                    - DELETE
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Permission updated successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/subscription:
 *    put:
 *      summary: Update subscription
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                name:
 *                  type: string
 *                price:
 *                  type: number
 *                order:
 *                  type: number
 *                p_limit:
 *                  type: number
 *                p_img_limit:
 *                  type: number
 *                seller_banner_limit:
 *                  type: number
 *                main_banner_limit:
 *                  type: number
 *                ntf_limit:
 *                  type: number
 *                voucher_limit:
 *                  type: number
 *                smm_support:
 *                  type: boolean
 *                  default: false
 *                tech_support:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Subscription updated successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/brand:
 *    put:
 *      summary: Update brand
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                brand_img:
 *                  type: string
 *                  format: binary
 *                name:
 *                  type: string
 *                desc:
 *                  type: string
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        201:
 *          description: Update brand successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/category:
 *    put:
 *      summary: Update category
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                logo:
 *                  type: string
 *                  format: binary
 *                tm_name:
 *                  type: string
 *                ru_name:
 *                  type: string
 *                en_name:
 *                  type: string
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        201:
 *          description: Update category successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/subcategory:
 *    put:
 *      summary: Update subcategory
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                logo:
 *                  type: string
 *                  format: binary
 *                tm_name:
 *                  type: string
 *                ru_name:
 *                  type: string
 *                en_name:
 *                  type: string
 *                categoryId:
 *                  type: number
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        201:
 *          description: Update subcategory successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/user:
 *    put:
 *      summary: Update user
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                isActive:
 *                  type: boolean
 *                  default: false
 *                isCustomer:
 *                  type: boolean
 *                  default: false
 *                isSeller:
 *                  type: boolean
 *                  default: false
 *                isStaff:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Update user successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/seller:
 *    put:
 *      summary: Update seller
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                isVerified:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Update seller successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/product:
 *    put:
 *      summary: Update product
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Update product successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/comment:
 *    put:
 *      summary: Update comment
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Update comment successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/feature:
 *    put:
 *      summary: Update feature
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                tm_name:
 *                  type: string
 *                ru_name:
 *                  type: string
 *                en_name:
 *                  type: string
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Update feature successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/feature/descriptions:
 *    put:
 *      summary: Update feature descriptions
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                desc:
 *                  type: string
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Update feature descriptions successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/admin/update/subcategory/feature:
 *    put:
 *      summary: Update subcategory feature
 *      tags: [Admin]
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                featureId:
 *                  type: number
 *                subcategoryId:
 *                  type: number
 *                isActive:
 *                  type: boolean
 *                  default: false
 *      responses:
 *        200:
 *          description: Update subcategory feature successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/group/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete group
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete group successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/permission/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete permission
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete permission successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/subscription/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete subscription
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete subscription successfully
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
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete brand successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/category/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete category
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete category successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/subcategory/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete subcategory
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete subcategory successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/user/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete user successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/customer/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete customer
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete customer successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/seller/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete seller
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete seller successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/feature/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete feature
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete feature successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/feature/desc/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete feature desc
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete feature desc successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/subcategory/feature/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete subcategory feature
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete subcategory feature successfully
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

/**
 * @swagger
 *  /api/banner/all:
 *    get:
 *      summary: Get all banners
 *      tags: [Banner]
 *      parameters:
 *        - in: query
 *          name: page
 *          type: number
 *          minimum: 1
 *        - in: query
 *          name: limit
 *          type: number
 *          minimum: 1
 *        - in: query
 *          name: order
 *          type: string
 *          enum: [asc, desc]
 *          default: asc
 *        - in: query
 *          name: status
 *          type: string
 *          enum: [all, true, false]
 *          default: all
 *      responses:
 *        200:
 *          description: Successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/banner/delete/{id}:
 *   delete:
 *     tags: [Banner]
 *     summary: Delete banner
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete banner successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

// ------------- COMMENT ------------- //

/**
 * @swagger
 * components:
 *   schemas:
 *     CommetnImageUpload:
 *       type: object
 *       properties:
 *         review:
 *           type: string
 *           format: binary
 *           items:
 *              type: string
 *           maxItems: 3
 *         comment:
 *           type: string
 *         productId:
 *           type: number
 */

/**
 * @swagger
 *  /api/comment/add:
 *    post:
 *      summary: Create a new comment
 *      tags: [Comment]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CommetnImageUpload'
 *      responses:
 *        201:
 *          description: Comment created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/comment/all:
 *   get:
 *     summary: Comment all
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *       - in: query
 *         name: subcategoryId
 *         type: number
 *         minimum: 1
 *     responses:
 *       200:
 *         description: Comment all successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     tags: [Comment]
 *     summary: Delete comment
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete comment successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

// ------------- CUSTOMER ------------- //

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerImageUpload:
 *       type: object
 *       properties:
 *         img:
 *           type: string
 *           format: binary
 *         fullname:
 *           type: string
 *         gender:
 *           type: string
 *           enum:
 *              - male
 *              - fmale
 *         email:
 *           type: string
 */

/**
 * @swagger
 *  /api/customer/register:
 *    post:
 *      summary: Create a new customer
 *      tags: [Customer]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CustomerImageUpload'
 *      responses:
 *        201:
 *          description: Customer created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/customer/all:
 *   get:
 *     summary: Customer all
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *     responses:
 *       200:
 *         description: Customer all successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/customer/favorite:
 *   get:
 *     summary: Customer favorite
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *     responses:
 *       200:
 *         description: Customer favorite successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/customer/basket:
 *   get:
 *     summary: Customer basket
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *     responses:
 *       200:
 *         description: Customer basket successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/customer/followed:
 *   get:
 *     summary: Customer followed
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *     responses:
 *       200:
 *         description: Customer followed successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/customer/orders:
 *   get:
 *     summary: Customer orders
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *     responses:
 *       200:
 *         description: Customer orders successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/customer/profile:
 *   get:
 *     summary: Customer profile
 *     tags:
 *       - Customer
 *     responses:
 *       200:
 *         description: Customer profile successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
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
 *      responses:
 *        201:
 *          description: Notification created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/notification/all:
 *   get:
 *     summary: Notification all
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *     responses:
 *       200:
 *         description: Notification all successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 *  /api/notification/update:
 *    put:
 *      summary: Update notification
 *      tags: [Notification]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                status:
 *                  type: string
 *                  enum:
 *                    - sent
 *                    - on-wait
 *      responses:
 *        201:
 *          description: Notification update successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/notification/{id}:
 *   delete:
 *     tags: [Notification]
 *     summary: Delete notification
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete notification successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

// --------------- PRODUCT ------------- //

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
 *           items:
 *              type: string
 *           maxItems: 20
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
 */

/**
 * @swagger
 *  /api/product/add:
 *    post:
 *      summary: Create a new product
 *      tags: [Product]
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
 *  /api/product/add/review:
 *    post:
 *      summary: Create a new review
 *      tags: [Product]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                star:
 *                  type: number
 *                productId:
 *                  type: number
 *      responses:
 *        201:
 *          description: Review created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CouponImageUpload:
 *       type: object
 *       properties:
 *         img:
 *           type: string
 *           format: binary
 *           items:
 *              type: string
 *           maxItems: 1
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
 *         conditions:
 *           type: string
 *           enum:
 *             - on-register
 *             - on-follow
 *             - min-buy
 *         min_amount:
 *           type: number
 *         limit:
 *           type: number
 *         start_date:
 *           type: string
 *         end_date:
 *           type: string
 *         isPublic:
 *           type: boolean
 */

/**
 * @swagger
 *  /api/product/add/coupon:
 *    post:
 *      summary: Create a new coupon
 *      tags: [Product]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CouponImageUpload'
 *      responses:
 *        201:
 *          description: Coupon created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/product/add/offer:
 *    post:
 *      summary: Create a new offer
 *      tags: [Product]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                currency:
 *                  type: string
 *                conditions:
 *                  type: string
 *                  enum:
 *                    - on-register
 *                    - on-follow
 *                    - min-buy
 *                discount:
 *                  type: number
 *                productId:
 *                  type: number
 *      responses:
 *        201:
 *          description: Offer created successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/product/all:
 *   get:
 *     summary: Product all
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: subcategoryId
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: brandId
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: gender
 *         type: string
 *         enum: [male, fmale, male-child, fmale-child, non-gender]
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: start_price
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: end_price
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: sort
 *         type: string
 *         enum: [id, sale_price]
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *       - in: query
 *         name: isActive
 *         type: string
 *         enum: [all]
 *     responses:
 *       200:
 *         description: Product all successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Product search
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: name
 *         type: string
 *     responses:
 *       200:
 *         description: Product search successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 *  /api/product/offers:
 *    get:
 *      summary: Product offers
 *      tags: [Product]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Product offers successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/product/top/selling:
 *    get:
 *      summary: Product top selling
 *      tags: [Product]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Product top selling successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/product/top/liked:
 *    get:
 *      summary: Product top liked
 *      tags: [Product]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Product top liked successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/product/reviews/{id}:
 *    get:
 *      summary: Product reviews
 *      tags: [Product]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *      responses:
 *        200:
 *          description: Product reviews successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/product/categories:
 *    get:
 *      summary: Product categories
 *      tags: [Product]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Product categories successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/product/subcategories:
 *    get:
 *      summary: Product subcategories
 *      tags: [Product]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Product subcategories successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/product/brands:
 *    get:
 *      summary: Product brands
 *      tags: [Product]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: Product brands successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/product/likes:
 *   get:
 *     summary: Product likes
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: id
 *         type: number
 *     responses:
 *       200:
 *         description: Product likes successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/product/{slug}:
 *   get:
 *     summary: Product likes
 *     tags:
 *       - Product
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Product likes successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     tags: [Product]
 *     summary: Delete product
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete product successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
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
 * /api/seller/top:
 *   get:
 *     summary: Top seller
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: [all, true, false]
 *         default: all
 *     responses:
 *       200:
 *         description: Top seller successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/all:
 *   get:
 *     summary: All seller
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: order
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: ['true', 'false']
 *       - in: query
 *         name: sort
 *         type: string
 *         enum: ['id', 'name', 'store_number']
 *       - in: query
 *         name: categoryId
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: store_floor
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: store_number
 *         type: number
 *         minimum: 1
 *     responses:
 *       200:
 *         description: All seller successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/orders:
 *   get:
 *     summary: Seller orders
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: query
 *         name: order
 *         type: string
 *         enum: ['asc', 'desc']
 *         default: asc
 *       - in: query
 *         name: status
 *         type: string
 *         enum: ['new', 'ondelivery', 'completed', 'cancelled']
 *       - in: query
 *         name: sort
 *         type: string
 *         enum: ['id', 'time']
 *     responses:
 *       200:
 *         description: Seller orders successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 *  /api/seller/order/detail/{id}:
 *    get:
 *      summary: Order detail
 *      tags: [Seller]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: integer
 *      responses:
 *        200:
 *          description: Order detail successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/seller/followers/{id}:
 *    get:
 *      summary: Followers detail
 *      tags: [Seller]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: integer
 *      responses:
 *        200:
 *          description: Followers detail successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/seller/profile/{id}:
 *    get:
 *      summary: Seller detail
 *      tags: [Seller]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: integer
 *      responses:
 *        200:
 *          description: Seller detail successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * /api/seller/products:
 *   get:
 *     summary: Seller products
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: sort
 *         type: string
 *         enum: ['id', 'sale_price']
 *       - in: query
 *         name: order
 *         type: string
 *         enum: ['asc', 'desc']
 *       - in: query
 *         name: sellerId
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: start_price
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: end_price
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: subcategoryId
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: brandId
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: gender
 *         type: string
 *         enum: ['male', 'fmale']
 *       - in: query
 *         name: isActive
 *         type: string
 *         enum: ['all']
 *     responses:
 *       200:
 *         description: Seller products successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/statistic:
 *   get:
 *     summary: Seller statistic
 *     tags: [Seller]
 *     200:
 *       description: Seller statistic successful
 *     400:
 *       description: Invalid request body
 *     500:
 *       description: Internal server error
 */

/**
 * @swagger
 * /api/seller/videos:
 *   get:
 *     summary: Seller videos
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         minimum: 1
 *       - in: query
 *         name: sellerId
 *         type: number
 *         minimum: 1
 *     responses:
 *       200:
 *         description: Seller videos successful
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
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
 *  /api/seller/update:
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
 * /api/seller/delete:
 *   delete:
 *     tags: [Seller]
 *     summary: Delete seller
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Delete seller successfully
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
 *  /api/user/verification:
 *    post:
 *      summary: Verification user
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  description: Verification code
 *      responses:
 *        200:
 *          description: Verification successfully
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
 *  /api/user/check:
 *    post:
 *      summary: Check user
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  description: Check code
 *      responses:
 *        200:
 *          description: Check successfully
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
 *  /api/user/reset/password:
 *    post:
 *      summary: Reset password user
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  description: Reset password code
 *      responses:
 *        200:
 *          description: Reset password successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/user/reset/subscription:
 *    post:
 *      summary: Reset subscription user
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  description: Reset subscription code
 *      responses:
 *        200:
 *          description: Reset subscription successfully
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
 *                id:
 *                  type: number
 *                  description: Product id
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
 *  /api/user/add/basket:
 *    post:
 *      summary: Add Basket
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                quantity:
 *                  type: number
 *                  description: Quantity
 *                productId:
 *                  type: number
 *                  description: ProductId
 *      responses:
 *        201:
 *          description: Basket add successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/user/add/follower/{id}:
 *    post:
 *      summary: Follower add
 *      tags: [User]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: number
 *      responses:
 *        201:
 *          description: Folloer add successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MessageImageUpload:
 *       type: object
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *         content:
 *           type: string
 *         userId:
 *           type: number
 */

/**
 * @swagger
 *  /api/user/add/message:
 *    post:
 *      summary: User message
 *      tags: [User]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/MessageImageUpload'
 *      responses:
 *        200:
 *          description: User message successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/user/all:
 *    get:
 *      summary: User all permissions
 *      tags: [Admin]
 *      parameters:
 *        - in: query
 *          name: QueryControl
 *          schema:
 *            $ref: '#/components/schemas/QueryControl'
 *      responses:
 *        200:
 *          description: User all permissions successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/user/messages/{id}:
 *    get:
 *      summary: Message detail
 *      tags: [User]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *      responses:
 *        200:
 *          description: Message detail successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/user/logout:
 *    get:
 *      summary: Logout detail
 *      tags: [User]
 *      responses:
 *        200:
 *          description: Logout detail successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

// ---------------- VIDEOS -------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     VideoUpload:
 *       type: object
 *       properties:
 *         video:
 *           type: string
 *           format: binary
 *         desc:
 *           type: string
 *         tags:
 *           type: array
 */

/**
 * @swagger
 *  /api/video/add:
 *    post:
 *      summary: Video add
 *      tags: [Video]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/VideoUpload'
 *      responses:
 *        200:
 *          description: Video add successfully
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/video/random:
 *    get:
 *      summary: Random
 *      tags: [Video]
 *      responses:
 *        200:
 *          description: Random successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  /api/video/{id}:
 *    get:
 *      summary: Video detail
 *      tags: [Video]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *      responses:
 *        200:
 *          description: Video detail successful
 *        400:
 *          description: Invalid request body
 *        500:
 *          description: Internal server error
 */