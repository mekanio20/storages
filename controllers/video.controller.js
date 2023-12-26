const Response = require('../helpers/response.service')
const videoService = require('../services/video.service')

class VideoController {

    // POST
    async addVideo(req, res) {
        try {
            const body = req.body
            const data = await videoService.addVideoService(body)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

module.exports = new VideoController()