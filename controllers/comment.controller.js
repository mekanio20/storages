const commentService = require('../services/comment.service')

class CommentController {
    // POST
    async addComment(req, res) {
        try {
            const data = await commentService.addCommentService(req.body, req.files, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    
    // GET
    async allComment(req, res) {
        try {
            const data = await commentService.allCommentService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // DELETE
    async deleteComment(req, res) {
        try {
            const data = await commentService.deleteCommentService(req.params.id, req.user)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
}

module.exports = new CommentController()