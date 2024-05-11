const Response = require('../helpers/response.service')
const Models = require('../config/models')

class BannerService {
    // POST
    async addBannerService(body, user, filenames) {
        try {
            const group = await Models.Groups.findOne({ attributes: ['name'], where: { id: user.group } })
            if (group.name === 'SELLERS') {
                const seller = await Models.Sellers.findOne({
                    attributes: ['subscriptionId'],
                    where: {
                        userId: user.id,
                        isVerified: true
                    }
                })
                const limit = await Models.Subscriptions.findOne({
                    attributes: ['seller_banner_limit'],
                    where: { id: seller.subscriptionId }
                })
                const bannerCount = await Models.Banners.count({ where: { userId: user.id } })
                console.log('seller banner limit -> ', limit.seller_banner_limit);
                console.log('banner count -> ', bannerCount);
                if (Number(limit.seller_banner_limit) <= Number(bannerCount)) {
                    return Response.Forbidden('Limidiniz doldy!', [])
                }
            }
            const banner = await Models.Banners.create({
                tm_img: filenames.tm_img[0].filename,
                ru_img: filenames.ru_img ? filenames.ru_img[0].filename : null,
                en_img: filenames.en_img ? filenames.en_img[0].filename : null,
                url: body.url,
                type: body.type,
                sort_order: body.sort_order,
                start_date: body.start_date,
                end_date: body.end_date,
                userId: user.id
            })
            return Response.Created('Banner döredildi!', banner)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new BannerService()