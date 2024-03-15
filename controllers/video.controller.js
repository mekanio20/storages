const Models = require('../config/models')
const Response = require('../helpers/response.service')
const videoService = require('../services/video.service')
const _ = require('lodash')

class VideoController {
    // POST
    async addVideo(req, res) {
        try {
            const data = await videoService.addVideoService(req.body, req.file, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    // GET
    async getVideo(req, res) {
        try {
            const data = await videoService.getVideoService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    async getRandomId(req, res) {
        try {
            const ids = await Models.Videos.findAll({ attributes: ['id'], where: { isActive: true } })
            const idArray = ids.map(idObj => idObj.id)
            const shuffledIds = _.shuffle(idArray)
            const data = await Response.Success('Üstünlikli!', shuffledIds)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
}

module.exports = new VideoController()