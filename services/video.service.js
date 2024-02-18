const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const fs = require('fs')

class VideoService {
    // POST
    async addVideoService(body, video, userId) {
        try {
            const sellerId = await Verification.isSeller(userId)
            if (!sellerId) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            await Models.Videos.create({
                desc: body.desc,
                hesdek: body.hesdek,
                video: video.filename,
                sellerId: sellerId
            }).catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    // GET
    async getVideoService(id) {
        try {
            const video = await Models.Videos.findOne({ where: { id: Number(id) } })
            const videoPath = '/Users/mekan/Desktop/optovoy/storages/public/videos' + video.video
            const _video = fs.createReadStream(videoPath);
            
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new VideoService()