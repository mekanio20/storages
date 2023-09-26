const router = require('express').Router()
const userRouter = require('./user.router')
const adminRouter = require('./admin.router')
const sellerrouter = require('./seller.router')

router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/seller', sellerrouter)

module.exports = router