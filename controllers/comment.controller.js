const Response = require('../helpers/response.service')
const commentService = require('../services/comment.service')

class CommentController {
    // POST
    async addComment(req, res) {
        try {
            const body = req.body
            const files = req.files
            const userId = req.user.id
            const data = await commentService.addCommentService(body, files, userId)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }
    
    // GET
    async allComment(req, res) {
        try {
            const query = req.query
            const data = await commentService.allCommentService(query)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }
}

module.exports = new CommentController()