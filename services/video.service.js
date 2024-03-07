const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class VideoService {
    // POST
    async addVideoService(body, video, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            await Models.Videos.create({
                desc: body.desc,
                hesdek: body.hesdek,
                video: video.filename,
                sellerId: seller
            }).catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    // GET
    async getVideoService(id) {
        try {
            const video = await Models.Videos.findOne({ where: { id: Number(id), isActive: true } })
            if (!video) { return Response.BadRequest('Wideo tapylmady!', []) }
            return Response.Success('Üstünlikli!', video)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new VideoService()