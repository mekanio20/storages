const router = require('express').Router()
const notificationController = require('../controllers/notification.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const notificationSchema = require('../validates/notification.schema')

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

router.post('/add',
    // authMiddleware, accessMiddleware(false),
    valdidationMiddleware(notificationSchema.addNotification, 'body'),
    notificationController.addNotification)

module.exports = router