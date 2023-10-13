const router = require('express').Router()
const bannerController = require('../controllers/banner.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const bannerSchema = require('../validates/banner.schema')

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