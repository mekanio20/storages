const Response = require('../services/response.service')
const { Banners, Subscriptions, Sellers, Groups } = require('../config/models')

class BannerService {
    async addBannerService(body, user, filenames) {
        try {
            const group = await Groups.findOne({ attributes: ['name'], where: { id: user.group } })
            if (group.name === 'SELLERS') {
                const sellerId = await Sellers.findOne({ 
                    attributes: ['subscriptionId'],
                    where: {
                        userId: user.id,
                        isVerified: true
                    }
                })
                const limit = await Subscriptions.findOne({ 
                    attributes: ['seller_banner_limit'], 
                    where: { id: sellerId.subscriptionId } 
                })
                const bannerCount = await Banners.count({ where: { userId: user.id } })
                console.log('seller banner limit -> ', limit.seller_banner_limit);
                console.log('banner count -> ', bannerCount);
                if (Number(limit.seller_banner_limit) <= Number(bannerCount)) {
                    return Response.Forbidden('Limidiniz doldy!', [])
                }
            }
            const banner = await Banners.create({
                tm_img: filenames.tm_img[0].filename,
                ru_img: filenames.ru_img ? filenames.ru_img[0].filename : null,
                en_img: filenames.en_img ? filenames.en_img[0].filename : null,
                url: body.url,
                type: body.type,
                sort_order: body.sort_order,
                start_date: body.start_date,
                end_date: body.end_date,
                userId: body.userId
            })
            return Response.Created('Banner döredildi!', banner)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new BannerService()