const router = require('express').Router()
const bannerController = require('../controllers/banner.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const bannerSchema = require('../validates/banner.schema')

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

router.post('/add',
    // authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BANNERS_PATH).fields([
        { name: "tm_img", maxCount: 1 },
        { name: "ru_img", maxCount: 1 },
        { name: "en_img", maxCount: 1 }
    ]),
    valdidationMiddleware(bannerSchema.addBanner, 'body'),
    bannerController.addBanner)

module.exports = router