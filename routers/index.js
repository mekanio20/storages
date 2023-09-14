const router = require('express').Router()
const userRouter = require('../routers/user.router')
const adminRouter = require('../routers/admin.router')

router.use('/user', userRouter)
router.use('/admin', adminRouter)

module.exports = router