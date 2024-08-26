const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')

class VideoService {
    // POST
    async addVideoService(body, video, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const videoPath = path.join(__dirname, `../public/videos/${video.filename}`)
            const thumbnailPath = path.join(__dirname, '../public/thumbnails')
            ffmpeg(videoPath)
                .on('filenames', function (filenames) { console.log('Will generate ' + filenames.join(', ')) })
                .on('end', function () { console.log('Screenshots taken') })
                .screenshots({
                    count: 1,
                    folder: thumbnailPath,
                    filename: `${video.filename.split('.')[0]}.png`
                })
            const videos = await Models.Videos.create({
                desc: body.desc,
                video: video.filename,
                thumbnail: `${video.filename.split('.')[0]}.png`,
                sellerId: seller
            }).catch((err) => { console.log(err) })
            if (body?.tags?.length) {
                for (let i = 0; i < body.tags.length; i++) {
                    const [tag, _] = await Models.Tags.findOrCreate({
                        where: { name: body.tags[i] },
                        defaults: { name: body.tags[i] }
                    }).catch((err) => { console.log(err) })
                    if (tag?.id) { await Models.VideoTags.create({ videoId: videos.id, tagId: tag.id }) }
                }
            }
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
    // GET
    async getVideoDataService(id) {
        try {
            const videoData = await Models.Videos.findOne({
                where: { id: Number(id), isActive: true },
                attributes: ['id', 'desc'],
                include: {
                    model: Models.Sellers,
                    attributes: ['id', 'name', 'logo']
                }
            }).catch((err) => console.log(err))
            if (!videoData) { return Response.BadRequest('Wideo tapylmady!', []) }
            return Response.Success('Üstünlikli!', videoData)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new VideoService()