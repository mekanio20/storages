const router = require('express').Router()
const videoController = require('../controllers/video.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const videoMiddleware = require('../middlewares/video.middleware')
const videoLimitMiddleware = require('../middlewares/video-limit.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const videoSchema = require('../validates/video.schema')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/add',
    authMiddleware,
    // accessMiddleware(false),
    videoMiddleware(process.env.VIDEO_PATH).single('video'),
    valdidationMiddleware(videoSchema.addVideo, 'body'),
    videoLimitMiddleware,
    videoController.addVideo)

// GET
router.get('/random', videoController.getRandomId)

router.get('/data/:id',
    valdidationMiddleware(baseSchema.idControl, 'params'),
    videoController.getVideoData)

router.get('/:id',
    valdidationMiddleware(baseSchema.idControl, 'params'),
    videoController.getVideo)

// DELETE
router.delete('/:id',
    authMiddleware,
    // accessMiddleware(true),
    valdidationMiddleware(baseSchema.idControl, 'params'),
    videoController.deleteVideo)

module.exports = router