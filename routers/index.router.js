const router = require('express').Router()
const userRouter = require('./user.router')
const adminRouter = require('./admin.router')
const sellerRouter = require('./seller.router')
const bannerRouter = require('./banner.router')
const notificationRouter = require('./notification.router')

router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/seller', sellerRouter)
router.use('/banner', bannerRouter)
router.use('/notification', notificationRouter)

module.exports = router