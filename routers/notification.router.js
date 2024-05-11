const router = require('express').Router()
const notificationController = require('../controllers/notification.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const notificationSchema = require('../validates/notification.schema')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/add',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(notificationSchema.addNotification, 'body'),
    notificationController.addNotification)

// GET
router.get('/all',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(baseSchema.queryControl, 'query'),
    notificationController.allNotification)

// PUT
router.put('/update',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(notificationSchema.updateNotification, 'body'),
    notificationController.updateNotification)

// DELETE
router.delete('/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(baseSchema.idControl, 'params'),
    notificationController.deleteNotification)

module.exports = router