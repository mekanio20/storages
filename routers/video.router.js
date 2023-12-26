const router = require('express').Router()
const videoController = require('../controllers/video.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const fileMiddleware = require('../middlewares/file.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const videoSchema = require('../validates/video.schema')

// POST
router.post('/add',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(videoSchema.addVideo, 'body'),
    fileMiddleware(process.env.VIDEO_PATH).single('video'),
    videoController.addVideo)

module.exports = router