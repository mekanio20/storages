const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Op } = require('sequelize')

class BannerService {
    // GET
    async allBannerService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'id'
            let order = q.order || 'asc'
            let whereState = {}
            if (q.type) whereState.type = q.type
            if (q.size) whereState.size = q.size
            if (q.isMain) whereState.userId = { [Op.ne]: 3 }
            const banners = await Models.Banners.findAndCountAll({
                where: whereState,
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            }).catch((err) => console.log(err))
            if (banners.count === 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', banners)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
    // POST
    async addBannerService(body, user, filenames) {
        try {
            const group = await Models.Groups.findOne({ attributes: ['name'], where: { id: user.group } })
            if (group.name === 'SELLERS') {
                body.type = 'profile'
                const seller = await Models.Sellers.findOne({
                    attributes: ['subscriptionId'],
                    where: {
                        userId: user.id,
                        isVerified: true
                    }
                }).catch((err) => console.log(err))
                const limit = await Models.Subscriptions.findOne({
                    attributes: ['seller_banner_limit'],
                    where: { id: seller.subscriptionId }
                }).catch((err) => console.log(err))
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
            }).catch((err) => console.log(err))
            return Response.Created('Banner döredildi!', banner)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new BannerService()