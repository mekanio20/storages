const Response = require('../services/response.service')
const { Banners } = require('../config/models')

class BannerService {
    async addBannerService(oby, filenames) {
        try {
            const { tm_img, ru_img, en_img } = filenames
            const banner = await Banners.create({
                tm_img: tm_img[0].filename,
                ru_img: ru_img[0].filename || null,
                en_img: en_img[0].filename || null,
                url: oby.url,
                type: oby.type,
                sort_order: oby.sort_order,
                start_date: oby.start_date,
                end_date: oby.end_date,
                userId: oby.userId
            })
            return Response.Created('Banner döredildi!', banner)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new BannerService()