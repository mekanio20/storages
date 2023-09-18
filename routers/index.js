const router = require('express').Router()
const userRouter = require('../routers/user.router')
const adminRouter = require('../routers/admin.router')
const sellerrouter = require('../routers/seller.router')

router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/seller', sellerrouter)

module.exports = router