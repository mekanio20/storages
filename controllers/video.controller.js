const Models = require('../config/models')
const Response = require('../helpers/response.service')
const videoService = require('../services/video.service')
const path = require('path')
const fs = require("fs")
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
            const video = await Models.Videos.findOne({
                attributes: ['video'],
                where: { id: req.params.id, isActive: true }
            }).catch((err) => console.log(err))
            if (!video) {
                const response = await Response.BadRequest('Wideo tapylmady!', [])
                return res.status(404).json(response)
            }

            const CHUNK_SIZE = 10 ** 6
            const MEDIA_ROOT = path.join(__dirname, "../public/videos/")
            const videoPath = path.join(MEDIA_ROOT, video.video)
            const range = req.headers.range
            
            if (!fs.existsSync(videoPath)) { return res.status(404).send("Video couldn't found!") }
            const videoSize = fs.statSync(videoPath).size

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

                // Create headers
                const contentLength = end - start + 1
                const headers = {
                    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": contentLength,
                    "Content-Type": "video/mp4"
                }

                // HTTP Status 206 for Partial Content
                res.writeHead(206, headers)

                // create video read stream for this particular chunk
                const videoStream = fs.createReadStream(videoPath, { start, end })

                // Stream the video chunk to the client
                videoStream.pipe(res)
            } else {
                const head = {
                    "Content-Length": videoSize,
                    "Content-Type": "video/mp4",
                }
                res.writeHead(200, head)
                fs.createReadStream(videoPath).pipe(res)
            }
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
    async getVideoData(req, res) {
        try {
            const data = await videoService.getVideoDataService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
}

module.exports = new VideoController()