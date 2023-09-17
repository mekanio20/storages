const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const accessMiddleware = require('../middlewares/access.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const userSchema = require('../validates/user.schema')

router.post('/login', 
    valdidationMiddleware(userSchema.login, 'body'), 
    userController.userLogin)

router.post('/register', 
    valdidationMiddleware(userSchema.register, 'body'), 
    userController.userRegister)

router.get('/profile/:id', 
    // authMiddleware, accessMiddleware(true),
    valdidationMiddleware(userSchema.profile, 'params'), 
    userController.userProfile)

module.exports = router