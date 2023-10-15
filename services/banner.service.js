const Response = require('../services/response.service')
const { Banners } = require('../config/models')

class BannerService {
    async addBannerService(body, filenames) {
        try {
            const { tm_img, ru_img, en_img } = filenames
            const banner = await Banners.create({
                tm_img: tm_img[0].filename,
                ru_img: ru_img[0].filename || null,
                en_img: en_img[0].filename || null,
                url: body.url,
                type: body.type,
                sort_order: body.sort_order,
                start_date: body.start_date,
                end_date: body.end_date,
                userId: body.userId
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            return Response.Created('Banner döredildi!', banner)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new BannerService()