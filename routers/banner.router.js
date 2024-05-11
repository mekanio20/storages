const router = require('express').Router()
const bannerController = require('../controllers/banner.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const validationMiddleware = require('../middlewares/validation.middleware')
const bannerSchema = require('../validates/banner.schema')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/add',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.BANNERS_PATH).fields([
        { name: "tm_img", maxCount: 1 },
        { name: "ru_img", maxCount: 1 },
        { name: "en_img", maxCount: 1 }
    ]),
    validationMiddleware(bannerSchema.addBanner, 'body'),
    bannerController.addBanner)

// GET
router.get('/all',
    authMiddleware, accessMiddleware(false),
    validationMiddleware(baseSchema.queryControl, 'query'),
    bannerController.allBanner)

// DELETE
router.delete('/:id',
    authMiddleware, accessMiddleware(true),
    validationMiddleware(baseSchema.idControl, 'params'),
    bannerController.deleteBanner)

module.exports = router