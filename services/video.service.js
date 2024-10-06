const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')

class VideoService {
    // POST
    async addVideoService(body, video, userId) {
        try {
            const sellerId = await Verification.isSeller(userId)
            if (isNaN(sellerId)) return sellerId
    
            const videoPath = path.join(__dirname, `../public/videos/${video.filename}`)
            const thumbnailFilename = `${video.filename.split('.')[0]}.png`
            const thumbnailPath = path.join(__dirname, '../public/thumbnails')
    
            ffmpeg(videoPath)
                .on('filenames', filenames => console.log('Will generate ' + filenames.join(', ')))
                .on('end', () => console.log('Screenshots taken'))
                .screenshots({
                    count: 1,
                    folder: thumbnailPath,
                    filename: thumbnailFilename
                })
    
            const videoRecord = await Models.Videos.create({
                desc: body.desc,
                video: video.filename,
                thumbnail: thumbnailFilename,
                sellerId
            })
    
            if (body?.tags?.length) {
                await Promise.all(body.tags.map(async tagName => {
                    const [tag] = await Models.Tags.findOrCreate({ where: { name: tagName } })
                    if (tag?.id) {
                        await Models.VideoTags.create({ videoId: videoRecord.id, tagId: tag.id })
                    }
                }))
            }
    
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    
    // GET
    async getVideoDataService(id) {
        try {
            const videoData = await Models.Videos.findOne({
                where: { id, isActive: true },
                attributes: ['id', 'desc'],
                include: {
                    model: Models.Sellers,
                    attributes: ['id', 'name', 'logo']
                }
            })

            return videoData
                ? Response.Success('Üstünlikli!', videoData)
                : Response.BadRequest('Wideo tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    // DELETE
    async deleteVideoService(id, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }

            const videoData = await Models.Videos.destroy({ where: { id, sellerId: seller } })

            return videoData
                ? Response.Success('Üstünlikli!', videoData)
                : Response.BadRequest('Wideo tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new VideoService()