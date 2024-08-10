const router = require('express').Router()
const commentController = require('../controllers/comment.controller')
const accessMiddleware = require('../middlewares/access.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const imagesMiddleware = require('../middlewares/images.middleware')
const valdidationMiddleware = require('../middlewares/validation.middleware')
const commentSchema = require('../validates/comment.schema')
const baseSchema = require('../validates/base.schema')

// POST
router.post('/add',
    authMiddleware, accessMiddleware(false),
    imagesMiddleware(process.env.PRODUCT_REVIEW).fields([
        { name: "review", maxCount: 3 }
    ]),
    valdidationMiddleware(commentSchema.addComment, 'body'),
    commentController.addComment)

// GET
router.get('/all',
    valdidationMiddleware(commentSchema.allComment, 'query'),
    commentController.allComment)

router.get('/seller',
    authMiddleware, accessMiddleware(false),
    valdidationMiddleware(commentSchema.allComment, 'query'),
    commentController.sellerComment)

// DELETE
router.delete('/:id',
    authMiddleware, accessMiddleware(true),
    valdidationMiddleware(baseSchema.idControl, 'params'),
    commentController.deleteComment)

module.exports = router