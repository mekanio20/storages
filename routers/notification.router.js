const router = require('express').Router()
const notificationController = require('../controllers/notification.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const notificationSchema = require('../validates/notification.schema')

// POST
router.post('/add',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(notificationSchema.addNotification, 'body'),
    notificationController.addNotification)

// GET
router.get('/all',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(notificationSchema.allNotification, 'query'),
    notificationController.allNotification)

module.exports = router